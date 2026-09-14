import React from 'react';
import { AdminCategory, AdminResultDetail } from '../../../types';

interface AdminResultDetailModalProps {
  isOpen: boolean;
  category: AdminCategory | null;
  result: AdminResultDetail | undefined;
  isLoading: boolean;
  error: unknown;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateTime(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('pt-BR');
}

function formatDate(value: string) {
  if (!value) return '—';
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  return 'Tente novamente.';
}

function DetailMetric({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1 text-sm font-bold ${valueClass}`}>{value}</p></div>;
}

export default function AdminResultDetailModal({ isOpen, category, result, isLoading, error, onClose }: AdminResultDetailModalProps) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="admin-result-detail-title">
      <div className="glass-card w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-amber-500/30 p-5 sm:p-6 relative shadow-2xl">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded" aria-label="Fechar resultado">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <div className="mb-5 border-b border-slate-800 pb-4 pr-8">
          <h3 id="admin-result-detail-title" className="font-heading text-xl font-bold text-amber-400 flex items-center"><i className="fa-solid fa-eye mr-2 text-lg"></i> Resultado do bolão</h3>
          <p className="text-xs text-slate-400 mt-1">{category.name} · Concurso {category.concurso || 'não informado'}</p>
        </div>

        {isLoading && <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-10 text-center text-slate-300" role="status"><i className="fa-solid fa-circle-notch fa-spin text-amber-400 text-xl mr-2"></i>Carregando detalhes do resultado...</div>}
        {!isLoading && error && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300" role="alert"><i className="fa-solid fa-circle-exclamation mr-2"></i>Não foi possível carregar os detalhes deste resultado. {getErrorMessage(error)}</div>}
        {!isLoading && !error && result && <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <DetailMetric label="Data do sorteio" value={formatDate(result.draw.drawDate)} />
            <DetailMetric label="Participantes" value={String(result.participantsCount)} />
            <DetailMetric label="Cartelas compradas" value={String(result.betsCount)} />
            <DetailMetric label="Ganhadores" value={String(result.settlement.winnerCount)} valueClass="text-amber-300" />
          </div>

          <section className="rounded-2xl border border-amber-500/25 bg-slate-950/60 p-4 sm:p-5" aria-labelledby="official-result-title">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h4 id="official-result-title" className="font-heading font-bold text-white">Dezenas oficiais</h4>
              <span className="text-xs text-slate-400">Resultado publicado · {formatDate(result.draw.drawDate)}</span>
            </div>
            <div className="flex justify-center gap-2 sm:gap-3">
              {Array.from({ length: 6 }, (_, index) => result.draw.numbers[index]).map((number, index) => <div key={`${number ?? 'empty'}-${index}`} className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-heading font-black text-base sm:text-lg shadow-lg shadow-amber-900/30">{number ? String(number).padStart(2, '0') : '—'}</div>)}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DetailMetric label="Total arrecadado" value={formatCurrency(result.settlement.grossAmount)} valueClass="text-emerald-400" />
            <DetailMetric label="Valor da casa" value={formatCurrency(result.settlement.houseAmount)} valueClass="text-amber-300" />
            <DetailMetric label="Valor dos ganhadores" value={formatCurrency(result.settlement.winnersAmount)} valueClass="text-amber-300" />
          </div>

          <section aria-labelledby="winners-title">
            <div className="flex items-center justify-between mb-3"><h4 id="winners-title" className="font-heading font-bold text-white">Ganhadores</h4><span className="text-xs text-slate-500">Dados registrados no momento da apuração</span></div>
            {result.winners.length === 0 ? <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-center text-sm text-slate-400"><i className="fa-solid fa-trophy text-amber-400 mr-2"></i>Nenhum ganhador neste resultado. O valor da casa permanece {formatCurrency(result.settlement.houseAmount)}.</div> : <div className="space-y-3">{result.winners.map((winner) => <article key={winner.awardId} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0"><div className="flex items-center gap-2"><i className="fa-solid fa-trophy text-amber-400"></i><h5 className="font-bold text-white truncate">{winner.name || 'Apostador'}</h5><span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">{winner.hits} acertos</span></div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1 text-xs text-slate-400"><span>E-mail: <strong className="text-slate-300">{winner.email || '—'}</strong></span><span>Telefone: <strong className="text-slate-300">{winner.phone || '—'}</strong></span><span>CPF: <strong className="text-slate-300">{winner.cpf || '—'}</strong></span><span>Pix: <strong className="text-slate-300">{winner.pixKeyType || '—'} / {winner.pixKey || '—'}</strong></span></div>
                </div>
                <div className="text-left lg:text-right shrink-0"><p className="text-lg font-black text-amber-300">{formatCurrency(winner.amount)}</p><p className="text-[11px] text-slate-500">Prêmio</p></div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"><span className="text-slate-400">Dezenas: <strong className="text-emerald-400 font-mono">{winner.numbers.map((number) => String(number).padStart(2, '0')).join(' · ') || '—'}</strong></span><span className="text-slate-500">Aposta: {formatDateTime(winner.playedAt)} · Prêmio: {formatDateTime(winner.awardedAt)}</span></div>
            </article>)}</div>}
          </section>
        </div>}
      </div>
    </div>
  );
}
