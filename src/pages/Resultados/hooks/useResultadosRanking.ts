import { useState, useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useDraws } from '../../../hooks/useDraws';
import { useGames } from '../../../hooks/useGames';
import { useRankings } from '../../../hooks/useRankings';
import { OfficialDraw, Game } from '../../../types';

export function useResultadosRanking() {
  const { authMode, setAuthMode, balanceTotal } = useAppStore();

  const { data: draws = [], isLoading: isLoadingDraws } = useDraws();
  const { data: games = [], isLoading: isLoadingGames } = useGames();

  const [selectedGameId, setSelectedGameId] = useState<string>('bolao-bronze');
  const [selectedDrawId, setSelectedDrawId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{ title: string; msg: string } | null>(null);

  const { data: participants = [], isLoading: isLoadingParticipants } = useRankings(selectedGameId);

  // Active draw defaults to the latest draw if not set
  const activeDraw: OfficialDraw | null = useMemo(() => {
    if (draws.length === 0) return null;
    if (selectedDrawId) {
      return draws.find((d) => d.id === selectedDrawId) || draws[0];
    }
    return draws[0];
  }, [draws, selectedDrawId]);

  const activeDrawnNumbers = useMemo(() => {
    return activeDraw ? activeDraw.dezenas : [];
  }, [activeDraw]);

  // Compute hits and rank participants
  const ranking = useMemo(() => {
    if (!participants || participants.length === 0) return [];

    let processed = participants.map((p) => {
      let hits = 0;
      p.numbers.forEach((num) => {
        if (activeDrawnNumbers.includes(num)) {
          hits++;
        }
      });
      return { ...p, hits };
    });

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
  }, [participants, activeDrawnNumbers, searchTerm]);

  const activeGame: Game | null = useMemo(() => {
    return games.find((g) => g.id === selectedGameId) || null;
  }, [games, selectedGameId]);

  const simulateLogin = () => {
    setAuthMode('auth');
    setIsGuestModalOpen(false);
  };

  const isLoading = isLoadingDraws || isLoadingGames || isLoadingParticipants;

  return {
    draws,
    games,
    selectedGameId,
    setSelectedGameId,
    selectedDrawId,
    setSelectedDrawId,
    activeDraw,
    activeDrawnNumbers,
    activeGame,
    ranking,
    searchTerm,
    setSearchTerm,
    isGuestModalOpen,
    setIsGuestModalOpen,
    alertConfig,
    setAlertConfig,
    authMode,
    setAuthMode,
    balanceTotal,
    simulateLogin,
    isLoading,
  };
}
