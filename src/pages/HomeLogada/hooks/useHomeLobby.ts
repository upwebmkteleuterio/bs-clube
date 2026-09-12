import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { useGames } from '../../../hooks/useGames';

export type FilterCategory = 'todos' | 'meus' | 'cota10' | 'cota20' | 'cota50';

export function useHomeLobby() {
  const navigate = useNavigate();
  const { authMode, setAuthMode, balanceTotal, subscribedGames, userNickname, setUserNickname } = useAppStore();
  const { data: games = [], isLoading, isError, refetch } = useGames();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    phone: '',
    password: '',
  });
  const [filterState, setFilterState] = useState<FilterCategory>('todos');

  const filteredGames = useMemo(() => {
    if (!games) return [];
    if (filterState === 'meus') {
      return games.filter((g) => subscribedGames.includes(g.id));
    }
    if (filterState === 'cota10') {
      return games.filter((g) => g.buyIn <= 10);
    }
    if (filterState === 'cota20') {
      return games.filter((g) => g.buyIn === 20);
    }
    if (filterState === 'cota50') {
      return games.filter((g) => g.buyIn >= 50);
    }
    return games;
  }, [games, filterState, subscribedGames]);

  const handlePlayAction = (gameId?: string) => {
    if (authMode !== 'auth') {
      setIsAuthModalOpen(true);
    } else {
      navigate('/selecao-dezenas');
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'register') {
      if (formData.nickname.trim()) {
        setUserNickname(formData.nickname.trim());
      } else if (formData.name.trim()) {
        setUserNickname(formData.name.trim());
      }
    }
    setAuthMode('auth');
    setIsAuthModalOpen(false);
    navigate('/selecao-dezenas');
  };

  return {
    games,
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
  };
}
