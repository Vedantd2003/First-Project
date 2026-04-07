'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParallax } from '@/hooks/useParallax';
import { MonthTheme } from '@/types';
import { MONTH_NAMES } from '@/data/heroImages';

interface HeroImageProps {
  theme: MonthTheme;
  month: number;
  year: number;
}

export default function HeroImage({ theme, month, year }: HeroImageProps) {
  const parallax = useParallax(0.015);

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-t-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${month}-${year}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.img
            src={theme.heroUrl}
            alt={`${MONTH_NAMES[month]} hero`}
            className="w-full h-full object-cover"
            style={{
              transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.1)`,
            }}
            crossOrigin="anonymous"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 30%, ${theme.bg}ee 90%, ${theme.bg} 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}33, transparent 50%, ${theme.secondary}33)`,
        }}
      />

      {/* Month title overlay */}
      <div className="absolute bottom-4 left-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${month}-${year}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{
                color: '#fff',
                textShadow: `0 2px 20px ${theme.bg}88`,
              }}
            >
              {MONTH_NAMES[month]}
            </h1>
            <p
              className="text-lg font-light opacity-80"
              style={{ color: '#fff', textShadow: `0 1px 10px ${theme.bg}` }}
            >
              {year}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
