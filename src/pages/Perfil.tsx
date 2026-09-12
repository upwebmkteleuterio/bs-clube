import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { useWalletBalance, useWalletTransactions } from '../hooks/useWallet';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: balance } = useWalletBalance();
  const { data: transactions = [] } = useWalletTransactions();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const balanceTotal = balance?.total ?? 0;
  const balanceWithdrawable = balance?.withdrawable ?? 0;
  const displayName = profile?.fullName || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Apostador';
  const safeAvatarUrl = profile?.avatarUrl && /^https?:\/\//i.test(profile.avatarUrl) ? profile.avatarUrl : null;

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.fullName ?? '');
    setPhone(profile.phone ?? '');
    setAvatarUrl(profile.avatarUrl ?? '');
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleSaveProfile = async () => {
    setProfileMessage(null);
    setProfileError(null);
    try {
      await updateProfile.mutateAsync({ fullName, phone, avatarUrl });
      setProfileMessage('Dados do perfil atualizados.');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-32 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-white flex items-center gap-2">
            <i className="fa-solid fa-user-circle text-emerald-400" />
            <span>Meu Perfil</span>
          </h2>
          <p className="text-xs text-slate-400">Gerenciamento de conta, Pix e preferências</p>
        </div>
        <button onClick={() => navigate('/carteira')} className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 flex items-center space-x-2 transition">
          <i className="fa-solid fa-wallet text-emerald-400" />
          <span>R$ {balanceTotal.toFixed(2).replace('.', ',')}</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-900/40 overflow-hidden">
            {safeAvatarUrl ? <img src={safeAvatarUrl} alt="Avatar do perfil" className="h-full w-full object-cover" /> : displayName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-heading text-xl font-bold text-white">{displayName}</h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Conta autenticada
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 transition flex items-center justify-center space-x-1.5">
              <i className="fa-solid fa-shield-halved" />
              <span>Painel Admin</span>
            </button>
          )}
          <button onClick={handleSignOut} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition">
            Sair da conta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2"><i className="fa-solid fa-id-card text-emerald-400" /><span>Dados da Conta</span></h4>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">E-mail</span>
            <span className="text-sm font-semibold text-white break-all">{user?.email}</span>
          </div>
          <div>
            <label htmlFor="profile-full-name" className="text-[10px] text-slate-500 block uppercase mb-1">Nome completo</label>
            <input id="profile-full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={200} disabled={isProfileLoading} className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-sm font-semibold text-white outline-none focus:border-emerald-500 disabled:opacity-60" />
          </div>
          <div>
            <label htmlFor="profile-phone" className="text-[10px] text-slate-500 block uppercase mb-1">Telefone</label>
            <input id="profile-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={30} disabled={isProfileLoading} className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-sm font-semibold text-white outline-none focus:border-emerald-500 disabled:opacity-60" />
          </div>
          <div>
            <label htmlFor="profile-avatar-url" className="text-[10px] text-slate-500 block uppercase mb-1">URL do avatar</label>
            <input id="profile-avatar-url" type="url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} maxLength={500} placeholder="https://..." disabled={isProfileLoading} className="w-full bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-60" />
          </div>
          <div className="flex flex-col gap-2">
            {profileError && <p className="text-xs text-rose-300" role="alert">{profileError}</p>}
            {profileMessage && <p className="text-xs text-emerald-300" role="status">{profileMessage}</p>}
            <button type="button" onClick={handleSaveProfile} disabled={isProfileLoading || updateProfile.isPending} className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
              {updateProfile.isPending ? 'Salvando...' : 'Salvar dados do perfil'}
            </button>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">Saldo Disponível para Saque</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">R$ {balanceWithdrawable.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2"><i className="fa-brands fa-pix text-brand-pix" /><span>Chave Pix para Resgates</span></h4>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-sm text-slate-400">
            A configuração de dados de resgate estará disponível na Fase 2.
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2"><i className="fa-solid fa-clock-rotate-left text-slate-400" /><span>Atividades Recentes</span></h4>
          <button onClick={() => navigate('/carteira')} className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">Ver Extrato Completo</button>
        </div>
        <div className="space-y-2">
          {transactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${tx.type === 'prize' ? 'bg-amber-500/10 text-brand-gold' : tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  <i className={`fa-solid ${tx.type === 'prize' ? 'fa-trophy' : tx.type === 'deposit' ? 'fa-arrow-down' : 'fa-ticket'}`} />
                </div>
                <div><p className="text-xs font-semibold text-white">{tx.title}</p><p className="text-[10px] text-slate-500">{tx.date}</p></div>
              </div>
              <span className={`text-xs font-bold font-mono ${tx.value > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {tx.value > 0 ? `+ R$ ${tx.value.toFixed(2).replace('.', ',')}` : `- R$ ${Math.abs(tx.value).toFixed(2).replace('.', ',')}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
