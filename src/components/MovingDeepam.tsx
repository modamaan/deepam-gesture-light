import { motion } from "framer-motion";
import { DeepamSVG } from "./DeepamSVG";

interface MovingDeepamProps {
  position: { x: number; y: number };
  isVisible: boolean;
  onReachTarget?: () => void;
  targetPosition: { x: number; y: number };
}

export const MovingDeepam = ({ position, isVisible, onReachTarget, targetPosition }: MovingDeepamProps) => {
  if (!isVisible) return null;

  const distance = Math.sqrt(
    Math.pow(position.x - targetPosition.x, 2) + 
    Math.pow(position.y - targetPosition.y, 2)
  );

  // Trigger lighting when close enough to target
  if (distance < 80 && onReachTarget) {
    setTimeout(onReachTarget, 100);
  }

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      style={{
        left: position.x - 30,
        top: position.y - 36,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        filter: "drop-shadow(0 0 20px #F59E0B)"
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.3 },
        filter: { duration: 0.5 }
      }}
    >
      {/* Flame trail effect */}
      <motion.div
        className="absolute inset-0 bg-flame-gradient rounded-full opacity-40 blur-sm"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Moving deepam */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <DeepamSVG isLit={true} size="small" />
      </motion.div>
      
      {/* Sparkle particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-sacred-glow rounded-full"
          style={{
            left: Math.random() * 60,
            top: Math.random() * 60,
          }}
          animate={{
            y: [-10, -30],
            opacity: [1, 0],
            scale: [1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );
};