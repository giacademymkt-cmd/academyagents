import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Users, DollarSign, Activity } from 'lucide-react';

export default function SaaSChaosDashboard({ onComplete }: { onComplete: () => void }) {
  const [absenceDays, setAbsenceDays] = useState(0);
  const [profit, setProfit] = useState(142000);
  const [alerts, setAlerts] = useState<string[]>([]);
  
  useEffect(() => {
    if (absenceDays > 0) {
      setProfit(142000 - (absenceDays * 8500));
    } else {
      setProfit(142000);
    }
    
    const newAlerts = [];
    if (absenceDays >= 3) newAlerts.push("Faturamento estagnado. Vendedor precisava de aprovação de desconto.");
    if (absenceDays >= 7) newAlerts.push("2 Clientes cancelaram. Ninguém atendeu os chamados de suporte.");
    if (absenceDays >= 12) newAlerts.push("Fluxo de caixa no vermelho. Contas não foram pagas.");
    if (absenceDays >= 15) newAlerts.push("COLAPSO TOTAL. A EMPRESA PAROU.");
    
    setAlerts(newAlerts);
  }, [absenceDays]);

  const isCritical = absenceDays >= 10;
  const isDead = absenceDays === 15;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      
      {/* Background glowing effects */}
      <div className={`absolute top-0 left-0 w-full h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none transition-colors duration-1000 ${isCritical ? 'bg-red-600' : 'bg-[#ee7533]'}`} />

      {/* Main SaaS Interface */}
      <motion.div 
        animate={{ filter: isDead ? 'blur(4px) grayscale(100%)' : 'blur(0px) grayscale(0%)', scale: isDead ? 0.98 : 1 }}
        className={`w-full max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-2xl border ${isCritical ? 'border-red-500/30' : 'border-white/10'} rounded-2xl shadow-2xl p-8 relative z-10 transition-all duration-500`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCritical ? 'bg-red-500/20 text-red-500' : 'bg-[#ee7533]/20 text-[#ee7533]'}`}>
              <Activity size={18} />
            </div>
            <h2 className="text-xl font-medium text-white/90">GI_Metrics Analytics</h2>
          </div>
          <div className="text-sm font-medium text-white/40">Status do Sistema: <span className={isCritical ? 'text-red-500' : 'text-green-500'}>{isCritical ? 'CRÍTICO' : 'ESTÁVEL'}</span></div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className={`bg-white/5 border ${isCritical ? 'border-red-500/20' : 'border-white/5'} rounded-xl p-6 transition-all duration-300`}>
            <div className="flex justify-between items-start mb-4">
              <div className="text-white/50 text-sm">Receita Prevista</div>
              {profit < 100000 ? <TrendingDown size={16} className="text-red-500" /> : <TrendingUp size={16} className="text-green-500" />}
            </div>
            <div className={`text-3xl font-bold font-mono tracking-tight ${profit < 100000 ? 'text-red-500' : 'text-white'}`}>
              R$ {profit.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-white/50 text-sm">Satisfação (NPS)</div>
              <Users size={16} className="text-white/50" />
            </div>
            <div className={`text-3xl font-bold tracking-tight ${absenceDays > 5 ? 'text-red-500' : 'text-white'}`}>
              {Math.max(12, 98 - (absenceDays * 6))}%
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-white/50 text-sm">Tickets Pendentes</div>
              <AlertTriangle size={16} className="text-white/50" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-white">
              {Math.floor(2 + (absenceDays * 4.5))}
            </div>
          </div>
        </div>

        {/* The Chart Area */}
        <div className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-xl relative overflow-hidden flex items-end">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <motion.path 
              d={`M0 100 L0 ${50 + (absenceDays * 2)} L20 ${40 + (absenceDays * 3)} L40 ${60 + (absenceDays * 2.5)} L60 ${30 + (absenceDays * 3)} L80 ${50 + (absenceDays * 4)} L100 ${20 + (absenceDays * 5)} L100 100 Z`}
              fill={isCritical ? 'rgba(239, 68, 68, 0.1)' : 'rgba(238, 117, 51, 0.1)'}
              transition={{ type: 'spring', bounce: 0 }}
            />
            <motion.path 
              d={`M0 ${50 + (absenceDays * 2)} L20 ${40 + (absenceDays * 3)} L40 ${60 + (absenceDays * 2.5)} L60 ${30 + (absenceDays * 3)} L80 ${50 + (absenceDays * 4)} L100 ${20 + (absenceDays * 5)}`}
              fill="none"
              stroke={isCritical ? '#ef4444' : '#ee7533'}
              strokeWidth="2"
              transition={{ type: 'spring', bounce: 0 }}
            />
          </svg>
        </div>

      </motion.div>

      {/* Control Area - Overlaid */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20 flex flex-col items-center">
        
        {/* Warning Logs */}
        <div className="w-full h-32 mb-8 flex flex-col justify-end gap-2 pointer-events-none">
          {alerts.map((alert, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 backdrop-blur-md"
            >
              <AlertTriangle size={16} /> {alert}
            </motion.div>
          ))}
        </div>

        <div className="bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl w-full backdrop-blur-xl">
          <h3 className="text-center text-xl font-light mb-6">Arraste para testar: <span className="font-medium">Dias ausente da empresa</span></h3>
          <input 
            type="range" 
            min="0" 
            max="15" 
            value={absenceDays} 
            onChange={(e) => setAbsenceDays(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ee7533]"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-3 uppercase tracking-wider font-bold">
            <span>0 Dias</span>
            <span>7 Dias</span>
            <span>15 Dias (Colapso)</span>
          </div>
        </div>

        {isDead && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            className="mt-8 bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
          >
            Sair do Operacional →
          </motion.button>
        )}
      </div>

    </div>
  );
}
