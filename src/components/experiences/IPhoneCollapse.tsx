import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X, AlertCircle } from 'lucide-react';

const MESSAGES = [
  { from: 'Fornecedor', text: 'Chefe, o pagamento não caiu.', type: 'wpp' },
  { from: 'RH (Carla)', text: 'Duas pessoas pediram demissão.', type: 'wpp' },
  { from: 'Cliente VIP', text: 'Liguei pra vocês e ninguém atende!', type: 'wpp' },
  { from: 'Gerente', text: 'O sistema travou. O que eu faço?', type: 'wpp' },
  { from: 'Financeiro', text: 'Faltou R$ 5k pra fechar a folha hoje.', type: 'wpp' },
  { from: 'Esposa', text: 'Você vem jantar em casa hoje? 😔', type: 'wpp' },
  { from: 'ALERTA DO BANCO', text: 'Saldo insuficiente para transação.', type: 'sys' },
  { from: 'Atendimento', text: 'Mais um cliente cancelou o contrato.', type: 'wpp' }
];

export default function IPhoneCollapse({ onComplete }: { onComplete: () => void }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [started, setStarted] = useState(false);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    if (!started) return;

    let count = 0;
    const interval = setInterval(() => {
      if (count >= MESSAGES.length * 2) {
        clearInterval(interval);
        setTimeout(() => setCrashed(true), 1000);
        return;
      }
      
      const msg = MESSAGES[count % MESSAGES.length];
      setNotifications(prev => [...prev, { ...msg, id: Date.now() + Math.random() }]);
      count++;
    }, 600); // Super fast raining of notifications

    return () => clearInterval(interval);
  }, [started]);

  const [time, setTime] = useState('');
  useEffect(() => {
    const d = new Date();
    setTime(`${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#030303] relative overflow-hidden">
      
      <div className="text-center mb-8 max-w-lg z-20">
        <h2 className="text-3xl font-light mb-2">Seu celular, sua prisão.</h2>
        <p className="text-neutral-500">Clique na tela para destravar o celular.</p>
      </div>

      {/* iPhone Frame */}
      <div 
        className={`relative w-[320px] h-[650px] bg-neutral-900 rounded-[50px] border-[8px] border-neutral-800 shadow-2xl overflow-hidden transition-transform duration-100 cursor-pointer ${crashed ? 'scale-105' : ''}`}
        onClick={() => !started && setStarted(true)}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-neutral-800 rounded-b-2xl z-50"></div>

        {/* Wallpaper */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black z-0" />

        {/* Lock Screen UI */}
        <div className="relative z-10 flex flex-col h-full pt-16 px-4">
          
          <div className="text-center mb-8">
            <div className="text-6xl font-light tracking-tighter text-white/90">{time}</div>
            <div className="text-sm font-medium text-white/50 mt-1">Terça-feira, 23 de Abril</div>
          </div>

          {/* Notifications Stack */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence>
              {notifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl mb-2 flex items-start gap-3 shadow-lg"
                  style={{ zIndex: 100 - index }}
                >
                  <div className={`p-2 rounded-lg ${notif.type === 'wpp' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notif.type === 'wpp' ? <MessageCircle size={16} fill="white" /> : <AlertCircle size={16} fill="white" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/90">{notif.from}</div>
                    <div className="text-xs text-white/70 mt-1 leading-tight">{notif.text}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Bottom Bar */}
          <div className="h-20 flex items-end justify-center pb-4">
            <div className="w-1/3 h-1 bg-white/50 rounded-full" />
          </div>
        </div>

        {/* Glitch Overlay on Crash */}
        {crashed && (
          <div className="absolute inset-0 z-50 bg-white mix-blend-difference animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Crash Modal */}
      <AnimatePresence>
        {crashed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-center"
          >
            <AlertCircle size={64} className="text-red-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-white">COLAPSO OPERACIONAL</h1>
            <p className="text-xl text-neutral-400 max-w-lg mb-10 leading-relaxed">
              O seu celular não deveria ser o gargalo da sua empresa.<br/><br/>
              <strong className="text-white">Quando tudo depende de você, a empresa para quando você tenta viver.</strong>
            </p>
            <button 
              onClick={onComplete}
              className="bg-[#ee7533] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-lg shadow-[#ee7533]/30"
            >
              Delegar Operacional →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
