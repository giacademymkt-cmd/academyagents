import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, DollarSign, X } from 'lucide-react';

export default function EscapeRoom({ onComplete }: { onComplete?: () => void }) {
  const [messages, setMessages] = useState(1);
  const [emails, setEmails] = useState(3);
  const [bills, setBills] = useState(2);
  const [timeAlive, setTimeAlive] = useState(0);
  const [isBroken, setIsBroken] = useState(false);

  // O caos aumenta progressivamente
  useEffect(() => {
    if (isBroken) return;
    const timer = setInterval(() => {
      setTimeAlive(prev => prev + 1);
      
      // O sistema naturalmente acumula pendências
      if (Math.random() > 0.5) setMessages(m => m + 1);
      if (Math.random() > 0.7) setEmails(e => e + 1);
      if (Math.random() > 0.8) setBills(b => b + 1);
      
    }, 1500); // Acumula rápido

    // Se o total de notificações passar de 30, o cérebro "quebra" (burnout)
    if (messages + emails + bills > 25) {
      setIsBroken(true);
    }

    return () => clearInterval(timer);
  }, [isBroken, messages, emails, bills]);

  // Tentar resolver problemas multiplica os outros (trabalho manual não escala)
  const handleSolveMessage = () => {
    if (isBroken) return;
    if (navigator.vibrate) navigator.vibrate(20);
    setMessages(m => Math.max(0, m - 1));
    setEmails(e => e + 2); // Custa tempo que atrasa o email
  };

  const handleSolveEmail = () => {
    if (isBroken) return;
    if (navigator.vibrate) navigator.vibrate(20);
    setEmails(e => Math.max(0, e - 1));
    setBills(b => b + 1);
    setMessages(m => m + 1);
  };

  const handleSolveBill = () => {
    if (isBroken) return;
    if (navigator.vibrate) navigator.vibrate(20);
    setBills(b => Math.max(0, b - 1));
    setMessages(m => m + 2);
  };

  return (
    <div className="relative w-full h-full min-h-[700px] bg-[url('https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=2000')] bg-cover bg-center overflow-hidden font-sans select-none">
      
      {/* Overlay escuro no wallpaper */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {!isBroken ? (
        <>
          <div className="absolute top-8 w-full text-center z-10 pointer-events-none">
            <h2 className="text-white text-xl font-bold drop-shadow-md">Apague os Incêndios</h2>
            <p className="text-white/80 text-sm">Zere as notificações para recuperar o controle. Tempo: {timeAlive}s</p>
          </div>

          {/* Desktop Icons */}
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-12 p-8">
            
            {/* WhatsApp */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSolveMessage}
              className="relative flex flex-col items-center gap-3"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-green-400 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <MessageCircle size={48} color="white" />
              </div>
              <span className="text-white font-medium drop-shadow-md">Suporte / Equipe</span>
              {messages > 0 && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} key={messages}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white font-bold text-lg rounded-full flex items-center justify-center shadow-lg border-2 border-[#111]"
                >
                  {messages}
                </motion.div>
              )}
            </motion.button>

            {/* Email */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSolveEmail}
              className="relative flex flex-col items-center gap-3"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Mail size={48} color="white" />
              </div>
              <span className="text-white font-medium drop-shadow-md">E-mails Urgentes</span>
              {emails > 0 && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} key={emails}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white font-bold text-lg rounded-full flex items-center justify-center shadow-lg border-2 border-[#111]"
                >
                  {emails}
                </motion.div>
              )}
            </motion.button>

            {/* Finance */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSolveBill}
              className="relative flex flex-col items-center gap-3"
            >
              <div className="w-24 h-24 bg-gradient-to-tr from-yellow-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <DollarSign size={48} color="white" />
              </div>
              <span className="text-white font-medium drop-shadow-md">Aprovações Caixa</span>
              {bills > 0 && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} key={bills}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white font-bold text-lg rounded-full flex items-center justify-center shadow-lg border-2 border-[#111]"
                >
                  {bills}
                </motion.div>
              )}
            </motion.button>

          </div>
        </>
      ) : (
        /* Climax Burnout */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <X size={40} className="text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Sistema em Burnout
          </h1>
          <p className="text-lg text-white/70 max-w-xl leading-relaxed mb-8">
            Trabalhar mais rápido não resolve um gargalo arquitetural. Cada incêndio que você apaga com as próprias mãos atrasa duas outras áreas. O problema não é a sua velocidade, é a ausência de sistemas independentes.
          </p>
          <button 
            onClick={() => onComplete ? onComplete() : window.parent.location.href = 'https://www.imersaogestaodeimpacto.com.br/'}
            className="w-full md:w-auto px-12 py-5 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-black uppercase tracking-widest text-lg rounded transition-transform hover:scale-105"
          >
            Sair da Roda do Rato
          </button>
        </motion.div>
      )}

    </div>
  );
}
