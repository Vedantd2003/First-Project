import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Monthly hero images from Unsplash (landscape/nature themed per month)
const MONTHLY_IMAGES: Record<number, string> = {
  0: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1200&q=80', // January - snowy
  1: 'https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1200&q=80', // February - winter
  2: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1200&q=80', // March - spring
  3: 'https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=1200&q=80', // April - cherry blossom
  4: 'https://images.unsplash.com/photo-1495584816685-4bdbeb4a5b33?w=1200&q=80', // May - flowers
  5: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', // June - summer beach
  6: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&q=80', // July - sunset
  7: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', // August - mountains
  8: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80', // September - autumn
  9: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1200&q=80', // October - fall leaves
  10: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80', // November - misty
  11: 'https://images.unsplash.com/photo-1482442120256-9c03866de390?w=1200&q=80', // December - winter cozy
};

interface ImagePanelProps {
  month: number;
  monthName: string;
  year: number;
  onImageLoad: (src: string) => void;
  themeGradient: string;
  isDark: boolean;
}

const ImagePanel: React.FC<ImagePanelProps> = React.memo(
  ({ month, monthName, year, onImageLoad, themeGradient, isDark }) => {
    const [loaded, setLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState('');

    const imageSrc = MONTHLY_IMAGES[month] || MONTHLY_IMAGES[0];

    const handleLoad = useCallback(() => {
      setLoaded(true);
      onImageLoad(imageSrc);
    }, [imageSrc, onImageLoad]);

    // Track when month changes to reset loading state
    React.useEffect(() => {
      if (currentSrc !== imageSrc) {
        setLoaded(false);
        setCurrentSrc(imageSrc);
      }
    }, [imageSrc, currentSrc]);

    return (
      <div className="relative w-full lg:w-[45%] h-64 sm:h-80 md:h-96 lg:h-full min-h-[240px] lg:min-h-[600px] overflow-hidden rounded-3xl lg:rounded-r-none">
        {/* Skeleton / blur placeholder */}
        <AnimatePresence mode="wait">
          {!loaded && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10"
              style={{ background: themeGradient }}
            >
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 to-white/5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={imageSrc}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.2, 0.9, 0.4, 1.1] }}
            className="absolute inset-0"
          >
            <img
              src={imageSrc}
              alt={`${monthName} ${year} landscape`}
              className="w-full h-full object-cover"
              onLoad={handleLoad}
              crossOrigin="anonymous"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0 z-20"
          style={{
            background: isDark
              ? 'linear-gradient(to top, rgba(15,15,30,0.9) 0%, rgba(15,15,30,0.4) 40%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
          }}
        />

        {/* Month & Year overlay */}
        <motion.div
          className="absolute bottom-8 left-8 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.2, 0.9, 0.4, 1.1] }}
        >
          <motion.h1
            key={`${monthName}-${year}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-none"
          >
            {monthName}
          </motion.h1>
          <motion.p
            key={`year-${year}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            className="text-xl sm:text-2xl text-white/70 font-light mt-2 tracking-widest"
          >
            {year}
          </motion.p>
        </motion.div>

        {/* Decorative corner accent */}
        <div
          className="absolute top-6 right-6 z-30 w-16 h-16 rounded-full opacity-30 blur-xl"
          style={{ background: themeGradient }}
        />
      </div>
    );
  }
);

ImagePanel.displayName = 'ImagePanel';

export default ImagePanel;
export { MONTHLY_IMAGES };
