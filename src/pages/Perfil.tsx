import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function Perfil() {
  const navigate = useNavigate();
  const {
    authMode,
    setAuthMode,
    userNickname,
    setUserNickname,
    balanceTotal,
    balanceWithdrawable,
    transactions,
  } = useAppStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(userNickname);
  const [pixKeyInput, setPixKeyInput] = useState('11988776655');
  const [pixType, setPixType] = useState('phone');
  const [savedSuccess, setSavedSuccess] = useState('');

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameInput.trim()) {
      setUserNickname(nicknameInput.trim());
      setIsEditingName(false);
      setSavedSuccess('Nome atualizado com sucesso!');
      setTimeout(() => setSavedSuccess(''), 3000);
    }
  };

  const handleSavePix = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess('Chave Pix favorita salva!');
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-32 space-y-6">
      {/* Header do Perfil */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-white flex items-center gap-2">
            <i className="fa-solid fa-user-circle text-emerald-400"></i>
            <span>Meu Perfil</span>
          </h2>
          <p className="text-xs text-slate-400">Gerenciamento de conta, Pix e preferências</p>
        </div>
        <button
          onClick={() => navigate('/carteira')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 flex items-center space-x-2 transition"
        >
          <i className="fa-solid fa-wallet text-emerald-400"></i>
          <span>R$ {balanceTotal.toFixed(2).replace('.', ',')}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i>
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Cartão de Identificação */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-900/40">
            {userNickname.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading text-xl font-bold text-white">{userNickname}</h3>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                authMode === 'auth'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {authMode === 'auth' ? 'Conta Verificada' : 'Modo Visitante'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">ID: #BS-984210 • Membro desde 2026</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setAuthMode(authMode === 'auth' ? 'guest' : 'auth')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition"
          >
            Alternar para {authMode === 'auth' ? 'Visitante' : 'Autenticado'}
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 transition flex items-center justify-center space-x-1.5"
          >
            <i className="fa-solid fa-shield-halved"></i>
            <span>Painel Admin</span>
          </button>
        </div>
      </div>

      {/* Grid de Seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados da Conta */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-id-card text-emerald-400"></i>
            <span>Dados da Conta</span>
          </h4>

          {isEditingName ? (
            <form onSubmit={handleSaveNickname} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Apelido do Apostador</label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Apelido</span>
                <span className="text-sm font-semibold text-white">{userNickname}</span>
              </div>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Editar
              </button>
            </div>
          )}

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">Telefone / WhatsApp</span>
            <span className="text-sm font-mono text-slate-300">(11) 98877-6655</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">Saldo Disponível para Saque</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              R$ {balanceWithdrawable.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Chave Pix Padrão */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="fa-brands fa-pix text-brand-pix"></i>
            <span>Chave Pix para Resgates</span>
          </h4>

          <form onSubmit={handleSavePix} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tipo de Chave</label>
              <select
                value={pixType}
                onChange={(e) => setPixType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="phone">Celular</option>
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="random">Chave Aleatória</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Chave Pix</label>
              <input
                type="text"
                value={pixKeyInput}
                onChange={(e) => setPixKeyInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-2.5 rounded-xl text-xs transition border border-slate-700"
            >
              Atualizar Chave Pix
            </button>
          </form>
        </div>
      </div>

      {/* Histórico recente */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-slate-400"></i>
            <span>Atividades Recentes</span>
          </h4>
          <button
            onClick={() => navigate('/carteira')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Ver Extrato Completo
          </button>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/60"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                  tx.type === 'prize'
                    ? 'bg-amber-500/10 text-brand-gold'
                    : tx.type === 'deposit'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <i className={`fa-solid ${
                    tx.type === 'prize' ? 'fa-trophy' : tx.type === 'deposit' ? 'fa-arrow-down' : 'fa-ticket'
                  }`}></i>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{tx.title}</p>
                  <p className="text-[10px] text-slate-500">{tx.date}</p>
                </div>
              </div>
              <span className={`text-xs font-bold font-mono ${
                tx.value > 0 ? 'text-emerald-400' : 'text-slate-300'
              }`}>
                {tx.value > 0 ? `+ R$ ${tx.value.toFixed(2).replace('.', ',')}` : `- R$ ${Math.abs(tx.value).toFixed(2).replace('.', ',')}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
