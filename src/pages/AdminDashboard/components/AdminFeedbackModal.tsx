import React from 'react';

interface AdminFeedbackModalProps {
  config: { title: string; msg: string; icon: string } | null;
  onClose: () => void;
}

export default function AdminFeedbackModal({ config, onClose }: AdminFeedbackModalProps) {
  if (!config) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-sm rounded-3xl border border-slate-800 p-6 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl mx-auto shadow-inner">
          <i className={`fa-solid ${config.icon}`}></i>
        </div>
        <h4 className="font-heading font-bold text-lg text-white">{config.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{config.msg}</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  );
}
