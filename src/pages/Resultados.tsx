import React from 'react';
import { useResultadosRanking } from './Resultados/hooks/useResultadosRanking';
import ResultadosHeader from './Resultados/components/ResultadosHeader';
import OfficialDrawsCarousel from './Resultados/components/OfficialDrawsCarousel';
import RankingSearchAndSelect from './Resultados/components/RankingSearchAndSelect';
import RankingList from './Resultados/components/RankingList';
import ResultadosBottomBar from './Resultados/components/ResultadosBottomBar';
import GuestModal from './Resultados/components/GuestModal';

export default function Resultados() {
  const {
    draws,
    games,
    selectedGameId,
    setSelectedGameId,
    selectedDrawId,
    setSelectedDrawId,
    activeDraw,
    activeDrawnNumbers,
    ranking,
    searchTerm,
    setSearchTerm,
    isGuestModalOpen,
    setIsGuestModalOpen,
    alertConfig,
    setAlertConfig,
    authMode,
    balanceTotal,
    openLogin,
    isLoading,
  } = useResultadosRanking();

  return (
    <div className="min-h-screen flex flex-col pb-40 relative">
      {/* Main navigation header */}
      <ResultadosHeader
        onOpenNotifications={() =>
          setAlertConfig({
            title: 'Notificações',
            msg: 'Nenhuma notificação nova no momento.',
          })
        }
      />

      <main className="max-w-4xl w-full mx-auto px-4 pt-6 space-y-8">
        {/* Sorteios Oficiais Caixa (Concursos dinâmicos com dezenas sorteadas) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
              <h2 className="font-heading text-lg font-bold text-white">
                Sorteios Oficiais Caixa
              </h2>
            </div>
            {activeDraw && (
              <span className="text-[11px] text-slate-400">
                Comparando com:{' '}
                <strong className="text-emerald-400">{activeDraw.concurso}</strong>
              </span>
            )}
          </div>

          <OfficialDrawsCarousel
            draws={draws}
            activeDrawId={selectedDrawId || draws[0]?.id}
            onSelectDraw={(id) => setSelectedDrawId(id)}
            isLoading={isLoading}
          />
        </section>

        {/* Seção de Ranking dos Participantes no Bolão */}
        <section className="space-y-4">
          <RankingSearchAndSelect
            games={games}
            selectedGameId={selectedGameId}
            onSelectGame={(id) => setSelectedGameId(id)}
            searchTerm={searchTerm}
            onSearchChange={(term) => setSearchTerm(term)}
          />

          <RankingList
            ranking={ranking}
            activeDrawnNumbers={activeDrawnNumbers}
            isLoading={isLoading}
          />
        </section>
      </main>

      {/* Floating Bottom Bar (Saldo / Acesso) */}
      <ResultadosBottomBar
        authMode={authMode}
        balanceTotal={balanceTotal}
        onOpenGuestModal={() => setIsGuestModalOpen(true)}
      />

      {/* Modal de Cadastro Rápido para Visitantes */}
      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onOpenLogin={openLogin}
      />

      {/* Modal de Alerta / Informações */}
      {alertConfig && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm rounded-2xl border border-slate-800 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 text-xl mx-auto">
              <i className="fa-solid fa-circle-info"></i>
            </div>
            <h4 className="font-heading font-bold text-lg text-white">{alertConfig.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{alertConfig.msg}</p>
            <button
              type="button"
              onClick={() => setAlertConfig(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
