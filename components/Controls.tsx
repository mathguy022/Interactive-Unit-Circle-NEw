
import React from 'react';
import type { Angle, Settings } from '../types';
import { formatRadiansSimple } from '../utils';
import { SunIcon, MoonIcon, PlayIcon, PauseIcon } from '../constants';

interface ControlsProps {
  angle: Angle;
  onAngleChange: (newAngleRad: number) => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const ToggleButton: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className="block bg-slate-300 dark:bg-slate-600 w-12 h-6 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-6 bg-sky-500' : ''}`}></div>
        </div>
    </label>
);

export const Controls: React.FC<ControlsProps> = ({
  angle,
  onAngleChange,
  settings,
  onSettingsChange,
  isDarkMode,
  onDarkModeToggle
}) => {
    
  const handleDegreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deg = parseFloat(e.target.value);
    if (!isNaN(deg)) {
      onAngleChange(deg * Math.PI / 180);
    }
  };

  const handleRadianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let radStr = e.target.value.toLowerCase().replace('π', 'pi');
    try {
        if(radStr.includes('pi')){
            radStr = radStr.replace('pi', `*${Math.PI}`);
            if(radStr.startsWith('*')) radStr = radStr.substring(1);
        }
        // A slightly safer eval for simple math expressions
        const rad = new Function('return ' + radStr)();
        if(!isNaN(rad) && typeof rad === 'number'){
            onAngleChange(rad);
        }
    } catch(error){
        // Ignore invalid input
    }
  };


  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Controls</h2>
            <button onClick={onDarkModeToggle} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle dark mode">
                {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-700" />}
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="degrees" className="block text-sm font-medium mb-1">Degrees (°)</label>
                <input 
                    type="number" 
                    id="degrees"
                    value={angle.deg.toFixed(2)} 
                    onChange={handleDegreeChange}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
                />
            </div>
            <div>
                <label htmlFor="radians" className="block text-sm font-medium mb-1">Radians (rad)</label>
                <input 
                    type="text" 
                    id="radians"
                    value={formatRadiansSimple(angle.rad)} 
                    onChange={handleRadianChange}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
                    placeholder="e.g. pi/2 or 1.57"
                />
            </div>
        </div>

        <div className="space-y-3 pt-2">
            <ToggleButton 
                checked={settings.snap} 
                onChange={(snap) => onSettingsChange({...settings, snap})} 
                label="Snap to Key Angles" 
            />
            <ToggleButton 
                checked={settings.showReference} 
                onChange={(showReference) => onSettingsChange({...settings, showReference})} 
                label="Show Reference Angle" 
            />
            <ToggleButton 
                checked={settings.showSymmetry} 
                onChange={(showSymmetry) => onSettingsChange({...settings, showSymmetry})} 
                label="Show Symmetry Points" 
            />
        </div>

        <div className="flex items-center gap-4 pt-2">
            <button
                onClick={() => onSettingsChange({...settings, animate: !settings.animate})}
                className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition"
                aria-label={settings.animate ? 'Pause animation' : 'Play animation'}
            >
                {settings.animate ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className="flex-grow">
                <label htmlFor="speed" className="block text-sm font-medium mb-1">Animation Speed</label>
                <input
                    type="range"
                    id="speed"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={settings.speed}
                    onChange={(e) => onSettingsChange({...settings, speed: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
    </div>
  );
};
