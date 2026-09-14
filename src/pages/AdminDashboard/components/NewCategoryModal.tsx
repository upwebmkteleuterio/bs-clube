import React, { useEffect, useState } from 'react';
import { AdminCategory, AdminCategoryInput, PrizeSettings } from '../../../types';
import { useActiveQuotas } from '../../../hooks/useQuotas';

interface NewCategoryModalProps {
  isOpen: boolean;
  category?: AdminCategory | null;
  prizeSettings?: PrizeSettings;
  onClose: () => void;
  onSubmit: (data: AdminCategoryInput) => void;
  isSubmitting: boolean;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export default function NewCategoryModal({
  isOpen,
  category,
  prizeSettings,
  onClose,
  onSubmit,
  isSubmitting,
}: NewCategoryModalProps) {
  const [name, setName] = useState('');
  const [concurso, setConcurso] = useState('');
  const [quotaId, setQuotaId] = useState('');
  const [vagas, setVagas] = useState('');
  const { data: quotas = [], isLoading: isQuotasLoading } = useActiveQuotas();
  const [drawDate, setDrawDate] = useState('');
  const [numbersPerBet, setNumbersPerBet] = useState('6');
  const [housePercentage, setHousePercentage] = useState('25');
  const [winnerPercentage, setWinnerPercentage] = useState('75');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setName(category?.name ?? '');
    setConcurso(category?.concurso ?? '');
    setQuotaId(category?.quotaId ?? '');
    setVagas(category ? String(category.vagas) : '');
    setDrawDate(category?.drawDate?.slice(0, 10) ?? '');
    setNumbersPerBet(String(category?.maxNumbers ?? category?.minNumbers ?? 6));
    setHousePercentage(String(category?.housePercentage ?? prizeSettings?.housePercentage ?? 25));
    setWinnerPercentage(String(category?.winnerPercentage ?? prizeSettings?.winnerPercentage ?? 75));
    setAdvancedOpen(false);
    setError('');
  }, [category, isOpen, prizeSettings]);

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
    if (!quotaId) {
      setError('Selecione uma cota do catálogo.');
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
    const numbersNum = Number(numbersPerBet);
    if (!Number.isSafeInteger(numbersNum) || numbersNum < 6 || numbersNum > 20) {
      setError('A quantidade de dezenas por aposta deve estar entre 6 e 20.');
      return;
    }
    const houseNum = Number(housePercentage);
    const winnerNum = Number(winnerPercentage);
    if (!Number.isFinite(houseNum) || !Number.isFinite(winnerNum) || houseNum < 0 || houseNum > 100 || winnerNum < 0 || winnerNum > 100 || Number((houseNum + winnerNum).toFixed(2)) !== 100) {
      setError('Os percentuais de Casa e Ganhadores devem somar 100%.');
      setAdvancedOpen(true);
      return;
    }

    setError('');
    const parts = drawDate.split('-');
    onSubmit({
      name: name.trim(),
      concurso: concurso.trim(),
      quotaId,
      vagas: vagasNum,
      drawDate: `${parts[2]}/${parts[1]}/${parts[0]}`,
      numbersPerBet: numbersNum,
      housePercentage: houseNum,
      winnerPercentage: winnerNum,
    });
  };

  const handleHousePercentageChange = (value: string) => {
    setHousePercentage(value);
    const number = Number(value);
    if (value !== '' && Number.isFinite(number) && number >= 0 && number <= 100) setWinnerPercentage(String((100 - number).toFixed(2)));
  };
  const handleWinnerPercentageChange = (value: string) => {
    setWinnerPercentage(value);
    const number = Number(value);
    if (value !== '' && Number.isFinite(number) && number >= 0 && number <= 100) setHousePercentage(String((100 - number).toFixed(2)));
  };

  const percentageSum = Number((Number(housePercentage) + Number(winnerPercentage)).toFixed(2));
  const isEditing = Boolean(category);
  const isFormComplete = Boolean(
    name.trim() && concurso.trim() && quotaId && vagas.trim() && numbersPerBet.trim() && drawDate && housePercentage.trim() && winnerPercentage.trim(),
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl border border-slate-800 p-6 relative shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded"
          aria-label="Fechar"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="mb-5">
          <h3 className="font-heading text-xl font-bold text-white flex items-center">
            <i className="fa-solid fa-layer-group text-emerald-400 mr-2"></i>
            {isEditing ? 'Editar Bolão' : 'Novo Bolão'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isEditing ? 'Atualize os dados do bolão e da aposta vinculada.' : 'Cadastre um novo bolão para a vitrine pública.'}
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
            <input id="new-category-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Sorteio BIG 100" required className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600" />
          </div>

          <div>
            <label htmlFor="new-category-contest" className="block text-xs font-semibold text-slate-400 mb-1">Número do Concurso Mega-Sena</label>
            <input id="new-category-contest" type="text" inputMode="numeric" value={concurso} onChange={(e) => setConcurso(e.target.value.replace(/\D/g, ''))} placeholder="Ex: 2800" required className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-category-quota" className="block text-xs font-semibold text-slate-400 mb-1">Cota do catálogo</label>
              <select id="new-category-quota" value={quotaId} onChange={(e) => setQuotaId(e.target.value)} required disabled={isQuotasLoading} className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60">
                <option value="">Selecione uma cota</option>
                {quotas.map((quota) => <option key={quota.id} value={quota.id}>{quota.name} · R$ {quota.amount.toFixed(2).replace('.', ',')}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="new-category-slots" className="block text-xs font-semibold text-slate-400 mb-1">Vagas por Bolão</label>
              <input id="new-category-slots" type="number" min="1" step="1" value={vagas} onChange={(e) => setVagas(e.target.value)} placeholder="100" required className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-category-numbers" className="block text-xs font-semibold text-slate-400 mb-1">Dezenas por Aposta</label>
              <input id="new-category-numbers" type="number" min="6" max="20" step="1" value={numbersPerBet} onChange={(e) => setNumbersPerBet(e.target.value)} required aria-describedby={error ? 'new-category-error' : undefined} className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label htmlFor="new-category-draw-date" className="block text-xs font-semibold text-slate-400 mb-1">Data do Sorteio</label>
              <input id="new-category-draw-date" type="date" value={drawDate} onChange={(e) => setDrawDate(e.target.value)} required className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <details open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)} className="group rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-300 flex items-center justify-between"><span>Configuração avançada</span><i className="fa-solid fa-chevron-down text-xs text-emerald-400 transition-transform group-open:rotate-180" aria-hidden="true"></i></summary>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label htmlFor="category-house-percentage" className="block text-xs font-semibold text-slate-400 mb-1">Casa (%)</label>
                <input id="category-house-percentage" type="number" min="0" max="100" step="0.01" value={housePercentage} onChange={(e) => handleHousePercentageChange(e.target.value)} required className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label htmlFor="category-winner-percentage" className="block text-xs font-semibold text-slate-400 mb-1">Ganhadores (%)</label>
                <input id="category-winner-percentage" type="number" min="0" max="100" step="0.01" value={winnerPercentage} onChange={(e) => handleWinnerPercentageChange(e.target.value)} required className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <p className={`text-xs mt-2 ${percentageSum === 100 ? 'text-emerald-400' : 'text-rose-400'}`} role="status">Soma: {percentageSum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%{percentageSum !== 100 ? ' — deve ser 100%' : ''}</p>
          </details>

          <button type="submit" disabled={isSubmitting || !isFormComplete} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition mt-3 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? <><i className="fa-solid fa-circle-notch fa-spin"></i><span>Salvando...</span></> : <span>{isEditing ? 'Salvar Alterações' : 'Salvar Bolão'}</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
