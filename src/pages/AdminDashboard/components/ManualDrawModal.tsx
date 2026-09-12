import React, { useState } from 'react';
import { ManualDrawInput } from '../../../types';

interface ManualDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (drawData: ManualDrawInput) => void;
  isExecuting: boolean;
}

export default function ManualDrawModal({
  isOpen,
  onClose,
  onSubmit,
  isExecuting,
}: ManualDrawModalProps) {
  const [concurso, setConcurso] = useState('2780');
  const [dataSorteio, setDataSorteio] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleNumberChange = (index: number, val: string) => {
    const num = val.replace(/\D/g, '').slice(0, 2);
    const updated = [...numbers];
    updated[index] = num;
    setNumbers(updated);
  };

  const handleSurpresinha = () => {
    const picked: number[] = [];
    while (picked.length < 6) {
      const rand = Math.floor(Math.random() * 60) + 1;
      if (!picked.includes(rand)) picked.push(rand);
    }
    picked.sort((a, b) => a - b);
    setNumbers(picked.map((n) => String(n).padStart(2, '0')));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concurso.trim()) {
      setError('Informe o número do concurso.');
      return;
    }
    const parsedNumbers = numbers
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 60);

    if (parsedNumbers.length !== 6) {
      setError('Informe 6 dezenas válidas (entre 01 e 60).');
      return;
    }

    const uniqueNumbers = new Set<number>(parsedNumbers);
    if (uniqueNumbers.size !== 6) {
      setError('As 6 dezenas não podem ser repetidas.');
      return;
    }

    setError('');
    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
    onSubmit({
      concurso: concurso.trim(),
      data: dataSorteio,
      dezenas: sortedNumbers,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-amber-500/30 p-6 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isExecuting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Fechar"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="mb-5 border-b border-slate-800 pb-4">
          <h3 className="font-heading text-xl font-bold text-white flex items-center text-amber-400">
            <i className="fa-solid fa-bolt mr-2 text-lg"></i> Gatilho Manual de Apuração
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Insira os resultados oficiais da Mega-Sena para apurar os bolões e creditar prêmios.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Concurso (Nº)
              </label>
              <input
                type="number"
                value={concurso}
                onChange={(e) => setConcurso(e.target.value)}
                placeholder="2780"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Data do Sorteio
              </label>
              <input
                type="date"
                value={dataSorteio}
                onChange={(e) => setDataSorteio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-400">
                Dezenas Sorteadas (01 - 60)
              </label>
              <button
                type="button"
                onClick={handleSurpresinha}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                <span>Gerar Aleatórias</span>
              </button>
            </div>
            <div className="flex justify-between gap-1.5 sm:gap-2">
              {numbers.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={2}
                  value={val}
                  onChange={(e) => handleNumberChange(idx, e.target.value)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-950 border border-slate-700/80 rounded-2xl text-center text-sm sm:text-base font-black text-white focus:border-amber-500 focus:outline-none font-mono"
                  placeholder="00"
                />
              ))}
            </div>
          </div>

          <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-start space-x-2">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i>
            <span>
              <strong>Atenção:</strong> A execução acionará imediatamente a distribuição de
              prêmios nas carteiras e a apuração dos bolões vinculados a este concurso.
            </span>
          </div>

          <button
            type="submit"
            disabled={isExecuting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition mt-2 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-amber-900/30"
          >
            {isExecuting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Apurando e creditando...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-gears"></i>
                <span>Executar Apuração Automática</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
