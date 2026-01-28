import { useEffect, useState } from 'react';
import { splitComplementary, hslToString } from '../utils/colorTheory';
import { motion } from 'framer-motion';

/**
 * EnhancedBackground Component
 * Creates beautiful split-complementary gradient animations
 * with progressive enhancement and color-mix support
 * Enhanced with larger animated blobs, better visual hierarchy, and depth effects
 */
export default function EnhancedBackground({ baseHue = 220, intensity = 'medium' }) {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    // Generate split complementary colors
    const palette = splitComplementary(baseHue, 85, 65, 3, 18);
    setColors(palette);
  }, [baseHue]);

  const intensityConfig = {
    light: { opacity: 0.12, blur: '60px', scale: 0.8 },
    medium: { opacity: 0.28, blur: '90px', scale: 1.1 },
    dark: { opacity: 0.4, blur: '120px', scale: 1.3 }
  };

  const config = intensityConfig[intensity] || intensityConfig.medium;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-pink-50/20" />
      
      {/* Subtle animated gradient underlay */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(245,245,255,0.7))',
            'linear-gradient(225deg, rgba(255,255,255,0.85), rgba(240,248,255,0.75))',
            'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(245,245,255,0.7))'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      />

      {/* Progressive enhancement: color-mix support for modern browsers */}
      <style>{`
        @supports (background: color-mix(in oklab, white, black)) {
          .enhanced-bg-container {
            background:
              radial-gradient(
                ellipse 150% 100% at 15% 20%,
                color-mix(in oklab, var(--c1) ${config.opacity * 100}%, transparent),
                transparent 50%
              ),
              radial-gradient(
                ellipse 140% 110% at 85% 40%,
                color-mix(in oklab, var(--c3) ${config.opacity * 100}%, transparent),
                transparent 50%
              ),
              radial-gradient(
                ellipse 160% 120% at 50% 110%,
                color-mix(in oklab, var(--c5) ${config.opacity * 100}%, transparent),
                transparent 50%
              ),
              radial-gradient(
                ellipse 130% 90% at 20% 70%,
                color-mix(in oklab, var(--c2) ${config.opacity * 70}%, transparent),
                transparent 45%
              ),
              linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.95) 0%,
                rgba(255, 255, 255, 0.4) 50%,
                rgba(245, 245, 255, 0.95) 100%
              );
            background-size: 200% 200%;
            animation: gradientShift 15s ease infinite;
          }
          
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
          }
        }
      `}</style>

      <div className="enhanced-bg-container absolute inset-0" />

      {/* Large animated primary blob - stronger presence */}
      {colors.length > 0 && (
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter"
          style={{
            width: '600px',
            height: '600px',
            backgroundColor: hslToString(colors[0]),
            opacity: config.opacity * 1.2,
            filter: `blur(${config.blur})`
          }}
          animate={{
            x: ['-150px', '150px', '-100px', '150px'],
            y: ['-150px', '250px', '-200px', '250px'],
            scale: [1, 1.15, 0.9, 1.1],
            rotate: [0, 45, 90, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut'
          }}
          initial={{
            left: '10%',
            top: '5%'
          }}
        />
      )}

      {/* Secondary blob with different animation */}
      {colors.length > 1 && (
        <motion.div
          className="absolute rounded-full mix-blend-screen filter"
          style={{
            width: '550px',
            height: '550px',
            backgroundColor: hslToString(colors[1]),
            opacity: config.opacity * 1.15,
            filter: `blur(${config.blur})`
          }}
          animate={{
            x: ['-100px', '120px', '-50px', '120px'],
            y: ['-200px', '150px', '-100px', '150px'],
            scale: [1.1, 0.95, 1.2, 1],
            rotate: [360, 315, 270, 360]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: 1
          }}
          initial={{
            right: '15%',
            top: '10%'
          }}
        />
      )}

      {/* Tertiary blob */}
      {colors.length > 2 && (
        <motion.div
          className="absolute rounded-full mix-blend-overlay filter"
          style={{
            width: '500px',
            height: '500px',
            backgroundColor: hslToString(colors[2]),
            opacity: config.opacity,
            filter: `blur(${config.blur})`
          }}
          animate={{
            x: ['-80px', '100px', '-120px', '100px'],
            y: ['-50px', '180px', '-80px', '180px'],
            scale: [0.95, 1.15, 1, 1.1],
            rotate: [0, -45, -90, 0]
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: 2
          }}
          initial={{
            left: '50%',
            bottom: '-10%'
          }}
        />
      )}

      {/* Enhanced accent light rays - top right */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.3), transparent)',
          filter: 'blur(80px)',
          boxShadow: '0 0 200px rgba(255,255,255,0.5)'
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [0.8, 1.3, 0.8],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
      />

      {/* Enhanced bottom accent - left side */}
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200, 220, 255, 0.8), rgba(230, 230, 255, 0.3), transparent)',
          filter: 'blur(90px)',
          boxShadow: '0 0 150px rgba(200, 220, 255, 0.4)'
        }}
        animate={{
          opacity: [0.15, 0.4, 0.15],
          scale: [0.9, 1.25, 0.9],
          x: [-50, 50, -50],
          y: [50, -50, 50]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: 0.5
        }}
      />

      {/* Additional right side accent blob */}
      <motion.div
        className="absolute right-0 top-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 200, 220, 0.7), transparent)',
          filter: 'blur(70px)',
          boxShadow: '0 0 120px rgba(255, 200, 220, 0.3)'
        }}
        animate={{
          opacity: [0.1, 0.35, 0.1],
          scale: [1, 1.2, 1],
          x: [50, -50, 50]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: 1.5
        }}
      />

      {/* Shimmer effect overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%'
        }}
        animate={{
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'mirror'
        }}
      />
    </div>
  );
}
