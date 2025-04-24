import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-switcher"
      initial={false}
      animate={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{
        scale: 1.05,
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}
    >
      <motion.div
        initial={false}
        animate={{
          translateX: isDark ? '0%' : '100%',
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', left: '10px' }}
      >
        <MoonIcon size={20} color={isDark ? '#fbbf24' : '#94a3b8'} />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          translateX: isDark ? '-100%' : '0%',
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ position: 'absolute', right: '10px' }}
      >
        <SunIcon size={20} color={isDark ? '#94a3b8' : '#f59e0b'} />
      </motion.div>

      <motion.div
        className="theme-switcher-track"
        initial={false}
        animate={{
          backgroundColor: isDark ? '#fbbf24' : '#f59e0b',
          x: isDark ? '0%' : '100%',
        }}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? [1, 1.2, 1] : [1, 0.8, 1],
            rotate: isDark ? 0 : 180,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            boxShadow: isDark 
              ? '0 0 10px rgba(251, 191, 36, 0.3)' 
              : '0 0 10px rgba(245, 158, 11, 0.3)',
          }}
        />
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher; 