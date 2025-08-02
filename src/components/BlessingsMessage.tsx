import { motion } from "framer-motion";

interface BlessingsMessageProps {
  isVisible: boolean;
}

export const BlessingsMessage = ({ isVisible }: BlessingsMessageProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Backdrop with mystical effect */}
      <motion.div
        className="absolute inset-0 bg-mystical-blue/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Blessing text container */}
      <motion.div
        className="relative text-center px-8 py-12 bg-card/20 backdrop-blur-md rounded-3xl border border-primary/30"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          duration: 1.2, 
          ease: "easeOut",
          delay: 0.5 
        }}
      >
        {/* Sanskrit blessing */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
            🙏
          </p>
          <p className="text-xl md:text-2xl font-serif text-foreground mb-4">
            तमसो मा ज्योतिर्गमय
          </p>
          <p className="text-lg md:text-xl text-muted-foreground italic">
            "Lead us from darkness to light"
          </p>
        </motion.div>
        
        {/* Additional blessing */}
        <motion.div
          className="border-t border-primary/20 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p className="text-lg text-foreground font-medium mb-2">
            May this sacred light illuminate your path
          </p>
          <p className="text-base text-muted-foreground">
            and bring peace, prosperity, and wisdom to your life
          </p>
        </motion.div>
        
        {/* Floating particles around text */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-60"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
      
      {/* Radial glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
        initial={{ scale: 0 }}
        animate={{ scale: 2 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
      />
    </motion.div>
  );
};