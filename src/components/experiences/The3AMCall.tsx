import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff } from 'lucide-react';

export default function The3AMCall({ onComplete }: { onComplete?: () => void }) {
  const [answered, setAnswered] = useState(false);
  const [declinedCount, setDeclinedCount] = useState(0);
  const [climaxPhase, setClimaxPhase] = useState(0); // 0: Ringing, 1: Answered Silence, 2: Audio Msg, 3: Blackout
  
  // Áudio Sintético para o Ringtone e Tensão
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    // Inicia o contexto de áudio
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtxRef.current = new AudioContext();
    }
    
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSyntheticRing = () => {
    if (!audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(400 + (declinedCount * 50), ctx.currentTime); // Fica mais agudo/estridente se recusar
    osc.frequency.setValueAtTime(450 + (declinedCount * 50), ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1 + (declinedCount * 0.05), ctx.currentTime + 0.1); // Fica mais alto
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  const playLowDrone = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime); // Frequência muito baixa (tensão)
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
  };

  useEffect(() => {
    if (climaxPhase === 0) {
      const ringTimer = setInterval(() => {
        playSyntheticRing();
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      }, 2000);
      return () => clearInterval(ringTimer);
    }
  }, [climaxPhase, declinedCount]);

  const handleDecline = () => {
    setDeclinedCount(p => p + 1);
    // Tocar um bipe de erro e fazer a tela tremer
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleAnswer = () => {
    setAnswered(true);
    setClimaxPhase(1);
    playLowDrone();
    
    // Silêncio profundo por 3 segundos, depois a mensagem
    setTimeout(() => {
      setClimaxPhase(2);
      
      // Voz sintética (SpeechSynthesis)
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Por que a empresa inteira dorme, e só você está acordado consertando os erros deles?");
        msg.lang = 'pt-BR';
        msg.pitch = 0.5; // Voz grossa e seca
        msg.rate = 0.8; // Devagar
        window.speechSynthesis.speak(msg);
        
        msg.onend = () => {
          setTimeout(() => setClimaxPhase(3), 1000);
        };
      } else {
        // Fallback visual se não houver áudio
        setTimeout(() => setClimaxPhase(3), 5000);
      }
      
    }, 3000);
  };

  return (
    <div className="relative w-full h-full min-h-[700px] bg-black overflow-hidden font-sans select-none flex items-center justify-center">
      
      {/* Vídeo de Fundo: Quarto Escuro (Só aparece antes do blackout) */}
      <AnimatePresence>
        {climaxPhase < 3 && (
          <motion.div 
            className="absolute inset-0 z-0 opacity-40"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1517868351636-70e1bba87c26?q=80&w=2000" 
              className="w-full h-full object-cover blur-sm"
              alt="Dark Room"
            />
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          
          {climaxPhase === 0 && (
            <motion.div 
              key="ringing"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1, x: declinedCount > 0 ? [-5, 5, -5, 5, 0] : 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-2xl flex flex-col items-center h-[600px] justify-between"
            >
              <div className="text-center mt-8">
                <p className="text-white/50 text-sm tracking-widest uppercase mb-4">Ligação Recebida</p>
                <h2 className="text-white text-3xl font-light">URGÊNCIA</h2>
                <h3 className="text-red-500 font-bold mt-1 tracking-widest text-sm">OPERAÇÃO PARADA</h3>
              </div>

              <div className="flex w-full justify-between px-4 mb-12">
                <button 
                  onClick={handleDecline}
                  className="w-16 h-16 rounded-full bg-red-600/20 hover:bg-red-600 flex items-center justify-center text-red-500 hover:text-white transition-all transform hover:scale-110 border border-red-600/50"
                >
                  <PhoneOff size={28} />
                </button>

                <button 
                  onClick={handleAnswer}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-pulse"
                >
                  <Phone size={28} className="animate-bounce" />
                </button>
              </div>
            </motion.div>
          )}

          {climaxPhase === 1 && (
            <motion.div 
              key="silence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-white/30 text-2xl font-light tracking-widest uppercase animate-pulse">
                Silêncio Absoluto...
              </h2>
            </motion.div>
          )}

          {climaxPhase === 2 && (
            <motion.div 
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center px-6"
            >
              <h1 className="text-white text-3xl md:text-4xl font-serif italic text-shadow-lg leading-relaxed">
                "Por que a empresa inteira dorme,<br />
                <span className="text-red-600 font-bold not-italic">e só você está acordado</span><br />
                consertando os erros deles?"
              </h1>
            </motion.div>
          )}

          {climaxPhase === 3 && (
            <motion.div 
              key="blackout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center flex flex-col items-center justify-center h-full w-full fixed inset-0 bg-black z-50 p-6"
            >
              <h1 className="text-red-600 text-5xl font-black uppercase tracking-tighter mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                Fim de Jogo
              </h1>
              <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-12">
                Você não construiu um negócio. Você construiu um emprego que não te deixa dormir. A verdadeira liberdade começa quando a empresa roda sem você.
              </p>
              <button 
                onClick={() => onComplete ? onComplete() : window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/'}
                className="px-12 py-5 bg-white hover:bg-[#D4AF37] hover:text-black text-black font-black uppercase tracking-widest text-lg rounded transition-colors"
              >
                Destrancar a Porta
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
