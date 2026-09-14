import { FormEvent, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AuthView = 'sign_in' | 'sign_up';

interface AuthPanelProps {
  view: AuthView;
  onViewChange: (view: AuthView) => void;
}

const authLabelClassName = 'auth-field-label';
const authInputClassName = 'auth-field-input';
const authSubmitClassName = 'auth-submit-button';

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

function signInErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();
  if (normalizedMessage.includes('invalid login') || normalizedMessage.includes('invalid credentials')) {
    return 'E-mail ou senha inválidos.';
  }
  if (normalizedMessage.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  return 'Não foi possível entrar. Tente novamente.';
}

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Informe seu e-mail.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!password) {
      setError('Informe sua senha.');
      return;
    }

    setIsSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setIsSubmitting(false);
    if (signInError) setError(signInErrorMessage(signInError.message));
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300" role="alert">{error}</p>}
      <div>
        <label htmlFor="signin-email" className={authLabelClassName}>E-mail</label>
        <input id="signin-email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" placeholder="seu@email.com" className={authInputClassName} />
      </div>
      <div>
        <label htmlFor="signin-password" className={authLabelClassName}>Senha</label>
        <div className="relative">
          <input id="signin-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" inputMode="text" placeholder="Sua senha" className={`${authInputClassName} pr-12`} />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} title={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
      <button type="submit" disabled={isSubmitting} className={authSubmitClassName}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
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
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300" role="alert">{error}</p>}
      <div>
        <label htmlFor="signup-full-name" className={authLabelClassName}>Nome completo</label>
        <input id="signup-full-name" type="text" required maxLength={200} value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" placeholder="Nome e sobrenome" className={authInputClassName} />
      </div>
      <div>
        <label htmlFor="signup-email" className={authLabelClassName}>E-mail</label>
        <input id="signup-email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="seu@email.com" className={authInputClassName} />
      </div>
      <div>
        <label htmlFor="signup-password" className={authLabelClassName}>Senha</label>
        <div className="relative">
          <input id="signup-password" type={showPassword ? 'text' : 'password'} required minLength={6} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="Sua senha" className={`${authInputClassName} pr-12`} />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} title={showPassword ? 'Ocultar senha' : 'Mostrar senha'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60">
            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="signup-phone" className={authLabelClassName}>Telefone</label>
        <input id="signup-phone" type="tel" required inputMode="numeric" maxLength={15} value={phone} onChange={(event) => setPhone(formatPhone(event.target.value))} autoComplete="tel" placeholder="(11) 99999-9999" className={authInputClassName} />
      </div>
      <div>
        <label htmlFor="signup-cpf" className={authLabelClassName}>CPF</label>
        <input id="signup-cpf" type="text" required inputMode="numeric" maxLength={14} value={cpf} onChange={(event) => setCpf(formatCpf(event.target.value))} autoComplete="off" placeholder="000.000.000-00" className={authInputClassName} />
      </div>
      <button type="submit" disabled={isSubmitting} className={authSubmitClassName}>
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  );
}

export default function AuthPanel({ view, onViewChange }: AuthPanelProps) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-3 grid grid-cols-2 gap-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-1" role="tablist" aria-label="Autenticação">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'sign_in'}
          onClick={() => onViewChange('sign_in')}
          className={`rounded-xl px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70 ${view === 'sign_in' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          Login
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'sign_up'}
          onClick={() => onViewChange('sign_up')}
          className={`rounded-xl px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70 ${view === 'sign_up' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          Criar conta
        </button>
      </div>

      <section className="auth-panel glass-card rounded-3xl border border-slate-800 p-6 shadow-2xl sm:p-8" aria-label={view === 'sign_in' ? 'Login' : 'Criar conta'}>
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl text-white shadow-lg shadow-emerald-950/40" aria-hidden="true">
            <i className={`fa-solid ${view === 'sign_in' ? 'fa-arrow-right-to-bracket' : 'fa-user-plus'}`} />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-black text-white">{view === 'sign_in' ? 'Acesse sua conta' : 'Crie sua conta'}</h1>
          <p className="mt-2 text-sm text-slate-400">{view === 'sign_in' ? 'Entre para continuar no BS Clube.' : 'Cadastre-se para participar dos bolões.'}</p>
        </div>

        {view === 'sign_in' ? <SignInForm /> : <SignUpForm />}
      </section>
    </div>
  );
}
