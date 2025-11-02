
import React from 'react';
import type { Angle } from '../types';

interface InfoPanelProps {
  angle: Angle;
}

const InfoCard: React.FC<{ title: string, value: string, colorClass: string }> = ({ title, value, colorClass }) => (
    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-lg font-bold font-mono ${colorClass}`}>{value}</p>
    </div>
);

export const InfoPanel: React.FC<InfoPanelProps> = ({ angle }) => {
  const { rad, cos, sin } = angle;
  const arcLength = rad;
  const sectorArea = 0.5 * rad;
  const quadrant = Math.floor(rad / (Math.PI / 2)) + 1;

  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Live Values</h2>
      <div className="grid grid-cols-2 gap-3">
        <InfoCard title="cos(θ)" value={cos.toFixed(4)} colorClass="text-sky-600 dark:text-sky-400" />
        <InfoCard title="sin(θ)" value={sin.toFixed(4)} colorClass="text-pink-600 dark:text-pink-400" />
        <InfoCard title="Arc Length" value={arcLength.toFixed(4)} colorClass="text-green-600 dark:text-green-400" />
        <InfoCard title="Sector Area" value={sectorArea.toFixed(4)} colorClass="text-purple-600 dark:text-purple-400" />
      </div>
       <div className="text-center bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">Quadrant</p>
          <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200">{quadrant}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-700 dark:text-slate-300">What to Notice</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li><span className="font-semibold text-sky-600 dark:text-sky-400">cos(θ)</span> is the x-coordinate. It's positive in Quadrants 1 & 4.</li>
            <li><span className="font-semibold text-pink-600 dark:text-pink-400">sin(θ)</span> is the y-coordinate. It's positive in Quadrants 1 & 2.</li>
            <li>The circle has a radius of 1, so the hypotenuse is always 1.</li>
            <li>Angles repeat every 360° (2π radians). Notice that 45° and 405° have the same (x, y) point.</li>
        </ul>
      </div>
    </div>
  );
};
