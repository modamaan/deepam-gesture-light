import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface HandTrackingProps {
  onHandDetected: (position: { x: number; y: number }, isClenched: boolean) => void;
  onCameraReady: (video: HTMLVideoElement) => void;
}

export const HandTracking = ({ onHandDetected, onCameraReady }: HandTrackingProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const detectClenchedFist = useCallback((landmarks: any[]) => {
    if (!landmarks || landmarks.length === 0) return false;
    
    // Check if fingers are curled (simplified detection)
    // Compare fingertip positions with their respective PIP joints
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky tips
    const fingerPIPs = [6, 10, 14, 18]; // Corresponding PIP joints
    
    let curledFingers = 0;
    
    for (let i = 0; i < fingerTips.length; i++) {
      const tip = landmarks[fingerTips[i]];
      const pip = landmarks[fingerPIPs[i]];
      
      // If fingertip is below PIP joint, finger is likely curled
      if (tip.y > pip.y) {
        curledFingers++;
      }
    }
    
    // Check thumb separately (different anatomy)
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    if (thumbTip.x < thumbIP.x) { // Thumb curled inward
      curledFingers++;
    }
    
    // If most fingers are curled, it's likely a fist
    return curledFingers >= 3;
  }, []);

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      // Get hand center position (palm center)
      const palmCenter = landmarks[9]; // Middle finger MCP joint (palm center)
      const position = {
        x: palmCenter.x * canvas.width,
        y: palmCenter.y * canvas.height
      };
      
      // Detect if hand is clenched
      const isClenched = detectClenchedFist(landmarks);
      
      // Draw hand landmarks for debugging (optional)
      if (isClenched) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      onHandDetected(position, isClenched);
    }
  }, [onHandDetected, detectClenchedFist]);

  useEffect(() => {
    const initializeHandTracking = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      try {
        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });
        
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0, // Faster processing
          minDetectionConfidence: 0.3, // Lower threshold for better detection
          minTrackingConfidence: 0.3  // Lower threshold for smoother tracking
        });
        
        hands.onResults(onResults);
        
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 800, // Higher resolution for better hand visibility
          height: 600
        });
        
        await camera.start();
        setIsInitialized(true);
        onCameraReady(videoRef.current);
        
      } catch (error) {
        console.error('Failed to initialize hand tracking:', error);
      }
    };
    
    initializeHandTracking();
  }, [onResults, onCameraReady]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        autoPlay
        playsInline
        muted
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-lg">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};