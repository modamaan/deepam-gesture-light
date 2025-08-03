import { motion } from "framer-motion";

interface DeepamSVGProps {
  isLit?: boolean;
  size?: 'small' | 'large';
  className?: string;
}

export const DeepamSVG = ({ isLit=false, size = 'large', className = '' }: DeepamSVGProps) => {
  const svgSize = size === 'large' ? 420 : 210;
  
  return (
    <div className={`relative ${className}`}>
      <motion.img
        src="/new_without_flame2.svg"
        alt="Deepam Lamp (No Flame)"
        width={svgSize}
        height={svgSize * 1.6}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="drop-shadow-lg"
        style={{
          display: 'block',
          pointerEvents: 'none',
          filter: 'sepia(0.8) saturate(2.5) hue-rotate(-15deg) brightness(1.1)'
        }}
      />
      {/* Flame overlay, only visible when isLit */}
      {isLit && (
        <motion.img
          src="/new_flame.svg"
          alt="Deepam Flame"
          width={svgSize * 0.7}
          height={svgSize * 1.0}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="pointer-events-none absolute left-[15%] top-[-35%] z-20"
          style={{
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};