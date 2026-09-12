import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../store/useAppStore';
import { useWalletBalance } from '../../../hooks/useWallet';
import { useGames } from '../../../hooks/useGames';

export type FilterCategory = 'todos' | 'meus' | 'cota10' | 'cota20' | 'cota50';

export function useHomeLobby() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { subscribedGames } = useAppStore();
  const { data: walletBalance } = useWalletBalance();
  const { data: games = [], isLoading, isError, refetch } = useGames();
  const [filterState, setFilterState] = useState<FilterCategory>('todos');

  const filteredGames = useMemo(() => {
    if (filterState === 'meus') return games.filter((g) => subscribedGames.includes(g.id));
    if (filterState === 'cota10') return games.filter((g) => g.buyIn <= 10);
    if (filterState === 'cota20') return games.filter((g) => g.buyIn === 20);
    if (filterState === 'cota50') return games.filter((g) => g.buyIn >= 50);
    return games;
  }, [games, filterState, subscribedGames]);

  const handlePlayAction = () => {
    navigate(session ? '/selecao-dezenas' : '/login', { state: { from: '/selecao-dezenas' } });
  };

  return {
    games,
    filteredGames,
    isLoading,
    isError,
    refetch,
    filterState,
    setFilterState,
    handlePlayAction,
    authMode: session ? 'auth' as const : 'guest' as const,
    balanceTotal: walletBalance?.total ?? 0,
    subscribedGames,
    userNickname: session?.user.user_metadata?.name || session?.user.email?.split('@')[0] || 'Apostador',
    openLogin: () => navigate('/login'),
    openSignup: () => navigate('/cadastro'),
  };
}
