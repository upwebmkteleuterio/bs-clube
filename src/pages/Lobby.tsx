import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../store/useAppStore';

function MoneyRainAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let moneyInterval: number;
    let isVisible = true;

    const createBanknote = () => {
      if (!isVisible || !containerRef.current) return;
      
      const container = containerRef.current;
      const banknote = document.createElement('div');
      banknote.classList.add('banknote');
      
      const randomLeft = Math.floor(Math.random() * 80) + 10;
      banknote.style.left = `${randomLeft}%`;
      
      const randomDuration = (Math.random() * 2) + 2;
      banknote.style.animationDuration = `${randomDuration}s`;
      
      const randomDelay = Math.random() * 0.5;
      banknote.style.animationDelay = `${randomDelay}s`;
      
      const randomRotation = Math.floor(Math.random() * 360);
      banknote.style.transform = `rotate(${randomRotation}deg)`;
      
      container.appendChild(banknote);
      
      setTimeout(() => {
        if (banknote.parentNode === container) {
          banknote.remove();
        }
      }, (randomDuration + randomDelay) * 1000);
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial burst
    for(let i = 0; i < 15; i++) {
      setTimeout(createBanknote, Math.random() * 500);
    }
    
    // Continuous loop
    moneyInterval = window.setInterval(createBanknote, 150);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(moneyInterval);
    };
  }, []);

  return (
    <div className="money-container" ref={containerRef}>
      <div className="wallet-pocket"></div>
    </div>
  );
}

