import React from 'react';
import { PlayerStats, StatType } from '../types';

interface VFXLayerProps {
  stats: PlayerStats;
}

export const VFXLayer: React.FC<VFXLayerProps> = ({ stats }) => {
  // Sobriety Effect (Blur & Double Vision)
  const sobriety = stats[StatType.SOBRIETY];
  const isGameOver = sobriety <= 0;
  
  // Logic: 
  // If Game Over: Constant heavy blur.
  // If Drunk (< 50): Intermittent "waves" of blur (animation).
  // If Sober: No blur.
  
  const isDrunk = sobriety < 50;
  
  // Calculate max blur strength based on how drunk they are, but cap it so text is readable during gameplay
  // At 0 sobriety (Game Over), blur is 8px.
  // At 49 sobriety, blur pulses up to 2px.
  // At 10 sobriety, blur pulses up to 6px.
  const blurStrength = Math.max(0, (50 - sobriety) / 8); 

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* 
        Blur Layer 
        Using 'backdrop-blur' can be heavy, so we adjust opacity.
        If drunk, we animate opacity to create "waves" of dizziness.
      */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-in-out bg-transparent`}
        style={{ 
          backdropFilter: `blur(${isGameOver ? 10 : blurStrength}px)`,
          // If game over, opacity 1. If drunk, pulse opacity. If sober, opacity 0.
          opacity: isGameOver ? 1 : isDrunk ? undefined : 0,
        }}
      >
        {/* Helper div to handle the pulsing animation separate from the style prop to avoid conflicts */}
         <div className={`w-full h-full ${isDrunk && !isGameOver ? 'animate-pulse' : ''} bg-transparent`}></div>
      </div>

      {/* Double Vision / Ghosting Layer - Only active when pulsing */}
      {isDrunk && (
         <div className={`absolute inset-0 opacity-30 mix-blend-screen bg-transparent ${isGameOver ? '' : 'animate-pulse'}`}
              style={{ transform: 'translateX(3px) translateY(1px)' }}>
            {/* 
               Note: To truly ghost the text is hard without duplicating DOM. 
               Instead we use a subtle chromatic aberration style overlay or just vague displacement feel.
               Here we just keep the layer ready for future potential.
            */}
         </div>
      )}

      {/* Low Health Vignette - Red pulsing edges */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(153,27,27,0.4)_100%)] transition-opacity duration-500 ${stats[StatType.HEALTH] < 40 ? 'opacity-100 animate-pulse' : 'opacity-0'}`}
      />
    </div>
  );
};