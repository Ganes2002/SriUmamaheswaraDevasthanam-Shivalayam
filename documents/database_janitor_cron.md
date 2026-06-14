# Database Janitor Functions & SQL Crons (Supabase/PostgreSQL)
**Project Name**: Sri Umamaheswara Devasthanam Web Portal

This document specifies the exact PostgreSQL PL/pgSQL stored procedures and `pg_cron` schedule registrations designed to implement the zero-cost automated midnight database sweeps. These scripts enforce the 365-day security isolation/purge rules and mathematical rollovers for lifetime contribution metrics.

---

## 1. Core Janitor Stored Procedure (`execute_midnight_janitor_sweeps`)

This SQL procedure acts as the direct transactional operator. It executes in a single isolated transaction bloc to maintain full mathematical consistency.

```sql
CREATE OR REPLACE FUNCTION execute_midnight_janitor_sweeps() 
RETURNS void AS $$
DECLARE
    purged_events_count integer := 0;
    purged_donors_count integer := 0;
    rolled_over_sum_inr decimal(15,2) := 0.00;
    purged_logs_count integer := 0;
    current_year_str varchar(4);
BEGIN
    -- Get current fiscal year string (e.g. '2026')
    SELECT TO_CHAR(CURRENT_DATE, 'YYYY') INTO current_year_str;

    -- 1. DEVOTIONAL EVENT DATA JANITOR
    -- Purge puja or festival event posts whose scheduled dates are older than 365 days
    DELETE FROM events 
    WHERE event_date < (CURRENT_DATE - INTERVAL '365 days');
    GET DIAGNOSTICS purged_events_count = ROW_COUNT;


    -- 2. DONOR DETAILS JANITOR & CUMULATIVE PRESERVATION LOGIC
    -- A. Calculate the total currency sum of individual donor ledger records older than 365 days before purging
    SELECT COALESCE(SUM(amount), 0.00) INTO rolled_over_sum_inr
    FROM donor_ledger 
    WHERE payment_date < (CURRENT_DATE - INTERVAL '365 days');

    -- B. If there is a sum to rollover, aggregate it safely to the 'yearly_audits' cumulative summary table
    IF rolled_over_sum_inr > 0 THEN
        -- Check if a record exists for the current fiscal year to aggregate into
        INSERT INTO yearly_audits (fiscal_year, total_amount, achievement_en, achievement_te, last_audited_at)
        VALUES (
            current_year_str, 
            rolled_over_sum_inr, 
            'Aggregated cumulative legacy donations rolled over from individual ledger.', 
            'ఖాతా పుస్తకం నుండి బదిలీ చేయబడిన సంచిత పాత విరాళాల నిధి.', 
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (fiscal_year) 
        DO UPDATE SET 
            total_amount = yearly_audits.total_amount + EXCLUDED.total_amount,
            last_audited_at = CURRENT_TIMESTAMP;
    END IF;

    -- C. Now purge individual donor metrics older than 365 days from the active visible ledger
    DELETE FROM donor_ledger 
    WHERE payment_date < (CURRENT_DATE - INTERVAL '365 days');
    GET DIAGNOSTICS purged_donors_count = ROW_COUNT;


    -- 3. ADMIN ACTIVITY HISTORY PURGE
    -- Permanently clear admin history logs older than 30 days to optimize storage limits
    DELETE FROM security_audit_logs 
    WHERE timestamp < (CURRENT_TIMESTAMP - INTERVAL '30 days');
    GET DIAGNOSTICS purged_logs_count = ROW_COUNT;


    -- 4. LOG THE SUCCESSFUL RUN INTO OUTCOME TRAIL
    INSERT INTO security_audit_logs (id, timestamp, action_text, log_category)
    VALUES (
        'cron-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD-HH24MISS'),
        CURRENT_TIMESTAMP,
        'Midnight schedule executed successfully. Obsolete events purged: ' || purged_events_count || 
        '. Individual donor listings purged and rolled over: ' || purged_donors_count || 
        ' (Rollover sum: ₹' || rolled_over_sum_inr || '). Obsolete logs cleared: ' || purged_logs_count,
        'cleaning'
    );

END;
$$ LANGUAGE plpgsql;
```

---

## 2. Automated Trigger Scheduling via `pg_cron`

Supabase supports `pg_cron` directly inside the dashboard control panel. Run the following command in your Supabase SQL Editor to schedule the janitor sweeps to trigger **automatically every single night at exactly midnight UTC**.

```sql
-- Enable the cron extension in Supabase
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the sweeps to run at 00:00 (Midnight) every day
SELECT cron.schedule(
    'midnight-database-janitor-sweeps', -- Unique Identifier of the job
    '0 0 * * *',                         -- Standard Cron Expression (Minute Hour Day-of-month Month Day-of-week)
    $$ SELECT execute_midnight_janitor_sweeps(); $$
);
```

---

## 3. Manual Overrides (Testing the Sweeps)

For local debugging or manual testing, committee members can execute the function manually inside the Supabase SQL Web Panel or by triggering a server-side action:

```sql
-- Execute the sweeps manually instantly
SELECT execute_midnight_janitor_sweeps();
```
