'use client'

import React, { useEffect, useState } from 'react';

interface StatusIndicatorProps {
  status: 'available' | 'busy' | 'offline';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusIndicator({ status, animated = true, size = 'md' }: StatusIndicatorProps) {
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setPulseCount(prev => prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [animated]);

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getRippleColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-400';
      case 'busy':
        return 'bg-yellow-400';
      case 'offline':
        return 'bg-red-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Ripple effect */}
      {animated && (
        <div
          key={pulseCount}
          className={`absolute ${sizeClasses[size]} ${getRippleColor()} rounded-full animate-ping opacity-75`}
        />
      )}
      
      {/* Main indicator */}
      <div
        className={`relative ${sizeClasses[size]} ${getStatusColor()} rounded-full border-2 border-white shadow-lg ${
          animated ? 'animate-pulse' : ''
        }`}
      />
    </div>
  );
}