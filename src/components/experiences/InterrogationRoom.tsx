import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterrogationRoom({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState(0); 
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState<boolean | null>(null);

  // Iniciar Câmera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
      } catch (e) {
        setCameraEnabled(false);
      }
    };
    startCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Sintetizador de Batimento Cardíaco (Heartbeat)
  const playHeartbeat = (speedMultiplier = 1) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const playThump = (time: number, freq: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(10, time + duration);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    // Tum-tum
    const now = ctx.currentTime;
    playThump(now, 60, 0.5, 0.8);
    playThump(now + 0.25, 55, 0.6, 0.6);
  };

  // Progressão das Fases e Áudio
  useEffect(() => {
    // Inicia contexto de áudio após primeira interação (necessário para os navegadores)
    const initAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
    };
    window.addEventListener('click', initAudio, { once: true });

    let heartbeatInterval: NodeJS.Timeout;
    
    if (phase >= 1 && phase < 4) {
      // Ritmo do batimento aumenta com as fases
      const delay = phase === 1 ? 2000 : phase === 2 ? 1000 : 500;
      heartbeatInterval = setInterval(() => playHeartbeat(), delay);
    }

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('click', initAudio);
    };
  }, [phase]);

  const advancePhase = () => {
    if (phase < 4) setPhase(p => p + 1);
  };

  return (
    <div 
      className="relative w-full h-full min-h-[700px] bg-black overflow-hidden font-mono cursor-pointer select-none flex items-center justify-center"
      onClick={advancePhase}
    >
      
      {/* CCTV Filter & Video */}
      {phase < 4 && (
        <div className="absolute inset-0 pointer-events-none">
          {cameraEnabled !== false ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover opacity-30 grayscale contrast-150 brightness-50"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10 text-9xl">
              CCTV_OFFLINE
            </div>
          )}
          
          {/* Efeito de Scanlines */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
          
          {/* Overlay REC */}
          <div className="absolute top-8 right-8 flex items-center gap-3">
            <motion.div 
              className="w-4 h-4 bg-red-600 rounded-full"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-red-500 font-bold tracking-widest text-xl">REC</span>
          </div>

          <div className="absolute bottom-8 left-8 text-white/50 text-sm tracking-widest">
            CAM_04_SISTEMA_OPERACIONAL
          </div>
        </div>
      )}

      {/* Textos Interativos */}
      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        <AnimatePresence mode="wait">
          
          {phase === 0 && (
            <motion.div 
              key="p0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <h1 className="text-white/30 text-2xl uppercase tracking-[0.5em] animate-pulse">
                Clique para iniciar o monitoramento
              </h1>
            </motion.div>
          )}

          {phase === 1 && (
            <motion.div 
              key="p1"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            >
              <h2 className="text-white text-3xl md:text-5xl font-light tracking-widest leading-relaxed">
                "Eles já perceberam que você <br/> <strong className="font-black text-red-500">não tem o controle.</strong>"
              </h2>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div 
              key="p2"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            >
              <h2 className="text-white text-3xl md:text-5xl font-light tracking-widest leading-relaxed">
                "Se você desligar o celular agora,<br/>
                <span className="text-white/50">quantos dias a sua empresa sobrevive?</span>"
              </h2>
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div 
              key="p3"
              initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}
            >
              <h2 className="text-red-600 text-4xl md:text-6xl font-black tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]">
                Você é a única cola.
              </h2>
              <p className="mt-6 text-white/50 text-xl">E a cola está secando.</p>
            </motion.div>
          )}

          {phase === 4 && (
            <motion.div 
              key="climax"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-black/90 p-12 border border-red-900/50 rounded-xl shadow-[0_0_50px_rgba(255,0,0,0.2)]"
            >
              <h3 className="text-[#D4AF37] text-3xl font-black uppercase tracking-widest mb-6">Quebre o Espelho</h3>
              <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
                Líderes que centralizam a operação sofrem da pior espécie de Síndrome do Impostor: eles sabem que, no fundo, criaram uma máquina que depende exclusivamente deles para não quebrar.
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); onComplete ? onComplete() : window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/'; }}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-lg rounded transition-colors"
              >
                Construir Sistemas Independentes
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
