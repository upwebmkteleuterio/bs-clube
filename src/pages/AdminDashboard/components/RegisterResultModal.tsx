import React, { useEffect, useState } from 'react';
import { AdminCategory, RegisterResultInput } from '../../../types';

interface RegisterResultModalProps {
  isOpen: boolean;
  category: AdminCategory | null;
  onClose: () => void;
  onSubmit: (data: RegisterResultInput) => void;
  isSubmitting: boolean;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export default function RegisterResultModal({ isOpen, category, onClose, onSubmit, isSubmitting }: RegisterResultModalProps) {
  const [drawDate, setDrawDate] = useState('');
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !category) return;
    setDrawDate(category.drawDate?.slice(0, 10) || new Date().toISOString().slice(0, 10));
    setNumbers(category.numbers?.length === 6 ? category.numbers.map((number) => String(number).padStart(2, '0')) : ['', '', '', '', '', '']);
    setError('');
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleNumberChange = (index: number, value: string) => {
    const next = [...numbers];
    next[index] = value.replace(/\D/g, '').slice(0, 2);
    setNumbers(next);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!category.poolId || !category.drawId) {
      setError('Este bolão não possui um sorteio vinculado.');
      return;
    }
    if (!isValidDate(drawDate)) {
      setError('Selecione uma data de sorteio válida.');
      return;
    }
    const parsed = numbers.map((number) => Number(number));
    if (parsed.some((number) => !Number.isSafeInteger(number) || number < 1 || number > 60) || new Set(parsed).size !== 6) {
      setError('Informe exatamente 6 dezenas distintas entre 01 e 60.');
      return;
    }
    onSubmit({ poolId: category.poolId, drawId: category.drawId, drawDate, dezenas: parsed.sort((a, b) => a - b) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-amber-500/30 p-6 relative shadow-2xl">
        <button type="button" onClick={onClose} disabled={isSubmitting} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded" aria-label="Fechar">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <div className="mb-5 border-b border-slate-800 pb-4">
          <h3 className="font-heading text-xl font-bold text-white flex items-center text-amber-400">
            <i className="fa-solid fa-trophy mr-2 text-lg"></i> Registrar resultado
          </h3>
          <p className="text-xs text-slate-400 mt-1">{category.name} · Concurso {category.concurso || 'não informado'}</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="result-draw-date" className="block text-xs font-semibold text-slate-400 mb-1">Data do Sorteio</label>
            <input id="result-draw-date" type="date" value={drawDate} onChange={(event) => setDrawDate(event.target.value)} className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2" htmlFor="result-number-0">Dezenas oficiais (01 - 60)</label>
            <div className="flex justify-between gap-1.5 sm:gap-2">
              {numbers.map((value, index) => (
                <input key={index} id={`result-number-${index}`} type="text" inputMode="numeric" maxLength={2} value={value} onChange={(event) => handleNumberChange(index, event.target.value)} className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 border border-slate-700/80 rounded-2xl text-center text-sm sm:text-base font-black text-white focus:border-amber-500 focus:outline-none font-mono" placeholder="00" aria-label={`Dezena ${index + 1}`} />
              ))}
            </div>
          </div>
          <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
            Publicar o resultado encerra este bolão como concluído e disponibiliza o ranking e o resultado para os usuários.
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-amber-900/30">
            {isSubmitting ? <><i className="fa-solid fa-circle-notch fa-spin"></i><span>Publicando...</span></> : <><i className="fa-solid fa-check"></i><span>Publicar resultado</span></>}
          </button>
        </form>
      </div>
    </div>
  );
}
