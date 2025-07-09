'use client'

import React, { useEffect, useState } from 'react';

interface FlameParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

export default function FlameParticles() {
  const [particles, setParticles] = useState<FlameParticle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles: FlameParticle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: 8 + Math.random() * 16,
      opacity: 0.4 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.8,
      color: ['#ff9800', '#ffd740', '#ff5722', '#ffb300'][Math.floor(Math.random() * 4)],
    }));

    setParticles(initialParticles);

    // Animation loop
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          opacity: particle.opacity - 0.005,
        })).filter(particle => particle.y > -10 && particle.opacity > 0)
      );
    }, 50);

    // Add new particles periodically
    const addParticleInterval = setInterval(() => {
      setParticles(prevParticles => {
        const newParticle: FlameParticle = {
          id: Date.now(),
          x: 40 + Math.random() * 20, // Center area
          y: 100 + Math.random() * 10,
          size: 8 + Math.random() * 16,
          opacity: 0.7 + Math.random() * 0.3,
          speed: 0.5 + Math.random() * 0.8,
          color: ['#ff9800', '#ffd740', '#ff5722', '#ffb300'][Math.floor(Math.random() * 4)],
        };
        return [...prevParticles, newParticle];
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(addParticleInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            transition: 'all 0.05s linear',
          }}
        />
      ))}
    </div>
  );
} 