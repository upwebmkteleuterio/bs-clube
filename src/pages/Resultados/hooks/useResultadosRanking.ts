import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useWalletBalance } from '../../../hooks/useWallet';
import { useDraws } from '../../../hooks/useDraws';
import { useResultsGames } from '../../../hooks/useGames';
import { useRankings } from '../../../hooks/useRankings';
import { useOwnPrizeAwards } from '../../../hooks/usePrizeAwards';
import { OfficialDraw, Game } from '../../../types';

export function useResultadosRanking() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: walletBalance } = useWalletBalance();
  const authMode = session ? 'auth' as const : 'guest' as const;

  const { data: draws = [], isLoading: isLoadingDraws } = useDraws();
  const { data: games = [], isLoading: isLoadingGames } = useResultsGames();

  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [selectedDrawId, setSelectedDrawId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  const rankingGameId = selectedGameId || games[0]?.id;
  const selectedGame = games.find((game) => game.id === rankingGameId);

  const activeDraw: OfficialDraw | null = useMemo(() => {
    if (draws.length === 0) return null;
    if (selectedDrawId) {
      return draws.find((draw) => draw.id === selectedDrawId) || draws[0];
    }
    if (selectedGame?.concursoRef) {
      return draws.find((draw) => draw.concurso === selectedGame.concursoRef) || draws[0];
    }
    return draws[0];
  }, [draws, selectedDrawId, selectedGame]);

  const { data: participants = [], isLoading: isLoadingParticipants } = useRankings(
    rankingGameId,
    activeDraw?.id,
  );
  const { data: ownPrizeAwards = [], isLoading: isLoadingPrizeAwards } = useOwnPrizeAwards(rankingGameId);

  // Hits are calculated by the ranking RPC from the selected official draw.
  const ranking = useMemo(() => {
    if (!participants || participants.length === 0) return [];

    let processed = [...participants];
    processed.sort((a, b) => {
      if (b.hits !== a.hits) return b.hits - a.hits;
      return a.name.localeCompare(b.name);
    });

    if (searchTerm.trim() !== '') {
      processed = processed.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return processed;
  }, [participants, searchTerm]);

  const activeGame: Game | null = useMemo(() => {
    return games.find((g) => g.id === rankingGameId) || null;
  }, [games, rankingGameId]);

  const openLogin = () => {
    setIsGuestModalOpen(false);
    navigate('/login', { state: { from: '/resultados' } });
  };

  const isLoading = isLoadingDraws || isLoadingGames || isLoadingParticipants || isLoadingPrizeAwards;

  return {
    draws,
    games,
    selectedGameId: rankingGameId || '',
    setSelectedGameId,
    selectedDrawId,
    setSelectedDrawId,
    activeDraw,
    activeGame,
    ownPrizeAwards,
    ranking,
    searchTerm,
    setSearchTerm,
    isGuestModalOpen,
    setIsGuestModalOpen,
    authMode,
    balanceTotal: walletBalance?.total ?? 0,
    openLogin,
    isLoading,
  };
}
