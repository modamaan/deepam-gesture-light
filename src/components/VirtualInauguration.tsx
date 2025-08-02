import { useState, useCallback, useRef, useEffect } from 'react';
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
  const [deepamPosition, setDeepamPosition] = useState({ x: 640, y: 600 }); // Start from bottom center
  const [showMovingDeepam, setShowMovingDeepam] = useState(false);
  const [mainLampLit, setMainLampLit] = useState(false);
  const [showBlessings, setShowBlessings] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  
  const mainLampRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Main lamp position (center of screen)
  const mainLampPosition = { x: 640, y: 360 };

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
      // Start deepam from bottom center
      setDeepamPosition({ x: rect.width / 2, y: rect.height - 100 });
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
    setDeepamPosition({ x: 640, y: 600 }); // Reset to bottom center
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-mystical-gradient overflow-hidden"
    >
      {/* Background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Deepam in center */}
      <motion.div
        ref={mainLampRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
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

      {/* Camera view in bottom-left corner */}
      <motion.div
        className="absolute bottom-6 left-6 w-80 h-60 rounded-xl overflow-hidden border-2 border-primary/40 shadow-lg z-20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <HandTracking 
          onHandDetected={onHandDetected}
          onCameraReady={onCameraReady}
        />
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Virtual Inauguration Deepam
        </h1>
        <p className="text-lg text-foreground mb-2">
          {state === 'idle' && "Make a fist to light the sacred deepam"}
          {state === 'detecting' && "Move your hand toward the main lamp"}
          {state === 'lit' && "The sacred light has been kindled"}
          {state === 'blessing' && "May the divine light bless you"}
        </p>
        <p className="text-sm text-muted-foreground">
          Position your hand in front of the camera and clench your fist
        </p>
      </motion.div>

      {/* Moving Deepam */}
      <AnimatePresence>
        <MovingDeepam
          position={deepamPosition}
          isVisible={showMovingDeepam}
          targetPosition={mainLampPosition}
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-lg font-medium shadow-sacred"
            >
              Light Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle effects when lit */}
      {mainLampLit && (
        <div className="absolute inset-0 pointer-events-none z-5">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: `${45 + Math.random() * 10}%`,
                top: `${45 + Math.random() * 10}%`,
              }}
              animate={{
                y: [-20, -100],
                x: [0, Math.random() * 40 - 20],
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};