import { useHomeLobby } from './HomeLogada/hooks/useHomeLobby';
import GameFilters from './HomeLogada/components/GameFilters';
import MobileGameCard from './HomeLogada/components/MobileGameCard';
import DesktopGameTable from './HomeLogada/components/DesktopGameTable';
import HomeLoadingSkeleton from './HomeLogada/components/HomeLoadingSkeleton';

function GameSection({ title, games, authMode, subscribedGames, onPlayAction, closed = false }: { title: string; games: ReturnType<typeof useHomeLobby>['filteredGames']; authMode: 'guest' | 'auth'; subscribedGames: string[]; onPlayAction: (id?: string) => void; closed?: boolean }) {
  return (
    <section aria-labelledby={closed ? 'closed-pools-title' : 'open-pools-title'} className="bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <h4 id={closed ? 'closed-pools-title' : 'open-pools-title'} className="font-heading text-lg font-bold text-white">{title}</h4>
        {closed && <span className="text-[10px] uppercase tracking-wider text-slate-500">Acompanhe os resultados</span>}
      </div>
      <div className="md:hidden divide-y divide-slate-800/80">
        {games.length === 0 ? <div className="py-10 text-center text-slate-500 text-xs">Nenhum bolão nesta seção.</div> : games.map((game) => <MobileGameCard key={`mob-${game.id}`} game={game} isSubscribed={authMode === 'auth' && subscribedGames.includes(game.id)} onPlayAction={onPlayAction} />)}
      </div>
      <DesktopGameTable games={games} authMode={authMode} subscribedGames={subscribedGames} onPlayAction={onPlayAction} />
    </section>
  );
}

export default function HomeLogada() {
  const { filteredGames, filteredClosedGames, quotas, isLoading, isError, refetch, filterState, setFilterState, handlePlayAction, authMode, subscribedGames } = useHomeLobby();
  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3"><div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><i className="fa-solid fa-layer-group" /></div><div><h3 className="font-heading text-2xl font-black text-white">Bolões Disponíveis</h3><p className="text-xs text-slate-400">Escolha o seu e participe</p></div></div>
          <GameFilters filterState={filterState} setFilterState={setFilterState} authMode={authMode} subscribedCount={subscribedGames.length} quotas={quotas} />
        </div>
        {isLoading && <HomeLoadingSkeleton />}
        {isError && <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-6 text-center text-red-300 space-y-3"><i className="fa-solid fa-triangle-exclamation text-2xl text-red-400" /><p className="text-sm font-semibold">Não foi possível carregar os bolões.</p><button onClick={() => refetch()} className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition">Tentar novamente</button></div>}
        {!isLoading && !isError && <div className="space-y-6"><GameSection title="Bolões abertos" games={filteredGames} authMode={authMode} subscribedGames={subscribedGames} onPlayAction={handlePlayAction} /><GameSection title="Bolões encerrados e concluídos" games={filteredClosedGames} authMode={authMode} subscribedGames={subscribedGames} onPlayAction={handlePlayAction} closed /></div>}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-2"><div className="flex items-center space-x-4"><div className="flex items-center space-x-2"><span className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-500/60 inline-block" /><span className="font-semibold text-slate-300">Linha destacada:</span><span>Bolão em que você está participando</span></div><div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" /><span>Sorteios e vagas sincronizados em tempo real</span></div></div><div className="text-slate-500 text-[11px]">Estilo Sit & Go • BS Clube</div></div>
      </main>
    </div>
  );
}
