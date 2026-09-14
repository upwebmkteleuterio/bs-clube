import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useUserBets } from '../../../hooks/useBets';
import { useGames, useResultsGames } from '../../../hooks/useGames';
import { useActiveQuotas } from '../../../hooks/useQuotas';

export type FilterCategory = 'todos' | 'meus' | string;

export function useHomeLobby() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: games = [], isLoading, isError, refetch } = useGames();
  const { data: closedGames = [], isLoading: isClosedLoading } = useResultsGames();
  const { data: quotas = [] } = useActiveQuotas();
  const { data: userBets = [] } = useUserBets();
  const subscribedGames = useMemo(() => [...new Set(userBets.map((bet) => bet.bolaoId))], [userBets]);
  const [filterState, setFilterState] = useState<FilterCategory>('todos');

  const matchesFilter = (game: typeof games[number]) => {
    if (filterState === 'meus') return subscribedGames.includes(game.id);
    if (filterState === 'todos') return true;
    return game.quotaId === filterState;
  };
  const filteredGames = useMemo(() => games.filter(matchesFilter), [games, filterState, subscribedGames]);
  const filteredClosedGames = useMemo(() => closedGames.filter(matchesFilter), [closedGames, filterState, subscribedGames]);

  const handlePlayAction = (gameId?: string) => {
    const game = games.find((item) => item.id === gameId);
    if (game?.isUnavailable) return;
    navigate('/selecao-dezenas', { state: { from: '/selecao-dezenas', bolaoId: gameId } });
  };

  return {
    games,
    closedGames,
    filteredGames,
    filteredClosedGames,
    quotas,
    isLoading: isLoading || isClosedLoading,
    isError,
    refetch,
    filterState,
    setFilterState,
    handlePlayAction,
    authMode: session ? 'auth' as const : 'guest' as const,
    subscribedGames,
  };
}
