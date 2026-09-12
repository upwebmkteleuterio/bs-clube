import React from 'react';

export default function HomeLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Mobile Skeletons */}
      <div className="md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800"></div>
                <div className="w-32 h-4 bg-slate-800 rounded"></div>
              </div>
              <div className="w-16 h-4 bg-slate-800 rounded-full"></div>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-slate-950/60 p-2.5 rounded-xl">
              <div className="h-6 bg-slate-800/80 rounded"></div>
              <div className="h-6 bg-slate-800/80 rounded"></div>
              <div className="h-6 bg-slate-800/80 rounded"></div>
              <div className="h-6 bg-slate-800/80 rounded"></div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 h-2 bg-slate-800 rounded-full"></div>
              <div className="w-20 h-7 bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeletons */}
      <div className="hidden md:block bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="h-6 bg-slate-800/70 rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-900/60 rounded-xl flex items-center px-4 gap-6">
              <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
              <div className="w-48 h-4 bg-slate-800 rounded"></div>
              <div className="w-24 h-4 bg-slate-800 rounded"></div>
              <div className="w-24 h-4 bg-slate-800 rounded"></div>
              <div className="flex-1"></div>
              <div className="w-24 h-8 bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
