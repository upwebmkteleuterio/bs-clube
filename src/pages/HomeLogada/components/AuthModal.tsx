import React from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authTab: 'register' | 'login';
  setAuthTab: (tab: 'register' | 'login') => void;
  formData: {
    name: string;
    nickname: string;
    phone: string;
    password: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      nickname: string;
      phone: string;
      password: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  authTab,
  setAuthTab,
  formData,
  setFormData,
  onSubmit,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm overflow-y-auto flex justify-center items-start sm:items-center p-3 sm:p-4 py-4 sm:py-6">
      <div className="glass-card w-full max-w-md rounded-3xl border border-emerald-500/30 p-5 sm:p-6 my-auto max-h-[92vh] overflow-y-auto hide-scrollbar relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center transition text-xs cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-center mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-bold text-lg mx-auto shadow-md shadow-emerald-900/40 mb-1.5">
            <i
              className={`fa-solid ${
                authTab === 'register' ? 'fa-user-plus' : 'fa-arrow-right-to-bracket'
              }`}
            ></i>
          </div>
          <h3 className="font-heading text-xl font-black text-white">
            {authTab === 'register' ? 'Criar sua Conta' : 'Acesse sua Conta'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {authTab === 'register'
              ? 'Cadastre-se rapidamente para escolher suas dezenas e concorrer aos prêmios.'
              : 'Informe seus dados para continuar para o bolão selecionado.'}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 mb-3">
          <button
            type="button"
            onClick={() => setAuthTab('register')}
            className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              authTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Criar Conta
          </button>
          <button
            type="button"
            onClick={() => setAuthTab('login')}
            className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
              authTab === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Já Tenho Conta
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-2.5">
          {authTab === 'register' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <i className="fa-regular fa-user text-xs"></i>
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Carlos Silva"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Apelido</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <i className="fa-solid fa-at text-xs"></i>
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Ex: Maicon"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              {authTab === 'register' ? 'Celular / WhatsApp' : 'Celular ou E-mail'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <i className="fa-solid fa-phone text-xs"></i>
              </span>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <i className="fa-solid fa-lock text-xs"></i>
              </span>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg shadow-emerald-950/40 transition flex items-center justify-center space-x-2 cursor-pointer mt-3"
          >
            <span>{authTab === 'register' ? 'Criar Conta e Continuar' : 'Entrar e Continuar'}</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </form>

        <div className="text-center mt-2.5">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 transition underline cursor-pointer"
          >
            Voltar e ver bolões
          </button>
        </div>
      </div>
    </div>
  );
}
