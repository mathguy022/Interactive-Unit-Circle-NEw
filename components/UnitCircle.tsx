import React, { useRef, useCallback, useEffect } from 'react';
import type { Angle, Settings } from '../types';
import { KEY_ANGLES } from '../constants';

interface UnitCircleProps {
  angle: Angle;
  onAngleChange: (newAngleRad: number) => void;
  settings: Settings;
}

// Helper to format coordinates with √ for key angles
const formatCoord = (value: number): string => {
  const tolerance = 1e-10;
  const mapping: { [key: number]: string } = {
    [0.5]: '1/2', [-0.5]: '-1/2',
    [Math.sqrt(3)/2]: '√3/2', [-Math.sqrt(3)/2]: '-√3/2',
    [Math.sqrt(2)/2]: '√2/2', [-Math.sqrt(2)/2]: '-√2/2',
    [1]: '1', [-1]: '-1', [0]: '0'
  };
  for (const key in mapping) {
    if (Math.abs(value - parseFloat(key)) < tolerance) {
      return mapping[key];
    }
  }
  return value.toFixed(4);
};

export const UnitCircle: React.FC<UnitCircleProps> = ({ angle, onAngleChange, settings }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const getMousePosition = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const CTM = svg.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };

    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
    } else {
        return { x: 0, y: 0 };
    }

    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d
    };
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const handleInteractionMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    const { x, y } = getMousePosition(e);
    let newAngle = Math.atan2(-y, x);
    if (newAngle < 0) {
      newAngle += 2 * Math.PI;
    }
    onAngleChange(newAngle);
  }, [onAngleChange]);

  const handleInteractionEnd = () => {
    isDragging.current = false;
  };
  
  useEffect(() => {
    const handleMouseUp = () => handleInteractionEnd();
    const handleTouchEnd = () => handleInteractionEnd();

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleInteractionMove);
    window.addEventListener('touchmove', handleInteractionMove);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('touchmove', handleInteractionMove);
    };
  }, [handleInteractionMove]);


  const { rad, cos, sin } = angle;

  // Path for the angle sector
  const largeArcFlag = rad > Math.PI ? 1 : 0;
  const sectorPath = `M 0 0 L 1 0 A 1 1 0 ${largeArcFlag} 1 ${cos} ${-sin} Z`;

  // Reference angle calculation
  const referenceAngle = rad % (Math.PI / 2);
  let referenceAngleStart = 0;
  if(rad > Math.PI / 2 && rad <= Math.PI) referenceAngleStart = Math.PI;
  else if(rad > Math.PI && rad <= 3 * Math.PI / 2) referenceAngleStart = Math.PI;
  else if(rad > 3 * Math.PI / 2 && rad < 2 * Math.PI) referenceAngleStart = 2*Math.PI;


  return (
    <div className="aspect-square w-full h-full touch-none" aria-label="Interactive unit circle">
      <svg
        ref={svgRef}
        viewBox="-1.5 -1.5 3 3"
        className="w-full h-full"
      >
        {/* Angle Sector Shading */}
        <path d={sectorPath} className="fill-yellow-200/40 dark:fill-yellow-500/20" />
        
        {/* Axes */}
        <line x1="-1.5" y1="0" x2="1.5" y2="0" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="0.01" />
        <line x1="0" y1="-1.5" x2="0" y2="1.5" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="0.01" />

        {/* Main Circle */}
        <circle cx="0" cy="0" r="1" fill="none" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.02" />

        {/* Angle Ticks and Labels */}
        {KEY_ANGLES.map(({ deg, rad: angleRad, label }) => {
          const isMajor = deg % 30 === 0 || deg % 45 === 0;
          const x1 = Math.cos(angleRad);
          const y1 = -Math.sin(angleRad);
          const x2 = x1 * (isMajor ? 1.05 : 1.03);
          const y2 = y1 * (isMajor ? 1.05 : 1.03);
          const labelX = x1 * 1.18;
          const labelY = y1 * 1.18;
          return (
            <g key={deg}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} className={isMajor ? "stroke-slate-500 dark:stroke-slate-400" : "stroke-slate-300 dark:stroke-slate-600"} strokeWidth={isMajor ? 0.02 : 0.01} />
              {isMajor && <text x={labelX} y={labelY} fontSize="0.1" textAnchor="middle" alignmentBaseline="middle" className="fill-sky-700 dark:fill-sky-400 font-mono">{label}</text>}
            </g>
          );
        })}
        
        {/* Central Angle Arc */}
        <path
          d={`M 0.2 0 A 0.2 0.2 0 ${rad > Math.PI ? 1 : 0} 1 ${0.2 * cos} ${-0.2 * sin}`}
          fill="none"
          className="stroke-red-500/70"
          strokeWidth="0.02"
        />
        <text x="0.3" y="-0.05" fontSize="0.1" textAnchor="middle" className="fill-red-600 dark:fill-red-400 font-bold">{angle.deg.toFixed(1)}°</text>

        {/* Reference Angle */}
        {settings.showReference && (
          <path
            d={`M ${Math.cos(referenceAngleStart) * 0.3} ${-Math.sin(referenceAngleStart) * 0.3} A 0.3 0.3 0 0 ${rad > referenceAngleStart ? 0:1} ${0.3 * cos} ${-0.3 * sin}`}
            fill="none"
            className="stroke-purple-500/70"
            strokeWidth="0.015"
            strokeDasharray="0.02,0.02"
          />
        )}
        
        {/* Radius line */}
        <line x1="0" y1="0" x2={cos} y2={-sin} className="stroke-slate-500 dark:stroke-slate-400" strokeWidth="0.015" />
        
        {/* Dotted lines to axes */}
        <line x1={cos} y1={-sin} x2={cos} y2="0" className="stroke-sky-500 dark:stroke-sky-400" strokeWidth="0.01" strokeDasharray="0.02" />
        <line x1={cos} y1={-sin} x2="0" y2={-sin} className="stroke-pink-500 dark:stroke-pink-400" strokeWidth="0.01" strokeDasharray="0.02" />
        
        {/* Symmetry Points */}
        {settings.showSymmetry && (
          <>
            <circle cx={-cos} cy={-sin} r="0.03" className="fill-green-500/50" />
            <circle cx={-cos} cy={sin} r="0.03" className="fill-green-500/50" />
            <circle cx={cos} cy={sin} r="0.03" className="fill-green-500/50" />
          </>
        )}

        {/* Draggable Handle */}
        <circle cx={cos} cy={-sin} r="0.05" className="fill-red-500 cursor-pointer" 
          aria-label={`Angle handle at ${angle.deg.toFixed(1)} degrees`}
          onMouseDown={handleInteractionStart}
          onTouchStart={handleInteractionStart}
        />

        {/* Coordinate Label */}
        <text
          x={cos * 1.3}
          y={-sin * 1.3}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="0.12"
          className="font-mono font-semibold fill-slate-800 dark:fill-slate-200"
        >
          ({formatCoord(cos)}, {formatCoord(sin)})
        </text>
      </svg>
    </div>
  );
};
