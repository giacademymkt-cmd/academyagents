import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ícones SVG minimalistas (Lucide Style)
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C85A2A]">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="M12 17h.01"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const MOCK_MESSAGES = [
  "O cliente tá ameaçando cancelar!",
  "A arte saiu com erro de digitação de novo.",
  "Estoque da promoção acabou, e agora?",
  "O site caiu no meio do lançamento!",
  "Fornecedor não entregou a embalagem.",
  "Colaborador chave pediu demissão hoje.",
  "Bloquearam a conta de anúncios!!!",
  "O fluxo de caixa fechou negativo.",
  "Esqueceram de mandar o boleto, cliente irritado.",
  "A campanha subiu sem link."
];

interface Notification {
  id: string;
  text: string;
  xOffset: number;
  rotation: number;
  delay: number;
}

export default function FounderAvalanche() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [clicks, setClicks] = useState(0);
  const [isBroken, setIsBroken] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Áudio opcional (apenas vibratório no mobile se possível)
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleAction = () => {
    if (isBroken) return;
    
    triggerHaptic();
    setClicks(c => c + 1);

    // Dificuldade Exponencial: A cada clique, multiplicamos os problemas
    const multiplier = Math.min(clicks + 1, 5); // Gera até 5 de uma vez no final
    
    const newNotifs: Notification[] = Array.from({ length: multiplier }).map((_, i) => ({
      id: Math.random().toString(),
      text: MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)],
      xOffset: (Math.random() - 0.5) * 60, // Desvio lateral em pixels
      rotation: (Math.random() - 0.5) * 15, // Rotação leve para parecer caótico
      delay: i * 0.1 // Caem em cascata curta
    }));

    setNotifications(prev => [...prev, ...newNotifs]);

    // O sistema entra em colapso após 5 tentativas (acelerado)
    if (clicks >= 4) {
      setTimeout(() => {
        setIsBroken(true);
        if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]); // Vibração de "quebra"
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex items-center justify-center bg-[#0A0A0A] overflow-hidden font-sans">
      
      {/* Background Cinematográfico */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#111] to-[#0A0A0A] z-10" />
        {/* Usamos a Imagem Gerada (usaremos um placeholder dark/gradient até embedarmos a gerada) */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop)' }}
        />
        {/* Spotlight dourado suave no centro */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37] opacity-[0.03] blur-[120px] rounded-full" />
      </div>

      {/* Dispositivo (Celular do Fundador) */}
      <motion.div 
        className="relative z-10 w-[340px] h-[680px] bg-[#161616] rounded-[45px] border border-[#333] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(212,175,55,0.05)] overflow-hidden flex flex-col"
        animate={isBroken ? { 
          scale: 0.95,
          rotate: [0, -2, 2, -2, 0],
          boxShadow: '0 0 100px rgba(200, 90, 42, 0.2)' 
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* "Notch" do Celular */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
          <div className="w-[120px] h-[25px] bg-[#0A0A0A] rounded-b-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Interface Interna do App */}
        <div className="flex-1 pt-12 pb-6 px-4 flex flex-col relative" ref={containerRef}>
          
          <div className="text-center mb-6">
            <h3 className="text-[#E0E0E0] text-sm font-semibold tracking-wider uppercase opacity-50">Operação</h3>
            <p className="text-white text-xl font-bold tracking-tight">Painel de Controle</p>
          </div>

          {/* Área Principal de Ação - A Ilusão do Controle */}
          <div className="flex-1 flex flex-col items-center justify-center">
            
            <motion.button
              onClick={handleAction}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 h-32 rounded-full border-2 border-[#D4AF37] bg-gradient-to-b from-[#1c1c1c] to-[#0A0A0A] flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.15)] z-20 group relative overflow-hidden"
            >
              {/* Efeito Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <CheckIcon />
              <span className="text-[#D4AF37] font-bold text-sm tracking-widest uppercase">Aprovar</span>
            </motion.button>
            <p className="text-[#B0B0B0] text-xs mt-6 text-center max-w-[200px]">
              {clicks === 0 ? "Você precisa aprovar a demanda para a equipe seguir." : "Resolva rápido, mais demandas estão chegando."}
            </p>
          </div>

          {/* Física das Notificações Caindo */}
          <div className="absolute inset-x-4 top-12 bottom-20 pointer-events-none flex flex-col justify-end">
            <AnimatePresence>
              {notifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: -400, scale: 0.8, rotate: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, // Cai até a base
                    scale: 1,
                    rotate: notif.rotation,
                    x: notif.xOffset
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 150, 
                    damping: 12,
                    mass: 1.2,
                    delay: notif.delay 
                  }}
                  className="mb-[-20px] bg-[#222]/90 backdrop-blur-md border border-[#C85A2A]/40 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start gap-3 w-full pointer-events-none"
                  style={{ zIndex: 10 + index }}
                >
                  <div className="mt-0.5"><AlertIcon /></div>
                  <div>
                    <h4 className="text-[#E0E0E0] text-xs font-bold uppercase tracking-wider mb-0.5">Urgente</h4>
                    <p className="text-white/80 text-sm leading-tight">{notif.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* O Clímax: Tela Quebrada (Glassmorphism) */}
          <AnimatePresence>
            {isBroken && (
              <motion.div 
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
                className="absolute inset-0 z-50 bg-[#0A0A0A]/80 flex flex-col items-center justify-center p-6 text-center border border-[#333] rounded-[45px]"
              >
                {/* Efeito Visual de Vidro Quebrado usando CSS clips (simplificado aqui com linhas diagonais) */}
                <div className="absolute inset-0 overflow-hidden rounded-[45px] opacity-30 pointer-events-none">
                  <div className="absolute top-[-10%] left-[20%] w-[1px] h-[120%] bg-white rotate-[15deg]" />
                  <div className="absolute top-[-10%] left-[60%] w-[1px] h-[120%] bg-white rotate-[-35deg]" />
                  <div className="absolute top-[40%] left-[-10%] w-[120%] h-[1px] bg-white rotate-[10deg]" />
                </div>

                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#C85A2A] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(200,90,42,0.3)]">
                    <AlertIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4 leading-tight">Colapso<br/>Operacional</h2>
                  <p className="text-[#B0B0B0] text-sm mb-8 leading-relaxed">
                    Sua empresa não pode depender da agilidade do seu polegar. Se você é o único gargalo, o sistema sempre vai quebrar.
                  </p>

                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      // Redirect to the parent window URL if embedded, or a default URL
                      window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/';
                    }}
                    className="inline-block w-full py-4 rounded bg-[#D4AF37] hover:bg-[#b5952f] text-[#0A0A0A] font-bold text-sm tracking-widest uppercase transition-colors pointer-events-auto cursor-pointer"
                  >
                    Ativar Piloto Automático
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

      {/* Copy Support para o Clímax */}
      <AnimatePresence>
        {isBroken && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-8 bottom-8 max-w-sm hidden md:block"
          >
            <div className="bg-[#111] border-l-4 border-[#D4AF37] p-5 shadow-2xl">
              <h4 className="text-white font-bold mb-2">Diagnóstico Preciso</h4>
              <p className="text-[#B0B0B0] text-sm">
                A síndrome do "apagador de incêndios" é o maior bloqueio de escala no Brasil. Nós ensinamos a construir esteiras de delegação.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}</style>
    </div>
  );
}
