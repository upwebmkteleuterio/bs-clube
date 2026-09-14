import React from 'react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceWithdrawable: number;
  withdrawAmount: string;
  onWithdrawAmountChange: (val: string) => void;
  withdrawKeyType: string;
  onWithdrawKeyTypeChange: (val: string) => void;
  withdrawKey: string;
  onWithdrawKeyChange: (val: string) => void;
  onSetMax: () => void;
  onProcessWithdraw: () => void;
  isProcessing: boolean;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  balanceWithdrawable,
  withdrawAmount,
  onWithdrawAmountChange,
  withdrawKeyType,
  onWithdrawKeyTypeChange,
  withdrawKey,
  onWithdrawKeyChange,
  onSetMax,
  onProcessWithdraw,
  isProcessing,
}: WithdrawModalProps) {
  if (!isOpen) return null;

  const numVal = parseFloat(withdrawAmount) || 0;
  const isExceeded = numVal > balanceWithdrawable;
  const isValid =
    numVal >= 10 &&
    numVal <= balanceWithdrawable &&
    withdrawKey.trim().length >= 4 &&
    !isProcessing;

  const formatCurrency = (val: number) =>
    `R$ ${Math.abs(val).toFixed(2).replace('.', ',')}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto -mt-2 mb-2 sm:hidden"></div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-slate-400 hover:text-white hidden sm:flex w-8 h-8 rounded-full bg-slate-800 border border-slate-700 items-center justify-center cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-heading text-xl font-bold text-white flex items-center space-x-2">
              <i className="fa-solid fa-money-bill-transfer text-emerald-400"></i>
              <span>Resgatar Prêmio</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Saldo Sacável Disponível:{' '}
              <strong className="text-emerald-400">{formatCurrency(balanceWithdrawable)}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-slate-400 hover:text-white sm:hidden p-1"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tipo de Chave Pix
            </label>
            <select
              value={withdrawKeyType}
              onChange={(e) => onWithdrawKeyTypeChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
            >
              <option value="cpf">CPF / CNPJ</option>
              <option value="phone">Telefone Celular</option>
              <option value="email">E-mail</option>
              <option value="random">Chave Aleatória</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sua Chave Pix
            </label>
            <input
              type={withdrawKeyType === 'email' ? 'email' : 'text'}
              inputMode={withdrawKeyType === 'cpf' || withdrawKeyType === 'phone' ? 'numeric' : undefined}
              maxLength={withdrawKeyType === 'cpf' ? 14 : withdrawKeyType === 'phone' ? 15 : 200}
              value={withdrawKey}
              onChange={(e) => onWithdrawKeyChange(e.target.value)}
              placeholder="Digite sua chave..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Valor do Saque (R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                R$
              </span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => onWithdrawAmountChange(e.target.value)}
                placeholder="0,00"
                step="1.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-20 py-3 text-lg font-black text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={onSetMax}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 text-emerald-400 hover:bg-slate-700 text-[10px] font-bold px-2 py-1.5 rounded transition cursor-pointer"
              >
                MÁXIMO
              </button>
            </div>
            {isExceeded && (
              <p className="text-[10px] text-red-400 mt-1.5 flex items-center">
                <i className="fa-solid fa-circle-exclamation mr-1"></i>
                Valor excede o saldo sacável disponível.
              </p>
            )}
            {!isExceeded && numVal > 0 && numVal < 10 && (
              <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                <i className="fa-solid fa-circle-info mr-1"></i>
                O valor mínimo para resgate é R$ 10,00.
              </p>
            )}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2 text-[10px] text-slate-400 leading-relaxed">
            <i className="fa-solid fa-shield-halved text-emerald-500 mr-1"></i>
            A conta destino deve estar no mesmo nome e CPF cadastrados no perfil para aprovação automática.
          </div>

          <button
            type="button"
            disabled={!isValid}
            onClick={onProcessWithdraw}
            className={`w-full font-black py-3.5 rounded-xl text-sm transition-all duration-300 mt-2 cursor-pointer ${
              isValid
                ? 'bg-gradient-to-r from-emerald-500 to-brand-accent hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
            }`}
          >
            {isProcessing ? 'PROCESSANDO SAQUE...' : 'CONFIRMAR SOLICITAÇÃO DE SAQUE'}
          </button>
        </div>
      </div>
    </div>
  );
}
