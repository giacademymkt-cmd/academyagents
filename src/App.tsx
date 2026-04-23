import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Code, Check, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SaaSChaosDashboard from './components/experiences/SaaSChaosDashboard';
import BiometricScanner from './components/experiences/BiometricScanner';
import IPhoneCollapse from './components/experiences/IPhoneCollapse';
import RadarSonar from './components/experiences/RadarSonar';
import ParticleHourglass from './components/experiences/ParticleHourglass';
import FounderAvalanche from './components/experiences/FounderAvalanche';
import BlindChess from './components/experiences/BlindChess';
import BrainMRI from './components/experiences/BrainMRI';
import InvisibleWeb from './components/experiences/InvisibleWeb';
import BleedingClock from './components/experiences/BleedingClock';
import PayrollAbyss from './components/experiences/PayrollAbyss';
import SurvivalTest from './components/experiences/SurvivalTest';
import EscapeRoom from './components/experiences/EscapeRoom';
import BleedingCalculator from './components/experiences/BleedingCalculator';

// Agrupamos e refinamos as categorias
const EXPERIENCES = [
  { id: 'avalanche', title: 'A Avalanche do Fundador', category: 'O Peso da Liderança', subtitle: 'A síndrome do apagador de incêndios', duration: 'Interativo', tag: 'Top 1', bg: 'from-red-900/40', thumb: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80', component: FounderAvalanche },
  { id: 'survival', title: 'O Teste de Sobrevivência', category: 'O Peso da Liderança', subtitle: '60s para evitar a falência. Faça suas escolhas.', duration: 'Interativo', tag: 'Novo', bg: 'from-red-900/40', thumb: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80', component: SurvivalTest },
  { id: 'escaperoom', title: 'Escape Room Operacional', category: 'O Peso da Liderança', subtitle: 'O caos de um desktop abandonado', duration: 'Interativo', tag: 'Trending', bg: 'from-blue-900/40', thumb: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=2000', component: EscapeRoom },
  { id: 'iphone', title: 'Celular do Colapso', category: 'O Peso da Liderança', subtitle: 'Uma chuva violenta de notificações', duration: '30 seg', tag: '', bg: 'from-blue-900/40', thumb: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', component: IPhoneCollapse },
  
  { id: 'calculator', title: 'A Calculadora de Sangramento', category: 'Caixa & Finanças', subtitle: 'Raio-X financeiro da sua dependência', duration: 'Interativo', tag: 'Top 1', bg: 'from-yellow-900/40', thumb: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80', component: BleedingCalculator },
  { id: 'abyss', title: 'O Abismo da Folha', category: 'Caixa & Finanças', subtitle: 'O ralo de luxo mensal', duration: 'Interativo', tag: 'Novo', bg: 'from-zinc-900/40', thumb: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80', component: PayrollAbyss },
  { id: 'saas', title: 'O Dashboard do Caos', category: 'Caixa & Finanças', subtitle: 'Simulador de colapso de receita', duration: '1 min', tag: '', bg: 'from-orange-900/40', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', component: SaaSChaosDashboard },
  
  { id: 'mri', title: 'A Ressonância Magnética', category: 'Diagnóstico Sistêmico', subtitle: 'Mapeando os tumores operacionais', duration: 'Interativo', tag: '', bg: 'from-blue-900/40', thumb: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80', component: BrainMRI },
  { id: 'web', title: 'A Teia Invisível', category: 'Diagnóstico Sistêmico', subtitle: 'Ponto único de falha', duration: 'Interativo', tag: '', bg: 'from-purple-900/40', thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', component: InvisibleWeb },
  { id: 'biometric', title: 'Acesso Negado', category: 'Diagnóstico Sistêmico', subtitle: 'Scanner biométrico exigindo autonomia', duration: '45 seg', tag: '', bg: 'from-green-900/40', thumb: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80', component: BiometricScanner },

  { id: 'chess', title: 'O Xadrez Cego', category: 'Estratégia e Delegação', subtitle: 'Por que o Rei não pode ser Peão', duration: 'Interativo', tag: '', bg: 'from-amber-900/40', thumb: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=800&q=80', component: BlindChess },
  { id: 'radar', title: 'Radar Operacional', category: 'Estratégia e Delegação', subtitle: 'Sonar militar de gargalos ativos', duration: '20 seg', tag: '', bg: 'from-emerald-900/40', thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', component: RadarSonar },

  { id: 'clock', title: 'O Relógio de Sangue', category: 'Gestão do Tempo', subtitle: 'O preço de parar a operação', duration: 'Interativo', tag: '', bg: 'from-red-900/40', thumb: 'https://images.unsplash.com/photo-1584281720815-4eeccb8e663a?w=800&q=80', component: BleedingClock },
  { id: 'hourglass', title: 'A Engrenagem de Ouro', category: 'Gestão do Tempo', subtitle: 'Onde seu lucro vira areia', duration: 'Interativo', tag: '', bg: 'from-yellow-900/40', thumb: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80', component: ParticleHourglass },
];

function CopyModal({ expId, expTitle, onClose }: { expId: string, expTitle: string, onClose: () => void }) {
  const [copiedSection, setCopiedSection] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);

  const copyCode = (type: 'section' | 'full') => {
    const height = type === 'full' ? '100vh' : '700px';
    const code = `<iframe src="https://premium-gallery.vercel.app/?exp=${expId}&mode=embed" style="width: 100%; height: ${height}; border: none;"></iframe>`;
    navigator.clipboard.writeText(code);
    
    if(type === 'full') {
      setCopiedFull(true); setTimeout(() => setCopiedFull(false), 2000);
    } else {
      setCopiedSection(true); setTimeout(() => setCopiedSection(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#111] border border-[#333] shadow-2xl rounded-2xl p-8 max-w-lg w-full relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition bg-black p-2 rounded-full">
          <X size={20} />
        </button>
        <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">Embutir no Site</h3>
        <p className="text-white/60 mb-8 text-sm">Copie o código para injetar a experiência <strong className="text-[#D4AF37]">"{expTitle}"</strong> na sua página via HTML/Elementor.</p>
        
        <div className="space-y-4">
          <div className="bg-[#0A0A0A] border border-[#222] p-5 rounded-xl flex items-center justify-between hover:border-[#444] transition-colors">
            <div>
              <div className="font-bold text-white mb-1">Meio de Página (Seção)</div>
              <div className="text-xs text-white/40">Altura fixa de 700px.</div>
            </div>
            <button 
              onClick={() => copyCode('section')}
              className="bg-[#222] hover:bg-[#333] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition"
            >
              {copiedSection ? <Check size={18} className="text-green-500"/> : <Code size={18}/>}
              {copiedSection ? 'Copiado!' : 'Copiar'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#0A0A0A] border border-[#D4AF37]/30 p-5 rounded-xl flex items-center justify-between hover:border-[#D4AF37]/60 transition-colors">
            <div>
              <div className="font-bold text-white mb-1">Tela Cheia (Imersão)</div>
              <div className="text-xs text-white/40">Altura de 100vh. Rouba a atenção.</div>
            </div>
            <button 
              onClick={() => copyCode('full')}
              className="bg-[#D4AF37] hover:bg-[#b5952f] text-black px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition"
            >
              {copiedFull ? <Check size={18} /> : <Code size={18}/>}
              {copiedFull ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function App() {
  const [activeExp, setActiveExp] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isEmbed, setIsEmbed] = useState<boolean>(false);
  const [copyExp, setCopyExp] = useState<typeof EXPERIENCES[0] | null>(null);
  
  // Hero Carousel State
  const CAROUSEL_ITEMS = EXPERIENCES.filter(e => e.tag === 'Top 1' || e.tag === 'Novo' || e.tag === 'Trending').slice(0, 5);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // URL routing for Iframe direct injection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if(params.has('exp')) {
      setActiveExp(params.get('exp'));
    }
    if(params.get('mode') === 'embed') {
      setIsEmbed(true);
    }
  }, []);

  // Carousel auto-rotation
  useEffect(() => {
    if (activeExp || isEmbed) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 7000); // 7 seconds per slide
    return () => clearInterval(interval);
  }, [activeExp, isEmbed, CAROUSEL_ITEMS.length]);

  // Grouping experiences by category
  const groupedExperiences = useMemo(() => {
    const groups: Record<string, typeof EXPERIENCES> = {};
    EXPERIENCES.forEach(exp => {
      if (!groups[exp.category]) groups[exp.category] = [];
      groups[exp.category].push(exp);
    });
    return groups;
  }, []);

  const renderActive = () => {
    const Exp = EXPERIENCES.find(e => e.id === activeExp)?.component;
    if (!Exp) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-[#030303]">
        {!isEmbed && (
          <button 
            onClick={() => setActiveExp(null)}
            className="absolute top-6 left-6 z-[1000] flex items-center gap-2 px-5 py-2.5 bg-black/40 hover:bg-black/80 backdrop-blur-xl rounded-full text-white transition-all font-medium border border-white/10 shadow-xl"
          >
            <ArrowLeft size={20} /> <span className="hidden md:inline">Voltar ao Laboratório</span>
          </button>
        )}
        <Exp onComplete={() => window.location.href = 'https://www.imersaogestaodeimpacto.com.br/'} />
      </div>
    );
  }

  const heroExp = CAROUSEL_ITEMS[currentHeroIndex];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* Navbar Premium */}
      <nav className="fixed top-0 left-0 right-0 h-20 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center px-6 md:px-12 backdrop-blur-sm transition-all duration-300">
        <div className="text-[#D4AF37] font-black text-2xl tracking-tighter cursor-pointer">
          IMPACTO<span className="font-light text-white">LABS</span>
        </div>
        <div className="ml-16 hidden md:flex gap-8 text-sm font-semibold text-white/60">
          <span className="text-white cursor-pointer hover:text-white transition">Início</span>
          <span className="cursor-pointer hover:text-white transition">Séries Interativas</span>
          <span className="cursor-pointer hover:text-white transition">Páginas de Captura</span>
          <span className="cursor-pointer hover:text-white transition">Estudos de Caso</span>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <div className="relative w-full h-[90vh] md:h-[85vh] flex items-center px-6 md:px-12 overflow-hidden">
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentHeroIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
            <img src={heroExp.thumb} className="w-full h-full object-cover opacity-50 mix-blend-luminosity" alt="Hero Background" />
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-20 max-w-3xl mt-20 md:mt-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#D4AF37] font-black text-3xl tracking-widest leading-none">N</span>
                <span className="text-white/70 tracking-[0.4em] text-[10px] md:text-xs uppercase font-bold border-l border-white/20 pl-3">Experiência Original</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9]" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
                {heroExp.title.split(' ').slice(0, 2).join(' ')}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                  {heroExp.title.split(' ').slice(2).join(' ')}
                </span>
              </h1>
              
              <div className="flex items-center gap-4 text-white/90 font-medium mb-8 text-sm md:text-base">
                <span className="text-green-500 font-bold drop-shadow-md">98% Relevância</span>
                <span className="border border-white/30 px-2 py-0.5 rounded-sm bg-black/20 backdrop-blur-md">A3</span>
                <span>{heroExp.duration}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs tracking-wider">4K HDR</span>
              </div>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl font-light leading-relaxed drop-shadow-xl">
                {heroExp.subtitle}. Teste essa experiência tátil de alta conversão projetada para gerar desconforto e reflexão imediata no visitante.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setActiveExp(heroExp.id)}
                  className="flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <Play size={24} fill="currentColor" /> Testar Interação
                </button>
                <button 
                  onClick={() => setCopyExp(heroExp)}
                  className="flex items-center justify-center gap-3 bg-[#222]/80 backdrop-blur-md text-white border border-[#444] px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-[#333] hover:border-white/40 transition-all"
                >
                  <Code size={24} /> Obter Código Iframe
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 right-12 z-20 hidden md:flex gap-2">
          {CAROUSEL_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/30 hover:bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categorized Rows */}
      <div className="relative z-20 px-6 md:px-12 pb-32 -mt-10 space-y-16">
        
        {Object.entries(groupedExperiences).map(([category, items]) => (
          <div key={category} className="group/row">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center text-white/90 group-hover/row:text-white transition-colors">
              {category}
            </h2>
            
            <div className="flex gap-4 overflow-x-auto pb-8 pt-4 -mt-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Fake CSS to hide scrollbar */}
              <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
              `}</style>
              
              {items.map((exp) => (
                <motion.div 
                  key={exp.id}
                  className="relative w-72 md:w-80 h-44 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 snap-start border border-white/5 bg-[#111]"
                  onMouseEnter={() => setHoveredCard(exp.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  initial={{ scale: 1, zIndex: 1 }}
                  whileHover={{ scale: 1.1, zIndex: 50, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img src={exp.thumb} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" style={{ transform: hoveredCard === exp.id ? 'scale(1.1)' : 'scale(1)' }} alt={exp.title} />
                  <div className={`absolute inset-0 bg-gradient-to-t ${exp.bg} to-[#0A0A0A]/40 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
                  
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    {exp.tag && (
                      <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[10px] font-black px-2 py-1 rounded-[4px] uppercase tracking-widest shadow-lg">
                        {exp.tag}
                      </div>
                    )}
                    
                    <h3 className="font-bold text-lg md:text-xl leading-tight mb-1 text-white shadow-black drop-shadow-md">{exp.title}</h3>
                    
                    <AnimatePresence>
                      {hoveredCard === exp.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="text-xs text-white/70 overflow-hidden"
                        >
                          <div className="flex items-center gap-3 font-medium mb-3">
                            <span className="text-green-500">100% Match</span>
                            <span className="border border-white/30 px-1.5 py-0.5 rounded-sm bg-white/10">A3</span>
                            <span>{exp.duration}</span>
                          </div>
                          
                          <div className="flex gap-3 mt-2">
                             <button 
                                onClick={(e) => { e.stopPropagation(); setActiveExp(exp.id); }}
                                className="flex-1 bg-white text-black py-2 rounded font-bold flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors"
                             >
                               <Play size={14} fill="currentColor"/> Testar
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); setCopyExp(exp); }}
                                className="w-10 bg-white/20 text-white rounded flex items-center justify-center hover:bg-white/40 transition-colors border border-white/10"
                                title="Obter Iframe"
                             >
                               <Code size={16} />
                             </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {copyExp && <CopyModal expId={copyExp.id} expTitle={copyExp.title} onClose={() => setCopyExp(null)} />}
      </AnimatePresence>

      {activeExp && renderActive()}
    </div>
  );
}

export default App;
