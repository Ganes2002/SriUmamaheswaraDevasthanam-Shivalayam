import React from 'react';
import { Activity } from 'lucide-react';
import { AdminLog } from '../../types';

interface AdminLogsViewerProps {
  systemLogs: AdminLog[];
}

export default function AdminLogsViewer({ systemLogs }: AdminLogsViewerProps) {
  return (
    <div id="admin-logs-section" className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
      <h4 className="font-serif text-sm font-extrabold text-[#E29524] uppercase tracking-wide mb-4 flex items-center space-x-1 border-b border-stone-100 pb-2">
        <Activity size={15} />
        <span>Midnight Scheduler Sweeps & Audit Log Logs (30-day cleared)</span>
      </h4>
      
      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
        {systemLogs.map(lg => {
          let badgeColor = "bg-stone-100 text-stone-600";
          if (lg.category === 'cleaning') badgeColor = "bg-emerald-100 text-emerald-800 font-semibold";
          if (lg.category === 'security') badgeColor = "bg-red-100 text-red-800 font-bold";
          if (lg.category === 'edit') badgeColor = "bg-amber-100 text-[#7A1E1E]";
          if (lg.category === 'gallery') badgeColor = "bg-blue-100 text-blue-855";

          return (
            <div key={lg.id} className="p-3 bg-[#FCFBF7] border border-stone-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase ${badgeColor}`}>
                  {lg.category}
                </span>
                <span className="font-mono text-[9px] text-stone-500">
                  {lg.timestamp}
                </span>
              </div>
              <p className="font-sans text-stone-700 leading-normal font-medium">{lg.action}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
