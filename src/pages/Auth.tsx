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

function normalizeCpf(value: string) {
  return value.replace(/\D/g, '').slice(0, 11);
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);
    const normalizedCpf = normalizeCpf(cpf);
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
      options: { data: { phone: normalizedPhone, cpf: normalizedCpf } },
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
        <label htmlFor="signup-email" className="mb-1 block text-sm font-semibold text-slate-300">E-mail</label>
        <input id="signup-email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label htmlFor="signup-password" className="mb-1 block text-sm font-semibold text-slate-300">Senha</label>
        <input id="signup-password" type="password" required minLength={6} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label htmlFor="signup-phone" className="mb-1 block text-sm font-semibold text-slate-300">Telefone</label>
        <input id="signup-phone" type="tel" required inputMode="numeric" maxLength={15} value={phone} onChange={(event) => setPhone(normalizePhone(event.target.value))} autoComplete="tel" placeholder="11999999999" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label htmlFor="signup-cpf" className="mb-1 block text-sm font-semibold text-slate-300">CPF</label>
        <input id="signup-cpf" type="text" required inputMode="numeric" maxLength={11} value={cpf} onChange={(event) => setCpf(normalizeCpf(event.target.value))} autoComplete="off" placeholder="Somente números" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400" />
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
    <main className="flex min-h-screen items-center justify-center bg-brand-dark px-4 py-10 text-slate-50">
      <section className="glass-card w-full max-w-md rounded-3xl border border-slate-800 p-6 shadow-2xl sm:p-8">
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
