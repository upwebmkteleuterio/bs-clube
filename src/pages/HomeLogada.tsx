import React from 'react';
import { useHomeLobby } from './HomeLogada/hooks/useHomeLobby';
import HomeHeader from './HomeLogada/components/HomeHeader';
import GameFilters from './HomeLogada/components/GameFilters';
import MobileGameCard from './HomeLogada/components/MobileGameCard';
import DesktopGameTable from './HomeLogada/components/DesktopGameTable';
import AuthModal from './HomeLogada/components/AuthModal';
import HomeLoadingSkeleton from './HomeLogada/components/HomeLoadingSkeleton';

export default function HomeLogada() {
  const {
    filteredGames,
    isLoading,
    isError,
    refetch,
    filterState,
    setFilterState,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authTab,
    setAuthTab,
    formData,
    setFormData,
    handlePlayAction,
    handleAuthSubmit,
    authMode,
    balanceTotal,
    subscribedGames,
    userNickname,
  } = useHomeLobby();

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Header com perfil e saldo */}
      <HomeHeader
        authMode={authMode}
        userNickname={userNickname}
        balanceTotal={balanceTotal}
        onOpenRegister={() => {
          setAuthTab('register');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Título e Barra de Filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div>
              <h3 className="font-heading text-2xl font-black text-white">Bolões Disponíveis</h3>
              <p className="text-xs text-slate-400">
                Lobby de Salas estilo Sit & Go • Escolha o seu e participe
              </p>
            </div>
          </div>

          {/* Filtros de Cota e Meus Jogos */}
          <GameFilters
            filterState={filterState}
            setFilterState={setFilterState}
            authMode={authMode}
            subscribedCount={subscribedGames.length}
          />
        </div>

        {/* Estado de Carregamento com React Query */}
        {isLoading && <HomeLoadingSkeleton />}

        {/* Estado de Erro */}
        {isError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-6 text-center text-red-300 space-y-3">
            <i className="fa-solid fa-triangle-exclamation text-2xl text-red-400"></i>
            <p className="text-sm font-semibold">Não foi possível carregar os bolões.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Listagem Estilo Poker (Sit & Go) */}
        {!isLoading && !isError && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Versão Mobile (Exclusiva para celulares: 100% visível sem scroll lateral) */}
            <div className="md:hidden divide-y divide-slate-800/80">
              {filteredGames.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <i className="fa-solid fa-circle-exclamation text-2xl mb-2 block text-slate-600"></i>
                  <span className="text-xs">Nenhum bolão encontrado para este filtro.</span>
                </div>
              ) : (
                filteredGames.map((game) => {
                  const isSubscribed = authMode === 'auth' && subscribedGames.includes(game.id);
                  return (
                    <MobileGameCard
                      key={`mob-${game.id}`}
                      game={game}
                      isSubscribed={isSubscribed}
                      onPlayAction={handlePlayAction}
                    />
                  );
                })
              )}
            </div>

            {/* Versão Desktop: Tabela completa */}
            <DesktopGameTable
              games={filteredGames}
              authMode={authMode}
              subscribedGames={subscribedGames}
              onPlayAction={handlePlayAction}
            />
          </div>
        )}

        {/* Legenda Informativa */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500/60 inline-block"></span>
              <span className="font-semibold text-slate-300">Linha destacada:</span>
              <span>Bolão em que você está participando</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>Sorteios e vagas sincronizados em tempo real</span>
            </div>
          </div>
          <div className="text-slate-500 text-[11px]">
            Estilo Sit & Go • BS Clube
          </div>
        </div>
      </main>

      {/* Modal Criar Conta / Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        authTab={authTab}
        setAuthTab={setAuthTab}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