export default function Lobby() {
  const navigate = useNavigate();
  const [countSecs, setCountSecs] = useState(45);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { session } = useAuth();
  const { balanceTotal } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountSecs((prev) => (prev - 1 < 0 ? 59 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleDirectLogin = () => navigate('/login');
  const handleSignup = () => navigate('/cadastro');

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14]" style={{ backgroundImage: 'radial-gradient(ellipse 100% 70% at 50% 0%, rgba(16, 185, 129, 0.30) 0%, #070b14 100%)', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <header className="w-full glass-header sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 flex-shrink min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/50 text-lg sm:text-xl">
              <i className="fa-solid fa-clover"></i>
            </div>
            <div className="flex flex-col min-w-0 truncate">
              <h1 className="font-heading font-black text-lg sm:text-2xl text-white leading-none tracking-tight flex items-center flex-wrap sm:flex-nowrap gap-1 sm:gap-0">
                <span className="truncate">BS CLUBE</span>
                <span className="text-[8px] sm:text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-1 sm:px-1.5 py-0.5 rounded border border-emerald-500/20 sm:ml-1 whitespace-nowrap">Mega-Sena</span>
              </h1>
              <span className="text-[9px] sm:text-[11px] text-slate-400 font-medium truncate hidden sm:block">Bolões da Mega-Sena no Pix</span>
            </div>
          </div>

          <div className="hidden md:flex items-center bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 space-x-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <span className="text-xs text-slate-300 font-medium">Prêmio Garantido</span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-xs text-slate-400">Apurado via Caixa Econômica</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {!session ? (
              <>
                <button onClick={handleDirectLogin} className="flex text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition items-center space-x-1 sm:space-x-2">
                  <i className="fa-solid fa-arrow-right-to-bracket text-slate-400 hidden sm:inline"></i>
                  <span>Entrar</span>
                </button>
                <button onClick={handleSignup} className="bg-gradient-to-r from-emerald-500 to-brand-accent hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-2 px-3 sm:py-2.5 sm:px-5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm shadow-lg shadow-emerald-950/50 transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5 sm:space-x-2">
                  <i className="fa-solid fa-user-plus hidden sm:inline"></i>
                  <span>Criar Conta</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                 <button onClick={() => navigate('/carteira')} className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-slate-300 flex items-center space-x-1 sm:space-x-2 hover:bg-slate-800 transition">
                    <i className="fa-solid fa-wallet text-emerald-400"></i>
                    <span className="whitespace-nowrap">R$ {balanceTotal.toFixed(2).replace('.', ',')}</span>
                 </button>
                 <button onClick={() => navigate('/resultados')} className="text-emerald-400 hover:text-emerald-300 transition text-[10px] sm:text-xs font-bold flex items-center space-x-1">
                    <span>Entrar</span>
                    <i className="fa-solid fa-arrow-right"></i>
                 </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="w-full relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
            {/* Hero Content (Esquerda) */}
            <div className="space-y-6 lg:pr-8 text-center lg:text-left relative z-20">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
                <i className="fa-solid fa-fire-flame-curved text-emerald-400 text-sm"></i>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Bolões Coletivos de Alta Probabilidade</span>
              </div>
              
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Concorra aos Prêmios da Mega-Sena a partir de <span className="text-brand-gold">R$ 10,00</span>
              </h2>
              
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Aposte em grupo no modelo <strong>Bingo Digital</strong>. Multiplique suas chances dividindo cotas com apuração em tempo real direto dos sorteios da Caixa.
              </p>

              {/* Trust Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <i className="fa-brands fa-pix text-brand-pix"></i>
                  <span>Pagamento Instantâneo Pix</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                  <span>Retenção Justa (22%)</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <i className="fa-solid fa-landmark text-amber-500"></i>
                  <span>Sorteios Oficiais Caixa</span>
                </div>
              </div>
            </div>

            {/* Hero CTA Card (Direita - Com Animação) */}
            <div className="glass-card rounded-3xl p-1 relative shadow-2xl shadow-amber-900/20 border-2 border-amber-500/60 transform hover:-translate-y-1 transition-transform duration-500">
                
              {/* Glow de fundo do card */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-brand-gold/10 rounded-3xl pointer-events-none"></div>
              
              {/* Card Interno Escuro */}
              <div className="bg-slate-950/90 rounded-[22px] p-8 relative z-10 text-center border border-slate-800 overflow-hidden min-h-[400px] flex flex-col justify-center">
                  
                {/* CONTAINER DA ANIMAÇÃO DE DINHEIRO */}
                <MoneyRainAnimation />

                {/* CONTEÚDO DO CARD (Sobreposto à animação com z-10) */}
                <div className="relative z-10">
                  <div className="inline-block bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-1.5 mb-6">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest shadow-sm">Próximo Sorteio Oficial • Concurso #2780</span>
                  </div>

                  <p className="text-sm text-slate-300 font-bold mb-1 tracking-wide">PRÊMIO DO BOLÃO LOTADO</p>
                  
                  {/* Valor do Prêmio com Sombra para destacar em cima da animação */}
                  <h3 className="font-heading text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-brand-gold to-amber-500 mb-8 drop-shadow-[0_4px_15px_rgba(245,158,11,0.4)]">
                    R$ 1.560,00
                  </h3>

                  <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">Sorteio encerra em:</p>
                  
                  {/* Countdown */}
                  <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl flex items-center justify-center font-heading text-2xl sm:text-3xl font-black text-white shadow-lg">01</div>
                      <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Dias</span>
                    </div>
                    <span className="text-slate-600 font-black text-xl sm:text-2xl -mt-6">:</span>
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl flex items-center justify-center font-heading text-2xl sm:text-3xl font-black text-white shadow-lg">14</div>
                      <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Horas</span>
                    </div>
                    <span className="text-slate-600 font-black text-xl sm:text-2xl -mt-6">:</span>
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl flex items-center justify-center font-heading text-2xl sm:text-3xl font-black text-white shadow-lg">15</div>
                      <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Min</span>
                    </div>
                    <span className="text-slate-600 font-black text-xl sm:text-2xl -mt-6">:</span>
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl flex items-center justify-center font-heading text-2xl sm:text-3xl font-black text-brand-accent shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">{countSecs.toString().padStart(2, '0')}</div>
                      <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Seg</span>
                    </div>
                  </div>

                  <a href="#vitrine" className="w-full bg-brand-gold hover:bg-amber-400 text-slate-900 font-black py-4 rounded-xl text-lg shadow-xl shadow-amber-900/40 transition-all transform hover:scale-[1.02] flex justify-center items-center space-x-3">
                    <i className="fa-solid fa-ticket"></i>
                    <span>VER BOLÕES DISPONÍVEIS</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/50">
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl font-black text-white mb-3">Como Funciona o BS Clube?</h3>
            <p className="text-slate-400 text-sm">Participe dos nossos bolões de forma rápida, transparente e 100% digital em 3 passos fáceis.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute -right-4 -top-6 text-8xl font-black text-slate-700/60 font-heading select-none group-hover:text-slate-600/80 transition-colors">01</div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl mb-6 relative z-10">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <h4 className="font-heading text-lg font-bold text-white mb-2 relative z-10">1. Escolha a sua Cota</h4>
              <p className="text-sm text-slate-400 relative z-10 leading-relaxed">Selecione o bolão ideal no lobby com valores acessíveis de cotas (<strong>R$ 10, R$ 20 ou R$ 50</strong>).</p>
            </div>
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
              <div className="absolute -right-4 -top-6 text-8xl font-black text-slate-700/60 font-heading select-none group-hover:text-slate-600/80 transition-colors">02</div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center text-amber-500 text-xl mb-6 relative z-10">
                <i className="fa-solid fa-table-cells"></i>
              </div>
              <h4 className="font-heading text-lg font-bold text-white mb-2 relative z-10">2. Marque suas 6 Dezenas</h4>
              <p className="text-sm text-slate-400 relative z-10 leading-relaxed">Defina suas dezenas de sorte na cartela interativa ou utilize a opção "Surpresinha" para marcação automática.</p>
            </div>
            <div className="glass-card rounded-2xl p-8 relative overflow-hidden group hover:border-teal-500/30 transition-colors">
              <div className="absolute -right-4 -top-6 text-8xl font-black text-slate-700/60 font-heading select-none group-hover:text-slate-600/80 transition-colors">03</div>
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl border border-teal-500/20 flex items-center justify-center text-brand-pix text-xl mb-6 relative z-10">
                <i className="fa-brands fa-pix"></i>
              </div>
              <h4 className="font-heading text-lg font-bold text-white mb-2 relative z-10">3. Pague no Pix e Acompanhe</h4>
              <p className="text-sm text-slate-400 relative z-10 leading-relaxed">Confirme instantaneamente via Pix. Acompanhe a apuração ao vivo no ranking e receba os prêmios na hora.</p>
            </div>
          </div>
        </section>

        <section id="vitrine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <i className="fa-solid fa-ticket-simple"></i>
              </div>
              <div>
                <h3 className="font-heading text-2xl font-black text-white">Bolões Abertos em Destaque</h3>
                <p className="text-xs text-slate-400">Garanta sua cota antes do encerramento das vagas</p>
              </div>
            </div>

            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 w-full sm:w-auto overflow-x-auto hide-scrollbar">
              <button className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs whitespace-nowrap">Todos os Bolões</button>
              <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-white font-semibold text-xs transition whitespace-nowrap">Cota R$ 10</button>
              <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-white font-semibold text-xs transition whitespace-nowrap">Cota R$ 20</button>
              <button className="px-4 py-2 rounded-lg text-slate-400 hover:text-white font-semibold text-xs transition whitespace-nowrap">Cota R$ 50</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="glass-card rounded-2xl p-1 border border-emerald-500/30 hover:border-emerald-500/60 transition-colors shadow-lg hover:shadow-emerald-900/20">
              <div className="bg-slate-950/60 rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Aberto</span>
                      <span className="text-[10px] text-slate-500">• Sorteio #2780</span>
                    </div>
                    <h4 className="font-heading text-2xl font-black text-white">Sorteio BIG 10</h4>
                    <p className="text-[11px] text-slate-400">Entrada acessível • Ideal para iniciantes</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Valor Cota</span>
                    <strong className="text-xl font-black text-emerald-400">R$ 10,00</strong>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between mb-5">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Prêmio do Bolão</span>
                    <strong className="text-brand-gold text-sm font-bold">R$ 45.000,00</strong>
                  </div>
                  <div className="text-right border-l border-slate-800 pl-4">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Dezenas no Grid</span>
                    <strong className="text-white text-sm font-bold">6 Dezenas</strong>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Vagas Preenchidas</span>
                    <span className="text-emerald-400 font-bold">12 / 100 cotas</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[12%]"></div>
                  </div>
                </div>

                <button onClick={() => navigate('/selecao-dezenas')} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-sm transition flex justify-center items-center space-x-2 border border-slate-700">
                  <span>Participar Agora</span>
                  <i className="fa-solid fa-arrow-right text-emerald-400"></i>
                </button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-1 border border-amber-500/30 hover:border-amber-500/60 transition-colors shadow-lg hover:shadow-amber-900/20">
              <div className="bg-slate-950/60 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Reg. Tardio</span>
                      <span className="text-[10px] text-slate-500">• Quase Lotado</span>
                    </div>
                    <h4 className="font-heading text-2xl font-black text-white">Sorteio BIG 20</h4>
                    <p className="text-[11px] text-slate-400">Alta procura • Maiores prêmios por cota</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Valor Cota</span>
                    <strong className="text-xl font-black text-amber-400">R$ 20,00</strong>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between mb-5 relative z-10">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Prêmio do Bolão</span>
                    <strong className="text-brand-gold text-sm font-bold">R$ 120.000,00</strong>
                  </div>
                  <div className="text-right border-l border-slate-800 pl-4">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Dezenas no Grid</span>
                    <strong className="text-white text-sm font-bold">6 Dezenas</strong>
                  </div>
                </div>

                <div className="mb-5 relative z-10">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Vagas Preenchidas</span>
                    <span className="text-amber-400 font-bold">88 / 100 cotas</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[88%]"></div>
                  </div>
                </div>

                <button onClick={() => navigate('/selecao-dezenas')} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-sm transition flex justify-center items-center space-x-2 border border-slate-700 relative z-10">
                  <span>Participar Agora</span>
                  <i className="fa-solid fa-arrow-right text-amber-400"></i>
                </button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-1 border border-slate-700 hover:border-emerald-500/40 transition-colors shadow-lg">
              <div className="bg-slate-950/60 rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Aberto</span>
                      <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-1 rounded">Categoria VIP</span>
                    </div>
                    <h4 className="font-heading text-2xl font-black text-white">Sorteio BIG 50</h4>
                    <p className="text-[11px] text-slate-400">Grupo Exclusivo • Cotas Restritas</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Valor Cota</span>
                    <strong className="text-xl font-black text-emerald-400">R$ 50,00</strong>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between mb-5">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Prêmio do Bolão</span>
                    <strong className="text-brand-gold text-sm font-bold">R$ 350.000,00</strong>
                  </div>
                  <div className="text-right border-l border-slate-800 pl-4">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Dezenas no Grid</span>
                    <strong className="text-white text-sm font-bold">6 Dezenas</strong>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Vagas Preenchidas</span>
                    <span className="text-emerald-400 font-bold">34 / 50 cotas</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[68%]"></div>
                  </div>
                </div>

                <button onClick={() => navigate('/selecao-dezenas')} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl text-sm transition flex justify-center items-center space-x-2 border border-slate-700">
                  <span>Participar Agora</span>
                  <i className="fa-solid fa-arrow-right text-emerald-400"></i>
                </button>
              </div>
            </div>

          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/50">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-brand-gold">
                <i className="fa-solid fa-trophy"></i>
              </div>
              <div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-white">Últimos Ganhadores</h3>
                <p className="text-[11px] sm:text-xs text-slate-400">Transparência total e prêmios pagos via Pix na hora</p>
              </div>
            </div>
            <div className="hidden sm:flex space-x-2">
              <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"><i className="fa-solid fa-chevron-left text-xs"></i></button>
              <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"><i className="fa-solid fa-chevron-right text-xs"></i></button>
            </div>
          </div>

          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
            <div className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-2xl p-5 snap-center flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg">MS</div>
                <div>
                  <p className="text-sm font-bold text-white">Marcos S.</p>
                  <p className="text-[10px] text-slate-500">São Paulo, SP</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-0.5">Premiação Recebida</span>
                  <strong className="text-xl font-black text-brand-gold">R$ 3.200,00</strong>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Bolão BIG 20</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Concurso #2779</span>
                <span className="text-brand-pix font-bold flex items-center"><i className="fa-solid fa-check-circle mr-1"></i> Pago via Pix</span>
              </div>
            </div>
            
            <div className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-2xl p-5 snap-center flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center font-bold text-white shadow-lg">CR</div>
                <div>
                  <p className="text-sm font-bold text-white">Carla R.</p>
                  <p className="text-[10px] text-slate-500">Belo Horizonte, MG</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-0.5">Premiação Recebida</span>
                  <strong className="text-xl font-black text-brand-gold">R$ 8.450,00</strong>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Bolão BIG 50</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Concurso #2779</span>
                <span className="text-brand-pix font-bold flex items-center"><i className="fa-solid fa-check-circle mr-1"></i> Pago via Pix</span>
              </div>
            </div>

            <div className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-2xl p-5 snap-center flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">LA</div>
                <div>
                  <p className="text-sm font-bold text-white">Lucas A.</p>
                  <p className="text-[10px] text-slate-500">Curitiba, PR</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-0.5">Premiação Recebida</span>
                  <strong className="text-xl font-black text-brand-gold">R$ 1.150,00</strong>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Bolão BIG 10</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Concurso #2778</span>
                <span className="text-brand-pix font-bold flex items-center"><i className="fa-solid fa-check-circle mr-1"></i> Pago via Pix</span>
              </div>
            </div>

            <div className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-2xl p-5 snap-center flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white shadow-lg">AF</div>
                <div>
                  <p className="text-sm font-bold text-white">Amanda F.</p>
                  <p className="text-[10px] text-slate-500">Rio de Janeiro, RJ</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-0.5">Premiação Recebida</span>
                  <strong className="text-xl font-black text-brand-gold">R$ 15.300,00</strong>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Bolão VIP</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Concurso #2778</span>
                <span className="text-brand-pix font-bold flex items-center"><i className="fa-solid fa-check-circle mr-1"></i> Pago via Pix</span>
              </div>
            </div>

            <div className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-2xl p-5 snap-center flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shadow-lg">RC</div>
                <div>
                  <p className="text-sm font-bold text-white">Roberto C.</p>
                  <p className="text-[10px] text-slate-500">Salvador, BA</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-0.5">Premiação Recebida</span>
                  <strong className="text-xl font-black text-brand-gold">R$ 5.400,00</strong>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Bolão BIG 50</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Concurso #2777</span>
                <span className="text-brand-pix font-bold flex items-center"><i className="fa-solid fa-check-circle mr-1"></i> Pago via Pix</span>
              </div>
            </div>

            <div className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-2xl p-5 snap-center flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white shadow-lg">JT</div>
                <div>
                  <p className="text-sm font-bold text-white">Juliana T.</p>
                  <p className="text-[10px] text-slate-500">Fortaleza, CE</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-0.5">Premiação Recebida</span>
                  <strong className="text-xl font-black text-brand-gold">R$ 2.800,00</strong>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Bolão BIG 20</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Concurso #2777</span>
                <span className="text-brand-pix font-bold flex items-center"><i className="fa-solid fa-check-circle mr-1"></i> Pago via Pix</span>
              </div>
            </div>

            <div className="min-w-[280px] bg-slate-900 border border-slate-800 rounded-2xl p-5 snap-center flex-shrink-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white shadow-lg">DM</div>
                <div>
                  <p className="text-sm font-bold text-white">Diego M.</p>
                  <p className="text-[10px] text-slate-500">Brasília, DF</p>
                </div>
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase mb-0.5">Premiação Recebida</span>
                  <strong className="text-xl font-black text-brand-gold">R$ 890,00</strong>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Bolão BIG 10</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Concurso #2776</span>
                <span className="text-brand-pix font-bold flex items-center"><i className="fa-solid fa-check-circle mr-1"></i> Pago via Pix</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
          <div className="text-center mb-10">
            <h3 className="font-heading text-2xl font-black text-white mb-2">Dúvidas Frequentes</h3>
            <p className="text-slate-400 text-xs">Tudo o que você precisa saber antes de adquirir sua cota</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Como o BS Clube utiliza os sorteios da Caixa Econômica?",
                a: "Nós operamos no modelo de Bingo Digital coletivo. Utilizamos exclusivamente os números sorteados oficialmente pela Caixa Econômica Federal nos sorteios da Mega-Sena. Assim que os números são anunciados na TV, nosso sistema os captura e cruza com todas as cotas ativas no site de forma automática."
              },
              {
                q: "Como recebo o meu prêmio em caso de vitória?",
                a: "Se a sua cota for premiada, o valor do prêmio líquido (descontando a taxa de 22% da plataforma) é creditado instantaneamente na sua 'Carteira' dentro do site. De lá, você pode solicitar o saque via Pix Copia e Cola, e o valor será transferido para sua conta bancária imediatamente."
              },
              {
                q: "Preciso ter conta cadastrada para ver os jogos?",
                a: "Não! Você pode navegar pela vitrine, ver os bolões abertos e até simular a escolha das suas 6 dezenas como visitante. No entanto, para confirmar o pagamento via Pix e validar sua participação no sorteio, solicitaremos um cadastro muito rápido e seguro usando apenas seu número de celular."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button 
                  className="w-full text-left px-5 py-4 flex justify-between items-center focus:outline-none" 
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-sm text-slate-200">{faq.q}</span>
                  <i className={`fa-solid fa-chevron-down text-slate-500 transition-transform duration-300 transform ${openFaq === index ? 'rotate-180' : ''}`}></i>
                </button>
                <div className={`faq-answer px-5 text-xs text-slate-400 leading-relaxed ${openFaq === index ? 'open pb-4' : ''}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 pt-12 pb-24 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <i className="fa-solid fa-clover"></i>
                </div>
                <span className="font-heading font-black text-xl text-white">BS CLUBE</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed pr-4">
                A plataforma inovadora de entretenimento e apostas coletivas baseada na loteria oficial. Transparência, velocidade e prêmios direto no seu Pix.
              </p>
            </div>
            
            <div>
              <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-wider">Navegação</h5>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Vitrine de Bolões</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Resultados ao Vivo</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Minha Carteira</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-wider">Segurança e Termos</h5>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Jogo Responsável</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-wider">Atendimento</h5>
              <p className="text-[10px] text-slate-400 mb-3">Suporte 24/7 via WhatsApp e Chat no aplicativo.</p>
              <button className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2">
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>Falar no Suporte</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-center text-[9px] text-slate-600">
            <p>&copy; 2026 BS Clube (Big Show Clube). Todos os direitos reservados.</p>
            <p className="flex items-center mt-2 md:mt-0"><i className="fa-solid fa-shield-halved mr-1 text-slate-500"></i> Ambiente Seguro com Criptografia SSL</p>
          </div>
        </div>
      </footer>

      {/* Navigation handled by BottomNav component */}
    </div>
  );
}
