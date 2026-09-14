import React, { useState } from 'react';
import { AdminCategoryInput } from '../../../types';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminCategoryInput) => void;
  isSubmitting: boolean;
}

const MAX_CURRENCY_DIGITS = 12;

function formatCota(digits: string) {
  if (!digits) return '';
  return (Number(digits) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export default function NewCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewCategoryModalProps) {
  const [name, setName] = useState('');
  const [concurso, setConcurso] = useState('');
  const [cotaDigits, setCotaDigits] = useState('');
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
    if (!/^\d+$/.test(concurso) || !Number.isSafeInteger(Number(concurso)) || Number(concurso) <= 0) {
      setError('Informe um número de concurso válido.');
      return;
    }
    const cotaNum = Number(cotaDigits) / 100;
    if (!Number.isFinite(cotaNum) || cotaNum <= 0) {
      setError('Informe um valor de cota válido.');
      return;
    }
    const vagasNum = Number(vagas);
    if (!Number.isSafeInteger(vagasNum) || vagasNum <= 0) {
      setError('Informe a quantidade de vagas.');
      return;
    }
    if (!isValidDate(drawDate)) {
      setError('Selecione uma data de sorteio válida.');
      return;
    }

    setError('');
    const parts = drawDate.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    onSubmit({
      name: name.trim(),
      concurso: concurso.trim(),
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
          <div id="new-category-error" className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2" role="alert">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-category-name" className="block text-xs font-semibold text-slate-400 mb-1">Nome do Bolão</label>
            <input
              id="new-category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sorteio BIG 100"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label htmlFor="new-category-contest" className="block text-xs font-semibold text-slate-400 mb-1">
              Número do Concurso Mega-Sena
            </label>
            <input
              id="new-category-contest"
              type="text"
              inputMode="numeric"
              value={concurso}
              onChange={(e) => setConcurso(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex: 2800"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-category-cota" className="block text-xs font-semibold text-slate-400 mb-1">
                Valor da Cota (R$)
              </label>
              <input
                id="new-category-cota"
                type="text"
                inputMode="numeric"
                value={formatCota(cotaDigits)}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/\D/g, '')
                    .replace(/^0+/, '')
                    .slice(0, MAX_CURRENCY_DIGITS);
                  setCotaDigits(digits);
                }}
                placeholder="R$ 0,00"
                aria-describedby={error ? 'new-category-error' : undefined}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>
            <div>
              <label htmlFor="new-category-slots" className="block text-xs font-semibold text-slate-400 mb-1">
                Vagas por Mesa
              </label>
              <input
                id="new-category-slots"
                type="number"
                min="1"
                step="1"
                value={vagas}
                onChange={(e) => setVagas(e.target.value)}
                placeholder="100"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="new-category-draw-date" className="block text-xs font-semibold text-slate-400 mb-1">
              Data do Sorteio
            </label>
            <input
              id="new-category-draw-date"
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
