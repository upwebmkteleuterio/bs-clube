import React, { useState } from 'react';

interface GuestRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalGamesCount: number;
  totalPrice: number;
  onRegisterSuccess: (userName: string, phone: string) => void;
}

export default function GuestRegisterModal({
  isOpen,
  onClose,
  totalGamesCount,
  totalPrice,
  onRegisterSuccess,
}: GuestRegisterModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const maskPhone = (val: string) => {
    let value = val.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    setPhone(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe um telefone/WhatsApp válido.');
      return;
    }
    setError('');
    onRegisterSuccess(name, phone);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-[2rem] border border-slate-700 p-8 relative shadow-2xl transition-all duration-300">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-slate-500 hover:text-white w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 text-emerald-400 flex items-center justify-center font-bold text-2xl mx-auto shadow-lg mb-4">
            <i className="fa-solid fa-user-astronaut"></i>
          </div>
          <h3 className="font-heading text-2xl font-black text-white">Quase lá! Crie sua conta</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Você selecionou{' '}
            <strong className="text-emerald-400">
              {totalGamesCount} {totalGamesCount === 1 ? 'jogo' : 'jogos'}
            </strong>{' '}
            no valor de <strong className="text-white">R$ {totalPrice.toFixed(2).replace('.', ',')}</strong>!
            Cadastre-se em 20 segundos para confirmar suas apostas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              Seu Nome Completo
            </label>
            <div className="relative">
              <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              WhatsApp / Telefone{' '}
              <span className="lowercase text-slate-500 font-normal">
                (para avisos de prêmio)
              </span>
            </label>
            <div className="relative">
              <i className="fa-brands fa-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                type="tel"
                value={phone}
                onChange={(e) => maskPhone(e.target.value)}
                maxLength={15}
                placeholder="(11) 99999-9999"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-brand-accent hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-4 rounded-xl text-sm shadow-lg shadow-emerald-950/40 transition mt-2 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>CRIAR CONTA E CONFIRMAR APOSTA</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <p className="text-[9px] text-slate-500 text-center mt-3">
            Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
          </p>
        </form>
      </div>
    </div>
  );
}
