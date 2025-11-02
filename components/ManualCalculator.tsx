import React, { useState } from 'react';

interface ManualCalculatorProps {
  onAngleCalculate: (angleRad: number) => void;
}

interface CalcResult {
  sin: string;
  cos: string;
  tan: string;
}

export const ManualCalculator: React.FC<ManualCalculatorProps> = ({ onAngleCalculate }) => {
  const [inputValue, setInputValue] = useState<string>('45');
  const [mode, setMode] = useState<'deg' | 'rad'>('deg');
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    const angleRad = mode === 'deg' ? value * (Math.PI / 180) : value;
    
    const sin = Math.sin(angleRad);
    const cos = Math.cos(angleRad);
    let tan = Math.tan(angleRad);

    // Handle tangent for 90, 270 degrees etc. where cos is 0
    if (Math.abs(cos) < 1e-10) {
        tan = Infinity;
    }

    setResult({
      sin: sin.toFixed(4),
      cos: cos.toFixed(4),
      tan: isFinite(tan) ? tan.toFixed(4) : 'Undefined',
    });

    onAngleCalculate(angleRad);
  };

  return (
    <div className="w-full p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Trig Calculator</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Input and Mode Toggle */}
        <div className="flex-grow w-full sm:w-auto">
          <label htmlFor="manual-angle" className="block text-sm font-medium mb-1">Enter Angle</label>
          <div className="flex">
            <input
              type="number"
              id="manual-angle"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-l-md bg-white dark:bg-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
              placeholder="e.g. 45 or 1.57"
            />
            <div className="flex items-center border border-l-0 border-slate-300 dark:border-slate-600 rounded-r-md">
              <button 
                onClick={() => setMode('deg')} 
                className={`px-3 py-2 text-sm transition-colors ${mode === 'deg' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                DEG
              </button>
              <button 
                onClick={() => setMode('rad')}
                className={`px-3 py-2 text-sm transition-colors rounded-r-md ${mode === 'rad' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              >
                RAD
              </button>
            </div>
          </div>
        </div>
        
        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full sm:w-auto px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all"
        >
          Calculate
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">sin(θ)</p>
                <p className="text-lg font-bold font-mono text-pink-600 dark:text-pink-400">{result.sin}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">cos(θ)</p>
                <p className="text-lg font-bold font-mono text-sky-600 dark:text-sky-400">{result.cos}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">tan(θ)</p>
                <p className="text-lg font-bold font-mono text-green-600 dark:text-green-400">{result.tan}</p>
            </div>
        </div>
      )}
    </div>
  );
};