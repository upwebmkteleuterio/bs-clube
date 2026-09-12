import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';
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
      social_provider_text: 'Entrar com {{provider}}',
      link_text: 'Já possui uma conta? Entre aqui',
    },
    sign_up: {
      email_label: 'E-mail',
      password_label: 'Senha',
      email_input_placeholder: 'seu@email.com',
      password_input_placeholder: 'Crie uma senha',
      button_label: 'Criar conta',
      loading_button_label: 'Criando conta...',
      social_provider_text: 'Cadastrar com {{provider}}',
      link_text: 'Ainda não possui uma conta? Cadastre-se',
    },
    forgotten_password: {
      email_label: 'E-mail',
      password_label: 'Senha',
      email_input_placeholder: 'seu@email.com',
      button_label: 'Enviar instruções',
      loading_button_label: 'Enviando...',
      link_text: 'Esqueceu sua senha?',
    },
    update_password: {
      password_label: 'Nova senha',
      password_input_placeholder: 'Digite sua nova senha',
      button_label: 'Atualizar senha',
      loading_button_label: 'Atualizando...',
    },
    confirmation_text: 'Verifique seu e-mail para confirmar o cadastro.',
  },
};

export default function AuthPage({ view }: { view: 'sign_in' | 'sign_up' }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from || '/';

  useEffect(() => {
    if (session) navigate(returnTo, { replace: true });
  }, [navigate, returnTo, session]);

  return (
    <main className="min-h-screen bg-brand-dark text-slate-50 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md glass-card rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-950/40">
            <i className={`fa-solid ${view === 'sign_in' ? 'fa-arrow-right-to-bracket' : 'fa-user-plus'}`} />
          </div>
          <h1 className="font-heading text-2xl font-black text-white mt-4">
            {view === 'sign_in' ? 'Acesse sua conta' : 'Crie sua conta'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {view === 'sign_in'
              ? 'Entre para continuar no BS Clube.'
              : 'Cadastre-se para participar dos bolões.'}
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          view={view}
          showLinks={false}
          appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: '#10b981', brandAccent: '#34d399', inputBackground: '#020617', inputText: '#f8fafc' } } } }}
          localization={localization}
        />

        <div className="text-center mt-6 text-sm text-slate-400">
          {view === 'sign_in' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}{' '}
          <Link
            to={view === 'sign_in' ? '/cadastro' : '/login'}
            state={location.state}
            className="font-bold text-emerald-400 hover:text-emerald-300"
          >
            {view === 'sign_in' ? 'Cadastre-se' : 'Entrar'}
          </Link>
        </div>
        <Link to="/" className="block text-center text-xs text-slate-500 hover:text-slate-300 mt-4">
          Voltar para o início
        </Link>
      </section>
    </main>
  );
}
