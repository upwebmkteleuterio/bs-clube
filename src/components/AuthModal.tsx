import { useEffect, useRef, useState } from 'react';
import AuthPanel, { AuthView } from './AuthPanel';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>('sign_in');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = 'selection-auth-modal-title';

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={onClose} aria-label="Fechar autenticação" />
      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto">
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3">
          <h2 id={titleId} className="font-heading text-lg font-black text-white">Entre para confirmar</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar autenticação"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <AuthPanel view={view} onViewChange={setView} />
      </div>
    </div>
  );
}
