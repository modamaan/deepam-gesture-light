import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandTracking } from './HandTracking';
import { DeepamSVG } from './DeepamSVG';
import { MovingDeepam } from './MovingDeepam';
import { BlessingsMessage } from './BlessingsMessage';
import { Button } from '@/components/ui/button';

type CeremonyState = 'idle' | 'detecting' | 'moving' | 'lit' | 'blessing';

export const VirtualInauguration = () => {
  const [state, setState] = useState<CeremonyState>('idle');
  const [handPosition, setHandPosition] = useState({ x: 0, y: 0 });
  const [deepamPosition, setDeepamPosition] = useState({ x: 0, y: 600 }); // Start from bottom left
  const [showMovingDeepam, setShowMovingDeepam] = useState(false);
  const [mainLampLit, setMainLampLit] = useState(false);
  const [showBlessings, setShowBlessings] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  
  const mainLampRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dynamically track main lamp center in screen coordinates
  const [mainLampCenter, setMainLampCenter] = useState({ x: 640, y: 360 });
  useLayoutEffect(() => {
    function updateLampCenter() {
      if (mainLampRef.current) {
        const rect = mainLampRef.current.getBoundingClientRect();
        setMainLampCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    }
    updateLampCenter();
    window.addEventListener('resize', updateLampCenter);
    return () => window.removeEventListener('resize', updateLampCenter);
  }, []);

  const onHandDetected = useCallback((position: { x: number; y: number }, isClenched: boolean) => {
    // Convert camera coordinates to screen coordinates
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Better coordinate mapping with higher resolution
    const screenX = rect.width - (position.x / 800) * rect.width; // Full screen mapping
    const screenY = (position.y / 600) * rect.height; // Full screen mapping
    
    setHandPosition({ x: screenX, y: screenY });
    
    if (isClenched && state === 'idle') {
      setState('detecting');
      setShowMovingDeepam(true);
      // Start deepam from bottom left
      setDeepamPosition({ x: 0, y: rect.height - 100 });
    } else if (isClenched && showMovingDeepam) {
      // Follow hand when clenched and deepam is visible
      setDeepamPosition({ x: screenX, y: screenY });
    } else if (!isClenched && showMovingDeepam) {
      setShowMovingDeepam(false);
      setState('idle');
    }
  }, [state, showMovingDeepam]);

  const onCameraReady = useCallback((video: HTMLVideoElement) => {
    setVideoElement(video);
  }, []);

  const onDeepamReachTarget = useCallback(() => {
    setShowMovingDeepam(false);
    setMainLampLit(true);
    setState('lit');
    
    // Show blessings after lighting animation
    setTimeout(() => {
      setShowBlessings(true);
      setState('blessing');
    }, 1500);
  }, []);

  const resetCeremony = useCallback(() => {
    setState('idle');
    setShowMovingDeepam(false);
    setMainLampLit(false);
    setShowBlessings(false);
    setDeepamPosition({ x: 0, y: 600 }); // Reset to bottom left
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-background via-accent/10 to-primary/20 overflow-hidden"
    >
      {/* Clean background - no stars */}

      {/* Main Deepam in center */}
      <motion.div
        ref={mainLampRef}
        className="absolute top-[60%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: mainLampLit ? 1.1 : 1, 
          opacity: 1 
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <DeepamSVG isLit={mainLampLit} size="large" />
        </motion.div>
        
        {mainLampLit && (
          <motion.div
            className="absolute inset-0 bg-primary rounded-full opacity-20 blur-3xl animate-sacred-glow"
            initial={{ scale: 0 }}
            animate={{ scale: 3 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        )}
      </motion.div>

      {/* Camera view - smaller and more subtle */}
      <motion.div
        className="absolute bottom-6 right-6 w-64 h-48 rounded-lg overflow-hidden border border-border/50 shadow-sm z-20 bg-card/80 backdrop-blur-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="text-xs text-muted-foreground p-2 bg-card/60 text-center">
          Camera View
        </div>
        <div className="relative h-full">
          <HandTracking 
            onHandDetected={onHandDetected}
            onCameraReady={onCameraReady}
          />
        </div>
      </motion.div>

      {/* Modern Header */}
      <motion.div
        className=" flex flex-col justify-center items-center my-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-1 sm:mb-2 flex flex-wrap items-center justify-center gap-1 sm:gap-3">
          <span className="hidden xs:inline">🪔</span>
          Virtual Inauguration Ceremony
          <span className="hidden xs:inline">🪔</span>
        </h1>
        <p className="text-base xs:text-lg sm:text-xl text-muted-foreground mb-2 sm:mb-6">
          Lamp Lighting (Deepam) Experience
        </p>
        <div className="text-xs xs:text-sm sm:text-base text-muted-foreground">
          {state === 'idle' && "Make a fist to light the sacred deepam"}
          {state === 'detecting' && "Move your hand toward the main lamp"}
          {state === 'lit' && "The sacred light has been kindled"}
          {state === 'blessing' && "May the divine light bless you"}
        </div>
      </motion.div>

      {/* Moving Deepam */}
      <AnimatePresence>
        <MovingDeepam
          position={deepamPosition}
          isVisible={showMovingDeepam}
          targetPosition={mainLampCenter}
          onReachTarget={onDeepamReachTarget}
        />
      </AnimatePresence>

      {/* Blessings Message */}
      <AnimatePresence>
        <BlessingsMessage isVisible={showBlessings} />
      </AnimatePresence>

      {/* Reset Button */}
      <AnimatePresence>
        {(mainLampLit || showBlessings) && (
          <motion.div
            className="absolute bottom-8 right-8 z-30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={resetCeremony}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Light Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle particle effects when lit */}
      {mainLampLit && (
        <div className="absolute inset-0 pointer-events-none z-5">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/60 rounded-full"
              style={{
                left: `${48 + Math.random() * 4}%`,
                top: `${48 + Math.random() * 4}%`,
              }}
              animate={{
                y: [-10, -50],
                x: [0, Math.random() * 20 - 10],
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 1.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};