import React from 'react';
import { useResultadosRanking } from './Resultados/hooks/useResultadosRanking';
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
    ranking,
    searchTerm,
    setSearchTerm,
    isGuestModalOpen,
    setIsGuestModalOpen,
    authMode,
    balanceTotal,
    openLogin,
    isLoading,
  } = useResultadosRanking();

  return (
    <div className="min-h-screen flex flex-col pb-40 relative">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
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

          <RankingList ranking={ranking} isLoading={isLoading} />
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

    </div>
  );
}
