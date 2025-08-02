import { motion } from "framer-motion";

interface DeepamSVGProps {
  isLit?: boolean;
  size?: 'small' | 'large';
  className?: string;
}

export const DeepamSVG = ({ isLit = false, size = 'large', className = '' }: DeepamSVGProps) => {
  const svgSize = size === 'large' ? 120 : 60;
  
  return (
    <div className={`relative ${className}`}>
      <svg
        width={svgSize}
        height={svgSize * 1.2}
        viewBox="0 0 120 144"
        className="drop-shadow-lg"
      >
        {/* Lamp Base */}
        <motion.path
          d="M30 120 L90 120 L85 130 L35 130 Z"
          fill="url(#brassGradient)"
          stroke="#B45309"
          strokeWidth="1"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Lamp Body */}
        <motion.ellipse
          cx="60"
          cy="105"
          rx="25"
          ry="15"
          fill="url(#brassGradient)"
          stroke="#B45309"
          strokeWidth="1.5"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Lamp Rim */}
        <motion.ellipse
          cx="60"
          cy="90"
          rx="28"
          ry="8"
          fill="url(#brassRimGradient)"
          stroke="#92400E"
          strokeWidth="1"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
        
        {/* Wick */}
        <motion.rect
          x="58"
          y="85"
          width="4"
          height="10"
          fill="#451A03"
          rx="2"
          initial={{ height: 0 }}
          animate={{ height: 10 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        />
        
        {/* Flame - Only visible when lit */}
        {isLit && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Flame glow */}
            <motion.ellipse
              cx="60"
              cy="70"
              rx="15"
              ry="25"
              fill="url(#flameGlow)"
              opacity="0.6"
              animate={{
                scaleX: [1, 1.1, 1],
                scaleY: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main flame */}
            <motion.path
              d="M60 85 Q50 75 52 65 Q54 55 60 50 Q66 55 68 65 Q70 75 60 85"
              fill="url(#flameGradient)"
              animate={{
                d: [
                  "M60 85 Q50 75 52 65 Q54 55 60 50 Q66 55 68 65 Q70 75 60 85",
                  "M60 85 Q48 75 53 65 Q55 53 60 48 Q65 53 67 65 Q72 75 60 85",
                  "M60 85 Q50 75 52 65 Q54 55 60 50 Q66 55 68 65 Q70 75 60 85"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Inner flame highlight */}
            <motion.path
              d="M60 80 Q55 72 57 65 Q58 58 60 55 Q62 58 63 65 Q65 72 60 80"
              fill="url(#innerFlame)"
              animate={{
                opacity: [0.8, 1, 0.8],
                scaleY: [1, 1.1, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        )}
        
        {/* Gradients */}
        <defs>
          <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          
          <linearGradient id="brassRimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          
          <radialGradient id="flameGradient" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="30%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EA580C" />
          </radialGradient>
          
          <radialGradient id="innerFlame" cx="50%" cy="70%" r="40%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE047" />
          </radialGradient>
          
          <radialGradient id="flameGlow" cx="50%" cy="70%" r="70%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Sacred glow effect when lit */}
      {isLit && (
        <motion.div
          className="absolute inset-0 bg-flame-gold rounded-full opacity-20 blur-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 2 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}
    </div>
  );
};