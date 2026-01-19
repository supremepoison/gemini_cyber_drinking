import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { TRANSLATIONS } from '../constants';

interface LogPanelProps {
  logs: LogEntry[];
  lang: 'en' | 'zh';
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs, lang }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-48 md:h-full glass-panel rounded-xl p-6 font-sans text-xs overflow-y-auto flex flex-col gap-3 shadow-lg">
      <div className="text-luxury-gold border-b border-white/10 pb-2 mb-2 sticky top-0 bg-transparent z-10 uppercase tracking-widest font-bold">
        {t.logs}
      </div>
      {logs.map((log, idx) => (
        <div key={idx} className="mb-2 pb-2 border-b border-white/5 last:border-0">
          <div className="flex items-center gap-2 mb-1">
             <span className="text-gray-500 font-mono text-[10px]">Turn {log.turn.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-gray-300 leading-relaxed block">{log.message}</span>
          {log.changes && (
             <div className="text-[10px] text-gray-500 mt-1 flex gap-2">
               {Object.entries(log.changes).map(([k,v]) => {
                 const color = (v as number) > 0 ? 'text-green-400' : 'text-red-400';
                 return <span key={k} className={`${color}`}>{k.slice(0,3)}: {(v as number) > 0 ? '+' : ''}{v}</span>
               })}
             </div>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};