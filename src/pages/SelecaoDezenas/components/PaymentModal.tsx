import React, { useEffect, useRef, useState } from 'react';
import { SavedBetItem } from './SavedGamesList';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bolaoName: string;
  totalGamesCount: number;
  totalPrice: number;
  allGames: SavedBetItem[];
  userBalance: number;
  onPayWithBalance: () => void;
  onPayWithPix: () => void;
  isProcessing: boolean;
}

export default function PaymentModal({
  isOpen,
  onClose,
  bolaoName,
  totalGamesCount,
  totalPrice,
  allGames,
  userBalance,
  onPayWithBalance,
  onPayWithPix,
  isProcessing,
}: PaymentModalProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);

    if (isOpen) {
      setIsMounted(true);
      animationFrameRef.current = requestAnimationFrame(() => setIsVisible(true));
    } else if (isMounted) {
      setIsVisible(false);
      closeTimerRef.current = setTimeout(() => setIsMounted(false), 300);
    }

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isMounted]);

  const handleClose = () => {
    setIsVisible(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsMounted(false);
      onClose();
    }, 300);
  };

  if (!isMounted) return null;

  const hasSufficientBalance = userBalance >= totalPrice;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
      <div className={`absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}></div>
      <div className={`absolute bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 rounded-t-3xl transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 mb-5"></div>
        <div className="px-6 pb-8 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 id="payment-modal-title" className="font-heading text-xl font-black text-white">Confirmação de Apostas</h3>
            <button type="button" onClick={handleClose} aria-label="Fechar" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 shadow-inner space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800"><span className="text-slate-400 text-xs font-medium">Bolão</span><span className="text-white font-bold text-sm">{bolaoName}</span></div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800"><span className="text-slate-400 text-xs font-medium">Quantidade de Cotas</span><span className="text-emerald-400 font-bold text-sm">{totalGamesCount} {totalGamesCount === 1 ? 'Jogo' : 'Jogos'}</span></div>
            <div className="max-h-32 overflow-y-auto space-y-1.5 py-1 pr-1">
              {allGames.map((g, idx) => (
                <div key={g.id || idx} className="flex justify-between items-center text-xs bg-slate-900/60 p-2 rounded-lg">
                  <span className="text-slate-400 text-[11px] font-mono">Jogo #{idx + 1}</span>
                  <div className="flex space-x-1">{g.numbers.map((n) => <span key={n} className="text-emerald-400 font-bold font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{n.toString().padStart(2, '0')}</span>)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800"><span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total a Pagar</span><span className="font-heading font-black text-2xl text-emerald-400">R$ {totalPrice.toFixed(2).replace('.', ',')}</span></div>
          </div>

          <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6">
            <div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-slate-400"><i className="fa-solid fa-wallet"></i></div><div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Seu Saldo Atual</p><p className="text-sm font-bold text-white">R$ {userBalance.toFixed(2).replace('.', ',')}</p></div></div>
            {hasSufficientBalance ? <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-500/20">Saldo Suficiente</span> : <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded border border-red-500/20">Saldo Insuficiente</span>}
          </div>

          <div className="space-y-3">
            <button type="button" disabled={!hasSufficientBalance || isProcessing} onClick={onPayWithBalance} className={`w-full font-black py-4 rounded-xl text-sm transition flex items-center justify-center space-x-2 ${hasSufficientBalance && !isProcessing ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-900/40 cursor-pointer active:scale-95' : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'}`}>
              <i className="fa-solid fa-check-circle text-lg"></i><span>{isProcessing ? 'PROCESSANDO...' : `PAGAR COM SALDO (R$ ${totalPrice.toFixed(2).replace('.', ',')})`}</span>
            </button>
            <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-slate-800"></div><span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] uppercase font-bold">OU</span><div className="flex-grow border-t border-slate-800"></div></div>
            <button type="button" onClick={onPayWithPix} className="w-full bg-slate-950 border border-slate-700 hover:border-brand-pix text-white font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center space-x-2 cursor-pointer"><i className="fa-brands fa-pix text-brand-pix"></i><span>Pagar via Pix Instantâneo</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
