import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffect = () => {
  return (
    <div className="background-wrapper" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: -1,
      background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
    }}>
      {/* Animated circles */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0) 70%)',
            borderRadius: '50%',
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.5,
      }} />
    </div>
  );
};

export default BackgroundEffect; 