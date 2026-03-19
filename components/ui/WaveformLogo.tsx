'use client';

import React from 'react';

interface SlapBoxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const SlapBoxLogo: React.FC<SlapBoxLogoProps> = ({ 
  size = 'md', 
  className = '',
  animated = false 
}) => {
  const sizes = {
    sm: 'w-24 h-8',
    md: 'w-32 h-10',
    lg: 'w-48 h-16'
  };

  return (
    <div className={`${sizes[size]} ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 300 80"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background glow effect */}
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="50%" stopColor="#7B2EFF" />
            <stop offset="100%" stopColor="#C9A86A" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* SlapBox bars integrated into text */}
        <g className={animated ? 'animate-pulse' : ''}>
          {/* W */}
          <path
            d="M10 20 L15 60 L20 40 L25 60 L30 20"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* A with slapbox peak */}
          <path
            d="M40 60 L45 20 L50 60 M42 45 L48 45"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* V */}
          <path
            d="M60 20 L65 60 L70 20"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* E */}
          <path
            d="M80 20 L80 60 M80 20 L95 20 M80 40 L90 40 M80 60 L95 60"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* F */}
          <path
            d="M105 20 L105 60 M105 20 L120 20 M105 40 L115 40"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* O with slapbox circle */}
          <circle
            cx="135"
            cy="40"
            r="18"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
          />
          
          {/* R */}
          <path
            d="M165 20 L165 60 M165 20 Q175 20 175 30 Q175 40 165 40 L175 60"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* M */}
          <path
            d="M185 60 L185 20 L195 40 L205 20 L205 60"
            stroke="url(#textGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* SlapBox visualization bars below text */}
        <g className="opacity-60">
          {[...Array(15)].map((_, i) => {
            const height = Math.random() * 8 + 2;
            const x = 50 + i * 12;
            return (
              <rect
                key={i}
                x={x}
                y={65 - height / 2}
                width="2"
                height={height}
                fill="url(#textGradient)"
                className={animated ? `animate-pulse` : ''}
                style={animated ? { animationDelay: `${i * 0.1}s` } : {}}
              />
            );
          })}
        </g>

        {/* Crown/signal pulse accent */}
        <g className="opacity-40">
          <path
            d="M240 25 L245 15 L250 25 L255 15 L260 25"
            stroke="#00C2FF"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            className={animated ? 'animate-pulse' : ''}
          />
        </g>

        {/* Glow effect on entire logo */}
        <g filter="url(#glow)" className="opacity-80">
          <text
            x="10"
            y="50"
            fontSize="0"
            fill="url(#textGradient)"
            className="font-bold tracking-wider"
          >
            SLAPBOX
          </text>
        </g>
      </svg>
    </div>
  );
};