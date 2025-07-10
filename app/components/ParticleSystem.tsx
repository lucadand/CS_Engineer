'use client'

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'confetti' | 'star' | 'heart' | 'sparkle';
}

interface ParticleSystemProps {
  trigger: boolean;
  type: 'success' | 'feedback' | 'celebration';
  onComplete?: () => void;
}

const PARTICLE_COLORS = {
  success: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  feedback: ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
  celebration: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#8B5CF6', '#A78BFA']
};

const PARTICLE_SYMBOLS = {
  confetti: '🎉',
  star: '⭐',
  heart: '❤️',
  sparkle: '✨'
};

export default function ParticleSystem({ trigger, type, onComplete }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      createParticles();
    }
  }, [trigger, isActive]);

  const createParticles = () => {
    const newParticles: Particle[] = [];
    const particleCount = type === 'celebration' ? 30 : 15;
    const colors = PARTICLE_COLORS[type];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 15 - 5,
        size: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 120 + Math.random() * 60,
        type: Object.keys(PARTICLE_SYMBOLS)[Math.floor(Math.random() * 4)] as keyof typeof PARTICLE_SYMBOLS
      });
    }
    
    setParticles(newParticles);
    animateParticles();
  };

  const animateParticles = () => {
    let animationId: number;
    
    const animate = () => {
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.3, // gravity
            life: particle.life + 1,
            size: particle.size * 0.99 // shrink over time
          }))
          .filter(particle => 
            particle.life < particle.maxLife && 
            particle.y < window.innerHeight + 50 &&
            particle.size > 1
          );

        if (updatedParticles.length === 0) {
          setIsActive(false);
          onComplete?.();
          return [];
        }

        animationId = requestAnimationFrame(animate);
        return updatedParticles;
      });
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  };

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-2xl animate-pulse"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size}px`,
            opacity: Math.max(0, 1 - (particle.life / particle.maxLife)),
            transform: 'translate(-50%, -50%)',
            filter: `drop-shadow(0 0 ${particle.size/4}px ${particle.color})`,
            transition: 'all 0.1s ease-out'
          }}
        >
          {PARTICLE_SYMBOLS[particle.type]}
        </div>
      ))}
    </div>
  );
}