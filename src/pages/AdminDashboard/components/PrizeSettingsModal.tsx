import React, { useEffect, useState } from 'react';
import { PrizeSettings } from '../../../types';

interface PrizeSettingsModalProps {
  isOpen: boolean;
  settings?: PrizeSettings;
  onClose: () => void;
  onSubmit: (settings: PrizeSettings) => void;
  isSubmitting: boolean;
}

export default function PrizeSettingsModal({ isOpen, settings, onClose, onSubmit, isSubmitting }: PrizeSettingsModalProps) {
  const [housePercentage, setHousePercentage] = useState('25');
  const [winnerPercentage, setWinnerPercentage] = useState('75');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setHousePercentage(String(settings?.housePercentage ?? 25));
    setWinnerPercentage(String(settings?.winnerPercentage ?? 75));
    setError('');
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const house = Number(housePercentage);
  const winners = Number(winnerPercentage);
  const sum = Number((house + winners).toFixed(2));
  const isValid = Number.isFinite(house) && Number.isFinite(winners) && house >= 0 && house <= 100 && winners >= 0 && winners <= 100 && sum === 100;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) {
      setError('Os percentuais devem estar entre 0 e 100 e somar 100%.');
      return;
    }
    setError('');
    onSubmit({ housePercentage: house, winnerPercentage: winners });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="prize-settings-title">
      <div className="glass-card w-full max-w-md rounded-3xl border border-emerald-500/30 p-6 relative shadow-2xl">
        <button type="button" onClick={onClose} disabled={isSubmitting} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded" aria-label="Fechar">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <div className="mb-5">
          <h3 id="prize-settings-title" className="font-heading text-xl font-bold text-white flex items-center">
            <i className="fa-solid fa-sliders text-emerald-400 mr-2"></i> Configuração Global
          </h3>
          <p className="text-xs text-slate-400 mt-1">Define o padrão aplicado aos novos bolões.</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="global-house-percentage" className="block text-xs font-semibold text-slate-400 mb-1">Casa (%)</label>
              <input id="global-house-percentage" type="number" min="0" max="100" step="0.01" value={housePercentage} onChange={(event) => setHousePercentage(event.target.value)} required className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label htmlFor="global-winner-percentage" className="block text-xs font-semibold text-slate-400 mb-1">Ganhadores (%)</label>
              <input id="global-winner-percentage" type="number" min="0" max="100" step="0.01" value={winnerPercentage} onChange={(event) => setWinnerPercentage(event.target.value)} required className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
          <p className={`text-xs ${sum === 100 ? 'text-emerald-400' : 'text-rose-400'}`} role="status">Soma: {sum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%{sum !== 100 ? ' — deve ser 100%' : ''}</p>
          <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? <><i className="fa-solid fa-circle-notch fa-spin"></i><span>Salvando...</span></> : <span>Salvar configuração</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
