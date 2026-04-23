import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Lock, ShieldAlert } from 'lucide-react';

export default function BiometricScanner({ onComplete }: { onComplete: () => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'denied'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScan = () => {
    if (status === 'denied') return;
    setIsScanning(true);
    setStatus('scanning');
    setLogs(["Iniciando protocolo de segurança biometria...", "Aguardando input neural..."]);
    
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current!);
          finishScan();
          return 100;
        }
        
        // Random logs
        if (p === 30) setLogs(l => [...l, "Processando perfil comportamental..."]);
        if (p === 60) setLogs(l => [...l, "Buscando assinaturas de microgerenciamento..."]);
        if (p === 85) setLogs(l => [...l, "Anomalia detectada no núcleo operacional."]);
        
        return p + 2;
      });
    }, 50);
  };

  const stopScan = () => {
    if (status === 'denied') return;
    setIsScanning(false);
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const finishScan = () => {
    setIsScanning(false);
    setStatus('denied');
    setLogs(l => [...l, "ACESSO BLOQUEADO."]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#020503] relative font-mono overflow-hidden">
      
      {/* Matrix/Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Main Scanner UI */}
      <div className="relative z-10 flex flex-col items-center">
        
        <div className="mb-12 text-center">
          <Lock className="mx-auto mb-4 text-green-500/50" size={32} />
          <h2 className="text-2xl font-light tracking-[0.2em] text-green-500/80 uppercase">Acesso Restrito</h2>
          <p className="text-green-500/40 text-sm mt-2">Mantenha pressionado para autorizar sistema</p>
        </div>

        <div className="relative w-64 h-80 flex items-center justify-center">
          {/* Scanner Base */}
          <div className={`absolute inset-0 border-2 rounded-[40px] transition-colors duration-500 ${status === 'denied' ? 'border-red-500/50 shadow-[0_0_50px_rgba(255,0,0,0.2)]' : 'border-green-500/20'} flex items-center justify-center overflow-hidden`}>
            
            {/* The Fingerprint */}
            <Fingerprint size={120} strokeWidth={1} className={`transition-colors duration-500 ${status === 'denied' ? 'text-red-500' : isScanning ? 'text-green-400' : 'text-green-500/20'}`} />

            {/* The Scanning Laser */}
            {isScanning && (
              <motion.div 
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] z-20"
              />
            )}

            {/* Fill up background based on progress */}
            {status !== 'denied' && (
              <div className="absolute bottom-0 left-0 w-full bg-green-500/10 transition-all duration-75" style={{ height: `${progress}%` }} />
            )}
          </div>

          {/* Interaction Overlay */}
          <div 
            className="absolute inset-0 z-30 cursor-pointer"
            onMouseDown={startScan}
            onMouseUp={stopScan}
            onMouseLeave={stopScan}
            onTouchStart={startScan}
            onTouchEnd={stopScan}
          />
        </div>

        <div className="mt-12 h-10 flex items-center justify-center">
          {isScanning && <div className="text-green-400 tracking-widest text-lg animate-pulse">AUTENTICANDO... {progress}%</div>}
        </div>
      </div>

      {/* Terminal Logs (Left side) */}
      <div className="absolute top-20 left-10 w-80 text-xs text-green-500/60 flex flex-col gap-1 pointer-events-none hidden lg:flex">
        {logs.map((log, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <span className="opacity-50">[{new Date().toISOString().split('T')[1].substring(0,8)}]</span> {log}
          </motion.div>
        ))}
      </div>

      {/* Denied Overlay */}
      <AnimatePresence>
        {status === 'denied' && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-red-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8"
          >
            <ShieldAlert size={80} className="text-red-500 mb-8 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-widest mb-4 text-center">FALHA CRÍTICA</h1>
            <p className="text-xl text-red-200/80 max-w-2xl text-center leading-relaxed mb-12">
              O sistema exige autonomia para funcionar.<br/>
              Detectamos que 100% da operação exige o seu DNA.<br/>
              <span className="text-white mt-4 block font-sans">Isso não é uma empresa. É uma prisão.</span>
            </p>
            
            <button 
              onClick={onComplete}
              className="bg-white text-black font-sans px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
            >
              Destravar Operação →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
