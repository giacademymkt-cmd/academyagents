import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Play, Code, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
import The3AMCall from './components/experiences/The3AMCall';
import InterrogationRoom from './components/experiences/InterrogationRoom';
import SilentBleed from './components/experiences/SilentBleed';
import WhatsappCaos from './components/experiences/WhatsappCaos';

const EXPERIENCES = [
  { id: '3amcall', title: 'A Ligação às 3 da Manhã', category: 'Horror Corporativo', subtitle: 'A empresa não dorme. E você também não.', duration: 'Interativo', tag: 'Top 1', bg: 'from-red-900/40', thumb: 'https://images.unsplash.com/photo-1517868351636-70e1bba87c26?q=80&w=2000', component: The3AMCall },
  { id: 'interrogation', title: 'A Sala de Interrogatório', category: 'Horror Corporativo', subtitle: 'Síndrome do Impostor Sistêmica (Usa Webcam)', duration: 'Interativo', tag: 'Tensão', bg: 'from-zinc-900/40', thumb: 'https://images.unsplash.com/photo-1509928015542-d61cc0824982?w=800&q=80', component: InterrogationRoom },
  { id: 'silentbleed', title: 'O Cofre do Silêncio', category: 'Horror Corporativo', subtitle: 'A morte silenciosa do caixa', duration: '15 seg', tag: 'Novo', bg: 'from-orange-900/40', thumb: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80', component: SilentBleed },
  
  { id: 'whatsapp', title: 'O Caos do WhatsApp', category: 'O Peso da Liderança', subtitle: 'A sobrecarga que destrói sua sanidade', duration: '1 min', tag: 'Trending', bg: 'from-green-900/40', thumb: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&q=80', component: WhatsappCaos },
  { id: 'avalanche', title: 'A Avalanche do Fundador', category: 'O Peso da Liderança', subtitle: 'A síndrome do apagador de incêndios', duration: 'Interativo', tag: '', bg: 'from-red-900/40', thumb: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80', component: FounderAvalanche },
  { id: 'iphone', title: 'Celular do Colapso', category: 'O Peso da Liderança', subtitle: 'Uma chuva violenta de notificações', duration: '30 seg', tag: '', bg: 'from-blue-900/40', thumb: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', component: IPhoneCollapse },
  
  { id: 'abyss', title: 'O Abismo da Folha', category: 'Caixa & Finanças', subtitle: 'O ralo de luxo mensal', duration: 'Interativo', tag: '', bg: 'from-zinc-900/40', thumb: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80', component: PayrollAbyss },
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
        <p className="text-white/60 mb-8 text-sm">Copie o código para injetar a experiência <strong className="text-[#e50914]">"{expTitle}"</strong> na sua página via HTML/Elementor.</p>
        
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

          <div className="bg-gradient-to-r from-[#e50914]/10 to-[#0A0A0A] border border-[#e50914]/30 p-5 rounded-xl flex items-center justify-between hover:border-[#e50914]/60 transition-colors">
            <div>
              <div className="font-bold text-white mb-1">Tela Cheia (Imersão)</div>
              <div className="text-xs text-white/40">Altura de 100vh. Rouba a atenção.</div>
            </div>
            <button 
              onClick={() => copyCode('full')}
              className="bg-[#e50914] hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition"
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
  const [showSplash, setShowSplash] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [completedExps, setCompletedExps] = useState<string[]>([]);
  
  const CAROUSEL_ITEMS = EXPERIENCES.filter(e => e.tag === 'Top 1' || e.tag === 'Novo' || e.tag === 'Trending').slice(0, 5);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const rowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Carregar estado de experiências completadas
    const saved = localStorage.getItem('completed_experiences');
    if (saved) {
      setCompletedExps(JSON.parse(saved));
    }

    const params = new URLSearchParams(window.location.search);
    if(params.has('exp')) {
      setActiveExp(params.get('exp'));
      setShowSplash(false);
    } else {
      setTimeout(() => setShowSplash(false), 2000); // 2 segundos de splash
    }
    if(params.get('mode') === 'embed') {
      setIsEmbed(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const markCompleted = (id: string) => {
    setCompletedExps(prev => {
      if (!prev.includes(id)) {
        const next = [...prev, id];
        localStorage.setItem('completed_experiences', JSON.stringify(next));
        return next;
      }
      return prev;
    });
  };

  const playHoverSound = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const scrollRow = (category: string, direction: 'left' | 'right') => {
    const el = rowRefs.current[category];
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  const groupedExperiences = useMemo(() => {
    const groups: Record<string, typeof EXPERIENCES> = {};
    EXPERIENCES.forEach(exp => {
      if (!groups[exp.category]) groups[exp.category] = [];
      groups[exp.category].push(exp);
    });
    return groups;
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col items-center justify-center z-[5000]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-[#e50914] font-black text-5xl md:text-7xl tracking-tighter mb-4 shadow-[0_0_50px_rgba(229,9,20,0.5)]">
            IMPACTO<span className="font-light text-white">LABS</span>
          </div>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-1 bg-[#e50914] mx-auto rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  const renderActive = () => {
    const Exp = EXPERIENCES.find(e => e.id === activeExp)?.component;
    if (!Exp) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[100] bg-[#030303]"
      >
        {!isEmbed && (
          <button 
            onClick={() => { setActiveExp(null); if(activeExp) markCompleted(activeExp); }}
            className="absolute top-6 left-6 z-[1000] flex items-center gap-2 px-5 py-2.5 bg-black/40 hover:bg-black/80 backdrop-blur-xl rounded-full text-white transition-all font-medium border border-white/10 shadow-xl"
          >
            <ArrowLeft size={20} /> <span className="hidden md:inline">Voltar ao Laboratório</span>
          </button>
        )}
        <Exp onComplete={() => { if(activeExp) markCompleted(activeExp); window.location.href = 'https://www.imersaogestaodeimpacto.com.br/'; }} />
      </motion.div>
    );
  }

  const heroExp = CAROUSEL_ITEMS[currentHeroIndex];

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans overflow-x-hidden selection:bg-[#e50914] selection:text-white">
      
      {/* Navbar Premium */}
      <nav className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center px-6 md:px-12 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
        <div className="text-[#e50914] font-black text-2xl tracking-tighter cursor-pointer">
          IMPACTO<span className="font-light text-white">LABS</span>
        </div>
        <div className="ml-16 hidden md:flex gap-8 text-sm font-semibold text-white/60">
          <span className="text-white cursor-pointer transition">Início</span>
          <span className="cursor-pointer hover:text-white transition">Séries Interativas</span>
          <span className="cursor-pointer hover:text-white transition">Estudos de Caso</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[90vh] md:h-[85vh] flex items-center px-6 md:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          {/* Video Background Fallback/Simulation */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent z-10" />
          <motion.img 
            key={currentHeroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 1.5 }}
            src={heroExp.thumb} 
            className="w-full h-full object-cover mix-blend-luminosity" 
            alt="Hero Background" 
          />
        </div>
        
        <div className="relative z-20 max-w-3xl mt-20 md:mt-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#e50914] font-black text-3xl tracking-widest leading-none">N</span>
                <span className="text-white/70 tracking-[0.4em] text-[10px] md:text-xs uppercase font-bold border-l border-white/20 pl-3">Série Original</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9]" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
                {heroExp.title}
              </h1>
              
              <div className="flex items-center gap-4 text-white/90 font-medium mb-8 text-sm md:text-base">
                <span className="text-green-500 font-bold drop-shadow-md">98% Relevância</span>
                <span className="border border-white/30 px-2 py-0.5 rounded-sm bg-black/20 backdrop-blur-md">A3</span>
                <span>{heroExp.duration}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs tracking-wider border border-white/20">4K HDR</span>
              </div>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl font-light leading-relaxed drop-shadow-xl">
                {heroExp.subtitle}. Teste essa experiência tátil de alta conversão projetada para gerar desconforto e reflexão imediata no visitante.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => { setActiveExp(heroExp.id); markCompleted(heroExp.id); }}
                  className="flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <Play size={24} fill="currentColor" /> Assistir Experiência
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
      </div>

      {/* Categorized Rows */}
      <div className="relative z-20 px-6 md:px-12 pb-32 -mt-10 space-y-16">
        
        {Object.entries(groupedExperiences).map(([category, items]) => (
          <div key={category} className="group/row relative">
            <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-white/90 group-hover/row:text-white transition-colors">
              {category}
            </h2>
            
            {/* Arrows */}
            <button 
              onClick={() => scrollRow(category, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/80 backdrop-blur-md p-2 h-full opacity-0 group-hover/row:opacity-100 transition-opacity"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={() => scrollRow(category, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/80 backdrop-blur-md p-2 h-full opacity-0 group-hover/row:opacity-100 transition-opacity"
            >
              <ChevronRight size={32} />
            </button>

            <div 
              ref={el => rowRefs.current[category] = el}
              className="flex gap-4 overflow-x-auto py-4 snap-x no-scrollbar scroll-smooth" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              
              {items.map((exp) => {
                const isCompleted = completedExps.includes(exp.id);
                return (
                  <motion.div 
                    key={exp.id}
                    className="relative w-72 md:w-80 h-44 rounded-md overflow-hidden cursor-pointer flex-shrink-0 snap-start border border-white/5 bg-[#111]"
                    onMouseEnter={() => { setHoveredCard(exp.id); playHoverSound(); }}
                    onMouseLeave={() => setHoveredCard(null)}
                    initial={{ scale: 1, zIndex: 1 }}
                    whileHover={{ scale: 1.05, zIndex: 50, y: -2 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <img src={exp.thumb} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" style={{ transform: hoveredCard === exp.id ? 'scale(1.1)' : 'scale(1)' }} alt={exp.title} />
                    <div className={`absolute inset-0 bg-gradient-to-t ${exp.bg} to-[#0A0A0A]/40 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
                    
                    {/* Hover Glow */}
                    {hoveredCard === exp.id && (
                      <div className="absolute inset-0 ring-2 ring-white/50 rounded-md z-10 pointer-events-none" />
                    )}
                    
                    <div className="absolute inset-0 p-5 flex flex-col justify-end z-20">
                      {exp.tag && (
                        <div className="absolute top-3 left-3 bg-[#e50914] text-white text-[10px] font-black px-2 py-1 rounded-[4px] uppercase tracking-widest shadow-lg">
                          {exp.tag}
                        </div>
                      )}
                      
                      <h3 className="font-bold text-lg leading-tight mb-1 text-white shadow-black drop-shadow-md">{exp.title}</h3>
                      
                      {/* Barra de Progresso Vermelha se assistido */}
                      {isCompleted && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                          <div className="h-full bg-[#e50914] w-[90%]"></div>
                        </div>
                      )}
                      
                      <AnimatePresence>
                        {hoveredCard === exp.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="text-xs text-white/70 overflow-hidden"
                          >
                            <div className="flex gap-3 mt-2">
                               <button 
                                  onClick={(e) => { e.stopPropagation(); setActiveExp(exp.id); markCompleted(exp.id); }}
                                  className="flex-1 bg-white text-black py-2 rounded-sm font-bold flex items-center justify-center gap-1 hover:bg-gray-200 transition-colors"
                               >
                                 <Play size={14} fill="currentColor"/> {isCompleted ? 'Assistir Novamente' : 'Assistir'}
                               </button>
                               <button 
                                  onClick={(e) => { e.stopPropagation(); setCopyExp(exp); }}
                                  className="w-10 bg-white/20 text-white rounded-sm flex items-center justify-center hover:bg-white/40 transition-colors border border-white/10"
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
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {copyExp && <CopyModal expId={copyExp.id} expTitle={copyExp.title} onClose={() => setCopyExp(null)} />}
        {activeExp && renderActive()}
      </AnimatePresence>

    </div>
  );
}

export default App;
