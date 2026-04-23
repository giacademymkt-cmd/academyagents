import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass } from 'lucide-react';

export default function ParticleHourglass({ onComplete }: { onComplete: () => void }) {
  const [isDraining, setIsDraining] = useState(false);
  const [moneyLost, setMoneyLost] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const animationRef = useRef<number>();
  const moneyIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup Canvas
    canvas.width = 300;
    canvas.height = 400;

    // Initialize particles (gold sand) in the top half
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 2000; i++) {
        particlesRef.current.push({
          x: 150 + (Math.random() - 0.5) * 120, // Top bulb width
          y: 50 + Math.random() * 100, // Top bulb height
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0,
          inTop: true,
          color: `hsl(45, ${80 + Math.random() * 20}%, ${50 + Math.random() * 30}%)` // Gold variations
        });
      }
    };

    if (particlesRef.current.length === 0) initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Hourglass Glass
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Top bulb
      ctx.moveTo(50, 20);
      ctx.lineTo(250, 20);
      ctx.quadraticCurveTo(250, 180, 160, 200);
      // Bottom bulb
      ctx.quadraticCurveTo(250, 220, 250, 380);
      ctx.lineTo(50, 380);
      ctx.quadraticCurveTo(50, 220, 140, 200);
      // Back to top
      ctx.quadraticCurveTo(50, 180, 50, 20);
      ctx.stroke();

      // Update & Draw Particles
      let particlesInTop = 0;

      particlesRef.current.forEach(p => {
        if (isDraining) {
          if (p.inTop) {
            // Move towards the neck (150, 200)
            const dx = 150 - p.x;
            const dy = 200 - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 20) {
              // Pass through neck
              p.inTop = false;
              p.vx = (Math.random() - 0.5) * 2;
              p.vy = 2 + Math.random() * 3;
            } else {
              // Drift down and towards center
              p.x += dx * 0.01 + p.vx;
              p.y += 1 + Math.random();
            }
            particlesInTop++;
          } else {
            // Fall in bottom bulb
            p.y += p.vy;
            p.x += p.vx;
            p.vy += 0.2; // gravity
            
            // Bottom collision
            if (p.y > 370 - Math.random() * 20) {
              p.y = 370 - Math.random() * 20;
              p.vx *= 0.5;
              p.vy = 0;
            }
            
            // Side collision (simple approximation of bulb shape)
            if (p.x < 60) p.x = 60;
            if (p.x > 240) p.x = 240;
          }
        } else {
          if (p.inTop) particlesInTop++;
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
      });

      if (isDraining && particlesInTop === 0) {
        setIsEmpty(true);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDraining]);

  const handleStartDrain = () => {
    setIsDraining(true);
    if (!moneyIntervalRef.current) {
      moneyIntervalRef.current = setInterval(() => {
        setMoneyLost(prev => prev + Math.floor(Math.random() * 500) + 100);
      }, 50);
    }
  };

  const handleStopDrain = () => {
    setIsDraining(false);
    if (moneyIntervalRef.current) {
      clearInterval(moneyIntervalRef.current);
      moneyIntervalRef.current = undefined;
    }
  };

  useEffect(() => {
    if (isEmpty && moneyIntervalRef.current) {
      clearInterval(moneyIntervalRef.current);
    }
  }, [isEmpty]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
      
      <div className="text-center mb-12 z-20">
        <h2 className="text-3xl font-light mb-2 text-white/90">A Engrenagem Mais Cara</h2>
        <p className="text-neutral-500">Mantenha pressionado para resolver os problemas da equipe.</p>
      </div>

      {/* The Canvas Hourglass */}
      <div 
        className="relative z-10 cursor-pointer"
        onMouseDown={handleStartDrain}
        onMouseUp={handleStopDrain}
        onMouseLeave={handleStopDrain}
        onTouchStart={handleStartDrain}
        onTouchEnd={handleStopDrain}
      >
        <canvas ref={canvasRef} className="block" />
        
        {/* Glow effect behind canvas */}
        <div className="absolute inset-0 bg-yellow-500/5 blur-[100px] -z-10" />
      </div>

      {/* The Money Counter */}
      <div className="mt-12 text-center z-20">
        <div className="text-sm text-neutral-500 uppercase tracking-widest mb-2 font-bold">Custo do seu tempo no operacional</div>
        <div className="text-5xl font-mono font-bold text-yellow-500 tracking-tighter">
          - R$ {moneyLost.toLocaleString('pt-BR')}
        </div>
      </div>

      <AnimatePresence>
        {isEmpty && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-10 flex flex-col items-center z-30"
          >
            <p className="text-xl text-white/80 max-w-lg text-center mb-6">
              Seu tempo esgotou. E o lucro também.<br/>
              Delegue, ou pague o preço.
            </p>
            <button 
              onClick={onComplete}
              className="bg-yellow-600 text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-yellow-500 transition-colors shadow-[0_0_20px_rgba(202,138,4,0.3)]"
            >
              Proteger meu Tempo →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
