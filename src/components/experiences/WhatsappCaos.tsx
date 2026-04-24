import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock de mensagens para simular o caos
const MESSAGES = [
  { name: 'João (Operação)', text: 'Chefe, o sistema caiu. O que a gente faz?' },
  { name: 'Maria (Financeiro)', text: 'O cliente VIP não pagou o boleto. Posso bloquear?' },
  { name: 'Carlos (Vendas)', text: 'Preciso de desconto de 20% pra fechar, aprova?' },
  { name: 'Ana (RH)', text: 'Dois funcionários pediram demissão hoje.' },
  { name: 'Cliente Chato', text: 'Você me prometeu que entregava hoje. Cadê??' },
  { name: 'Fornecedor', text: 'Os boletos estão vencidos. Não vamos entregar.' },
  { name: 'Pedro (Marketing)', text: 'A campanha deu erro. Torramos 5k em 1 hora.' },
  { name: 'Advogado', text: 'Recebemos uma notificação extrajudicial.' },
  { name: 'Esposa/Marido', text: 'Você vem jantar hoje ou vai virar de novo?' },
  { name: 'Filho(a)', text: 'Você prometeu que ia no meu jogo...' }
];

export default function WhatsappCaos({ onComplete }: { onComplete?: () => void }) {
  const [messages, setMessages] = useState<{ id: number; name: string; text: string }[]>([]);
  const [started, setStarted] = useState(false);
  const [climax, setClimax] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const playNotificationSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Som clássico de notificação de smartphone (Do-Re)
    const playTone = (freq: number, time: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    const now = ctx.currentTime;
    playTone(600, now, 0.1);
    playTone(800, now + 0.15, 0.2);

    if (navigator.vibrate) navigator.vibrate(100);
  };

  const handleStart = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    setStarted(true);
  };

  useEffect(() => {
    if (!started || climax) return;

    let idCounter = 0;
    let speed = 2000;

    const spawnMessage = () => {
      if (climax) return;
      
      playNotificationSound();
      const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      
      setMessages(prev => {
        const newMsgs = [...prev, { ...randomMsg, id: idCounter++ }];
        if (newMsgs.length > 50) setClimax(true); // Estoura no limite
        return newMsgs;
      });

      // Acelera progressivamente
      speed = Math.max(100, speed * 0.85);
      
      if (!climax && idCounter <= 50) {
        setTimeout(spawnMessage, speed);
      }
    };

    setTimeout(spawnMessage, 1000);

    return () => {};
  }, [started, climax]);

  return (
    <div className="relative w-full h-full min-h-[700px] bg-black overflow-hidden font-sans flex items-center justify-center select-none">
      
      {/* Vídeo Fundo Desfocado (Simulando estar na rua ou transito) */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=2000&q=80" 
          className="w-full h-full object-cover blur-md"
          alt="Phone background"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {!started ? (
        <motion.div 
          className="relative z-10 text-center cursor-pointer p-12 bg-green-900/20 hover:bg-green-900/40 border border-green-500/50 rounded-2xl transition-colors backdrop-blur-md"
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-white font-bold uppercase tracking-widest text-lg">Desbloquear Celular</h2>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {!climax ? (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              className="relative z-10 w-full max-w-sm h-[600px] bg-[#111] border border-white/10 rounded-[3rem] p-4 shadow-2xl overflow-hidden flex flex-col justify-end"
            >
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#111] to-transparent z-20 flex items-start justify-center pt-4">
                <div className="w-20 h-1 bg-white/20 rounded-full"></div>
              </div>

              <div className="flex flex-col gap-3 pb-8 z-10">
                <AnimatePresence>
                  {messages.slice(-8).map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -50, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="bg-[#222] p-4 rounded-2xl rounded-tl-sm border border-white/5 shadow-lg relative"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-green-500 font-bold text-xs">{msg.name}</span>
                        <span className="text-white/30 text-[10px]">agora</span>
                      </div>
                      <p className="text-white/90 text-sm leading-snug">{msg.text}</p>
                      
                      {/* Badge indicador de não lida */}
                      <div className="absolute -right-2 -top-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-pulse">
                        1
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="climax"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="w-24 h-24 mx-auto mb-8 bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(255,0,0,0.5)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h1 className="text-white text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
                  Sobrecarga Crítica
                </h1>
                <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                  Você virou o gargalo da própria empresa. Se o seu WhatsApp não para, significa que o seu time não tem autonomia e seus processos não funcionam.
                </p>
                <button 
                  onClick={() => onComplete ? onComplete() : window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/'}
                  className="px-10 py-5 bg-white hover:bg-green-500 hover:text-white text-black font-black uppercase tracking-widest text-lg rounded transition-all transform hover:scale-105"
                >
                  Descentralizar Operação
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
