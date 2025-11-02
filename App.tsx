import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UnitCircle } from './components/UnitCircle';
import { Controls } from './components/Controls';
import { InfoPanel } from './components/InfoPanel';
import { ManualCalculator } from './components/ManualCalculator';
import type { Angle, Settings } from './types';
import { KEY_ANGLES_RADIANS } from './constants';

const App: React.FC = () => {
  const [angleRad, setAngleRad] = useState<number>(Math.PI / 4);
  const [isDarkMode, setDarkMode] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    snap: true,
    animate: false,
    speed: 1,
    showSymmetry: false,
    showReference: false,
  });

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      setAngleRad(prevAngle => {
        const newAngle = prevAngle + (settings.speed * deltaTime * 0.001);
        return newAngle % (2 * Math.PI);
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [settings.speed]);

  useEffect(() => {
    if (settings.animate) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if(requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        previousTimeRef.current = undefined;
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [settings.animate, animate]);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAngleChange = (newAngleRad: number) => {
    let finalAngle = newAngleRad;
    if (settings.snap) {
      const snapThreshold = Math.PI / 36; // 5 degrees
      for (const keyAngle of KEY_ANGLES_RADIANS) {
        if (Math.abs(keyAngle - newAngleRad) < snapThreshold) {
          finalAngle = keyAngle;
          break;
        }
      }
    }
    setAngleRad(finalAngle);
  };

  const handleCalculatorAngleChange = (newAngleRad: number) => {
    // Stop animation if it's running, as we are setting a static angle.
    setSettings(prev => ({...prev, animate: false})); 
    setAngleRad(newAngleRad);
  };
  
  const angleDeg = angleRad * 180 / Math.PI;
  const angle: Angle = {
      rad: angleRad,
      deg: angleDeg > 0 ? angleDeg : angleDeg + 360,
      cos: Math.cos(angleRad),
      sin: Math.sin(angleRad),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans transition-colors duration-300">
      <header className="w-full max-w-7xl mx-auto text-center mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 dark:text-sky-400">Interactive Unit Circle Explorer (By Ahmed Said)</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Drag the handle, edit the inputs, or press play to explore the magic of trigonometry.</p>
      </header>
      
      <main className="w-full flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
        <div className="flex-grow lg:w-2/3 flex flex-col gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <UnitCircle angle={angle} onAngleChange={handleAngleChange} settings={settings} />
          </div>
          <ManualCalculator onAngleCalculate={handleCalculatorAngleChange} />
        </div>
        
        <div className="lg:w-1/3 flex flex-col gap-4">
          <Controls 
            angle={angle} 
            onAngleChange={setAngleRad}
            settings={settings}
            onSettingsChange={setSettings}
            isDarkMode={isDarkMode}
            onDarkModeToggle={() => setDarkMode(!isDarkMode)}
          />
          <InfoPanel angle={angle} />
        </div>
      </main>

      <footer className="text-center mt-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Built with React, TypeScript, and Tailwind CSS. A tool for visual learners.</p>
      </footer>
    </div>
  );
};

export default App;