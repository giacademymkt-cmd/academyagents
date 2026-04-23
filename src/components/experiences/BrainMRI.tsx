import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lucide Icons
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/>
  </svg>
);

const ShieldAlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C85A2A]">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    <path d="M12 8v4"/>
    <path d="M12 16h.01"/>
  </svg>
);

const MOCK_TUMORS = [
  { id: 1, x: 30, y: 35, title: "Córtex Centralizador", desc: "Você precisa aprovar até a compra do pó de café." },
  { id: 2, x: 70, y: 45, title: "Lobo do Micro-Gerenciamento", desc: "Refaz o trabalho da equipe porque 'ninguém faz direito'." },
  { id: 3, x: 45, y: 70, title: "Amígdala do Apagador de Incêndios", desc: "Reage a urgências diárias. Sem tempo para estratégia." },
];

export default function BrainMRI() {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'results'>('idle');
  const [foundTumors, setFoundTumors] = useState<number[]>([]);
  const [hoveredTumor, setHoveredTumor] = useState<number | null>(null);

  const startScan = () => {
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('results');
    }, 4000); // 4 seconds of scanning
  };

  const discoverTumor = (id: number) => {
    if (!foundTumors.includes(id)) {
      setFoundTumors(prev => [...prev, id]);
    }
  };

  const isAllFound = foundTumors.length === MOCK_TUMORS.length;

  return (
    <div className="relative w-full h-full min-h-[700px] flex items-center justify-center bg-[#050505] overflow-hidden font-sans text-white select-none">
      
      {/* Background Tech Grid */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Interface HUD Médica */}
      <div className="relative z-10 w-full max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Painel Esquerdo: Controle e Status */}
        <div className="flex flex-col gap-6 justify-center">
          <div className="border-l-4 border-[#D4AF37] pl-4">
            <h3 className="text-[#D4AF37] text-xs font-black tracking-[0.3em] uppercase mb-1">Mapeamento</h3>
            <h2 className="text-3xl font-bold uppercase">Carga Cognitiva</h2>
          </div>

          <div className="bg-[#111] border border-[#333] p-4 rounded-lg font-mono text-xs">
            <div className="flex justify-between mb-2 pb-2 border-b border-[#333]">
              <span className="text-white/50">PACIENTE:</span>
              <span className="text-[#D4AF37]">CEO / FUNDADOR</span>
            </div>
            <div className="flex justify-between mb-2 pb-2 border-b border-[#333]">
              <span className="text-white/50">SINTOMA:</span>
              <span className="text-[#C85A2A]">ESTAGNAÇÃO</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">STATUS:</span>
              <span className={scanStatus === 'idle' ? 'text-white' : scanStatus === 'scanning' ? 'text-blue-400 animate-pulse' : 'text-red-500 font-bold'}>
                {scanStatus === 'idle' ? 'AGUARDANDO SCAN' : scanStatus === 'scanning' ? 'ANALISANDO...' : 'ANOMALIAS DETECTADAS'}
              </span>
            </div>
          </div>

          {scanStatus === 'idle' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startScan}
              className="bg-transparent border border-[#D4AF37] text-[#D4AF37] py-4 rounded hover:bg-[#D4AF37] hover:text-black transition-colors font-bold tracking-widest uppercase flex justify-center items-center gap-2"
            >
              <ActivityIcon /> Iniciar Varredura
            </motion.button>
          )}

          <AnimatePresence>
            {scanStatus === 'results' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#220000] border border-[#C85A2A] p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlertIcon />
                  <h4 className="text-[#C85A2A] font-bold uppercase tracking-wider">Atenção Crítica</h4>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Encontre os 3 gargalos operacionais no cérebro do Fundador para gerar o diagnóstico.
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3].map(num => (
                    <div 
                      key={num} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${foundTumors.length >= num ? 'bg-[#C85A2A] text-white' : 'bg-[#111] border border-[#333] text-[#555]'}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Centro: O Scanner (Cérebro) */}
        <div className="md:col-span-2 relative flex items-center justify-center h-[500px] border border-[#222] bg-[#0A0A0A] rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          
          {/* Silhueta do Cérebro (Placeholder/SVG) */}
          <div className="relative w-64 h-80 opacity-60">
            <svg viewBox="0 0 200 250" className="w-full h-full drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <path 
                d="M100 10 C 150 10, 190 50, 180 120 C 170 190, 140 220, 100 240 C 60 220, 30 190, 20 120 C 10 50, 50 10, 100 10 Z" 
                fill="none" 
                stroke="#D4AF37" 
                strokeWidth="2" 
                strokeDasharray="5,5" 
              />
              <path 
                d="M100 25 C 130 25, 160 55, 150 115 C 140 170, 120 200, 100 215 C 80 200, 60 170, 50 115 C 40 55, 70 25, 100 25 Z" 
                fill="none" 
                stroke="#333" 
                strokeWidth="1" 
              />
            </svg>

            {/* Scanning Laser Line */}
            <AnimatePresence>
              {scanStatus === 'scanning' && (
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-[#D4AF37] shadow-[0_0_20px_#D4AF37] z-20"
                />
              )}
            </AnimatePresence>

            {/* Tumores (Hotspots) */}
            {scanStatus === 'results' && MOCK_TUMORS.map(tumor => (
              <motion.div
                key={tumor.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
                className="absolute z-30 cursor-crosshair group"
                style={{ left: `${tumor.x}%`, top: `${tumor.y}%` }}
                onMouseEnter={() => {
                  discoverTumor(tumor.id);
                  setHoveredTumor(tumor.id);
                }}
                onMouseLeave={() => setHoveredTumor(null)}
              >
                {/* O Ponto Quente */}
                <div className="relative w-6 h-6 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 rounded-full bg-[#C85A2A] animate-ping opacity-70" />
                  <div className="absolute inset-1 rounded-full bg-red-600 border border-white" />
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredTumor === tumor.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-[#111] border border-[#333] p-3 rounded shadow-2xl z-50 pointer-events-none"
                    >
                      <h5 className="text-[#C85A2A] font-bold text-xs uppercase mb-1">{tumor.title}</h5>
                      <p className="text-white/70 text-[10px] leading-tight">{tumor.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Overlay de Diagnóstico Final */}
          <AnimatePresence>
            {isAllFound && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="border border-[#C85A2A] p-6 max-w-sm bg-[#111]/90 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#C85A2A]" />
                  <h2 className="text-[#C85A2A] text-2xl font-black uppercase tracking-widest mb-4">Laudo Final</h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    A empresa está refém do cérebro do fundador. Escala operacional bloqueada por excesso de centralização.
                  </p>
                  
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/';
                    }}
                    className="inline-block w-full py-3 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold text-xs tracking-widest uppercase transition-colors"
                  >
                    Ver Tratamento (Masterclass)
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
