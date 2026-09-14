import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const localization = {
  variables: {
    sign_in: {
      email_label: 'E-mail',
      password_label: 'Senha',
      email_input_placeholder: 'seu@email.com',
      password_input_placeholder: 'Sua senha',
      button_label: 'Entrar',
      loading_button_label: 'Entrando...',
    },
    confirmation_text: 'Verifique seu e-mail para confirmar o cadastro.',
  },
};

function normalizePhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 11);
}

function formatPhone(value: string) {
  const digits = normalizePhone(value);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function normalizeCpf(value: string) {
  return value.replace(/\D/g, '').slice(0, 11);
}

function formatCpf(value: string) {
  const digits = normalizeCpf(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function isValidCpf(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^([0-9])\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += Number(cpf[index]) * (10 - index);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;
  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += Number(cpf[index]) * (11 - index);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

function authErrorMessage(message: string) {
  if (message.toLowerCase().includes('already registered')) return 'Este e-mail já está cadastrado.';
  if (message.toLowerCase().includes('password')) return 'A senha não atende aos requisitos mínimos.';
  if (message.toLowerCase().includes('invalid login')) return 'E-mail ou senha inválidos.';
  return 'Não foi possível concluir o cadastro. Tente novamente.';
}

function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const normalizedFullName = fullName.trim().replace(/\s+/g, ' ');
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);
    const normalizedCpf = normalizeCpf(cpf);
    if (normalizedFullName.split(' ').filter(Boolean).length < 2 || normalizedFullName.length > 200) {
      setError('Informe nome e sobrenome.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6 || password.length > 72) {
      setError('A senha deve ter entre 6 e 72 caracteres.');
      return;
    }
    if (normalizedPhone.length < 10) {
      setError('Informe um telefone válido com DDD.');
      return;
    }
    if (!isValidCpf(normalizedCpf)) {
      setError('Informe um CPF válido com 11 dígitos.');
      return;
    }

    setIsSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: { data: { full_name: normalizedFullName, phone: normalizedPhone, cpf: normalizedCpf } },
    });
    setIsSubmitting(false);
    if (signUpError) {
      setError(authErrorMessage(signUpError.message));
      return;
    }
    if (data.session) return;
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300" role="status">
        Cadastro realizado. Verifique seu e-mail para confirmar a conta antes de entrar.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300" role="alert">{error}</p>}
      <div>
        <label htmlFor="signup-full-name" className="mb-1 block text-sm font-semibold text-slate-300">Nome completo</label>
        <input id="signup-full-name" type="text" required maxLength={200} value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" placeholder="Nome e sobrenome" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label htmlFor="signup-email" className="mb-1 block text-sm font-semibold text-slate-300">E-mail</label>
        <input id="signup-email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label htmlFor="signup-password" className="mb-1 block text-sm font-semibold text-slate-300">Senha</label>
        <div className="relative">
          <input id="signup-password" type={showPassword ? 'text' : 'password'} required minLength={6} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none focus:border-emerald-400" />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} title={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-emerald-400">
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="signup-phone" className="mb-1 block text-sm font-semibold text-slate-300">Telefone</label>
        <input id="signup-phone" type="tel" required inputMode="numeric" maxLength={15} value={phone} onChange={(event) => setPhone(formatPhone(event.target.value))} autoComplete="tel" placeholder="(11) 99999-9999" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label htmlFor="signup-cpf" className="mb-1 block text-sm font-semibold text-slate-300">CPF</label>
        <input id="signup-cpf" type="text" required inputMode="numeric" maxLength={14} value={cpf} onChange={(event) => setCpf(formatCpf(event.target.value))} autoComplete="off" placeholder="000.000.000-00" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-500 py-3 font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  );
}

export default function AuthPage({ view }: { view: 'sign_in' | 'sign_up' }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from || '/';

  useEffect(() => {
    if (session) navigate(returnTo, { replace: true });
  }, [navigate, returnTo, session]);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-brand-dark px-4 py-10 text-slate-50">
      <nav className="absolute inset-x-0 top-0 border-b border-slate-800/80 bg-brand-dark/95 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center">
          <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400" aria-label="Voltar para a página inicial">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            <span>Voltar</span>
          </button>
        </div>
      </nav>
      <section className="glass-card mt-12 w-full max-w-md rounded-3xl border border-slate-800 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl text-white shadow-lg shadow-emerald-950/40">
            <i className={`fa-solid ${view === 'sign_in' ? 'fa-arrow-right-to-bracket' : 'fa-user-plus'}`} />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-black text-white">{view === 'sign_in' ? 'Acesse sua conta' : 'Crie sua conta'}</h1>
          <p className="mt-2 text-sm text-slate-400">{view === 'sign_in' ? 'Entre para continuar no BS Clube.' : 'Cadastre-se para participar dos bolões.'}</p>
        </div>

        {view === 'sign_in' ? (
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            providers={[]}
            showLinks={false}
            appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: '#10b981', brandAccent: '#34d399', inputBackground: '#020617', inputText: '#f8fafc' } } } }}
            localization={localization}
          />
        ) : <SignUpForm />}

        <div className="mt-6 text-center text-sm text-slate-400">
          {view === 'sign_in' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}{' '}
          <Link to={view === 'sign_in' ? '/cadastro' : '/login'} state={location.state} className="font-bold text-emerald-400 hover:text-emerald-300">{view === 'sign_in' ? 'Cadastre-se' : 'Entrar'}</Link>
        </div>
        <Link to="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300">Voltar para o início</Link>
      </section>
    </main>
  );
}
