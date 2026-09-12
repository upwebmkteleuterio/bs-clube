import React, { useState } from 'react';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; cota: number; vagas: number; drawDate: string }) => void;
  isSubmitting: boolean;
}

export default function NewCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewCategoryModalProps) {
  const [name, setName] = useState('');
  const [cota, setCota] = useState('');
  const [vagas, setVagas] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome do bolão.');
      return;
    }
    const cotaNum = parseFloat(cota);
    if (isNaN(cotaNum) || cotaNum <= 0) {
      setError('Informe um valor de cota válido.');
      return;
    }
    const vagasNum = parseInt(vagas, 10);
    if (isNaN(vagasNum) || vagasNum <= 0) {
      setError('Informe a quantidade de vagas.');
      return;
    }
    if (!drawDate) {
      setError('Selecione a data do sorteio.');
      return;
    }

    setError('');
    // Format date to DD/MM/YYYY if YYYY-MM-DD
    const parts = drawDate.split('-');
    const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : drawDate;

    onSubmit({
      name: name.trim(),
      cota: cotaNum,
      vagas: vagasNum,
      drawDate: formattedDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl border border-slate-800 p-6 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          aria-label="Fechar"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="mb-5">
          <h3 className="font-heading text-xl font-bold text-white flex items-center">
            <i className="fa-solid fa-tag text-emerald-400 mr-2"></i> Nova Categoria
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre uma nova modalidade de bolão para a vitrine pública.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Nome do Bolão</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sorteio BIG 100"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Valor da Cota (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={cota}
                onChange={(e) => setCota(e.target.value)}
                placeholder="25.00"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Vagas por Mesa
              </label>
              <input
                type="number"
                value={vagas}
                onChange={(e) => setVagas(e.target.value)}
                placeholder="100"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Data do Sorteio
            </label>
            <input
              type="date"
              value={drawDate}
              onChange={(e) => setDrawDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition mt-3 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Salvando...</span>
              </>
            ) : (
              <span>Salvar Categoria</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
