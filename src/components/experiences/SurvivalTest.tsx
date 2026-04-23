import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';

const SCENARIOS = [
  {
    id: 1,
    title: 'O Vendedor Estrela Sumiu',
    desc: 'O cliente de 50k quer cancelar. O vendedor não atende o celular.',
    optA: 'Entrar na call você mesmo e apaziguar',
    optB: 'Cobrar o gerente comercial na hora',
    cost: 15000
  },
  {
    id: 2,
    title: 'Servidor Caiu no Lançamento',
    desc: 'Sem página de vendas no ar. O time de TI diz que não tem autorização pra dobrar os custos da AWS.',
    optA: 'Autorizar o cartão de crédito e escalar',
    optB: 'Entrar no painel da AWS você mesmo',
    cost: 25000
  },
  {
    id: 3,
    title: 'Briga no Caixa',
    desc: 'O RH mandou a rescisão errada de um funcionário problemático. Ele está processando.',
    optA: 'Revisar a planilha de rescisão',
    optB: 'Pagar o advogado pra abafar',
    cost: 30000
  },
];

export default function SurvivalTest({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [cash, setCash] = useState(150000);
  const [isDead, setIsDead] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (isDead) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsDead(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isDead]);

  const handleChoice = (cost: number) => {
    // Tela dá um glitch a cada decisão
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);

    setCash(prev => prev - cost);
    if (step < SCENARIOS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setIsDead(true);
    }
  };

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col items-center justify-center bg-[#050505] overflow-hidden font-mono text-white p-4">
      
      {/* Glitch Overlay Effect */}
      <AnimatePresence>
        {glitch && (
          <motion.div 
            className="absolute inset-0 z-50 bg-red-600 mix-blend-color-burn pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [-10, 10, -10, 10, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {!isDead ? (
        <div className="w-full max-w-2xl border border-red-900/50 bg-[#0A0A0A] shadow-[0_0_50px_rgba(255,0,0,0.1)] rounded-lg p-6 relative">
          
          {/* Header Dashboard */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#333]">
            <div className="flex items-center gap-3 text-red-500">
              <Clock className="animate-pulse" />
              <span className="text-2xl font-black">{timeLeft}s</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-white/50 uppercase tracking-widest">Caixa da Empresa</span>
              <motion.span 
                key={cash}
                initial={{ scale: 1.5, color: '#ff0000' }}
                animate={{ scale: 1, color: '#D4AF37' }}
                className="text-3xl font-black tracking-tighter"
              >
                {formatter.format(cash)}
              </motion.span>
            </div>
          </div>

          {/* Cenário Atual */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 text-red-500 mb-2">
                <AlertTriangle size={24} />
                <h2 className="text-xl font-bold uppercase tracking-wider">Crise {step + 1} de {SCENARIOS.length}</h2>
              </div>
              
              <h3 className="text-3xl font-black text-white">{SCENARIOS[step].title}</h3>
              <p className="text-white/70 text-lg leading-relaxed">{SCENARIOS[step].desc}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <button 
                  onClick={() => handleChoice(SCENARIOS[step].cost)}
                  className="bg-[#111] hover:bg-red-900/30 border border-[#333] hover:border-red-500 p-6 rounded text-left transition-all group"
                >
                  <span className="block text-xs text-red-500 mb-2 uppercase tracking-widest group-hover:animate-pulse">Opção A</span>
                  <span className="font-bold text-white/90">{SCENARIOS[step].optA}</span>
                </button>
                <button 
                  onClick={() => handleChoice(SCENARIOS[step].cost)}
                  className="bg-[#111] hover:bg-red-900/30 border border-[#333] hover:border-red-500 p-6 rounded text-left transition-all group"
                >
                  <span className="block text-xs text-red-500 mb-2 uppercase tracking-widest group-hover:animate-pulse">Opção B</span>
                  <span className="font-bold text-white/90">{SCENARIOS[step].optB}</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Clímax / Fim de Jogo */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl"
        >
          <div className="mb-6 flex justify-center text-red-600">
            <TrendingDown size={64} />
          </div>
          <h1 className="text-5xl font-black text-red-600 uppercase tracking-tighter mb-6">
            O Jogo é Viciado
          </h1>
          <p className="text-xl text-white/80 leading-relaxed font-sans mb-8">
            Você perdeu <strong className="text-white">{formatter.format(150000 - cash)}</strong> em minutos. O problema nunca foram as escolhas que você fez. O problema é <strong className="text-red-500">você ser a pessoa que precisa fazê-las.</strong>
          </p>
          <p className="text-md text-white/50 mb-12 uppercase tracking-widest">
            Enquanto você jogar de bombeiro, a empresa sempre vai queimar.
          </p>
          <button 
            onClick={() => onComplete ? onComplete() : window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/'}
            className="w-full md:w-auto px-12 py-5 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-black uppercase tracking-widest text-lg rounded transition-transform hover:scale-105"
          >
            Sair do Jogo Operacional
          </button>
        </motion.div>
      )}
    </div>
  );
}
