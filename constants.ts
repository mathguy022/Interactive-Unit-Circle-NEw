import React from 'react';
import type { KeyAngle } from './types';
import { formatRadiansSimple } from './utils';

export const KEY_ANGLES: KeyAngle[] = [
  { deg: 0, rad: 0, label: '0' },
  { deg: 30, rad: Math.PI / 6, label: formatRadiansSimple(Math.PI / 6) },
  { deg: 45, rad: Math.PI / 4, label: formatRadiansSimple(Math.PI / 4) },
  { deg: 60, rad: Math.PI / 3, label: formatRadiansSimple(Math.PI / 3) },
  { deg: 90, rad: Math.PI / 2, label: formatRadiansSimple(Math.PI / 2) },
  { deg: 120, rad: 2 * Math.PI / 3, label: formatRadiansSimple(2 * Math.PI / 3) },
  { deg: 135, rad: 3 * Math.PI / 4, label: formatRadiansSimple(3 * Math.PI / 4) },
  { deg: 150, rad: 5 * Math.PI / 6, label: formatRadiansSimple(5 * Math.PI / 6) },
  { deg: 180, rad: Math.PI, label: formatRadiansSimple(Math.PI) },
  { deg: 210, rad: 7 * Math.PI / 6, label: formatRadiansSimple(7 * Math.PI / 6) },
  { deg: 225, rad: 5 * Math.PI / 4, label: formatRadiansSimple(5 * Math.PI / 4) },
  { deg: 240, rad: 4 * Math.PI / 3, label: formatRadiansSimple(4 * Math.PI / 3) },
  { deg: 270, rad: 3 * Math.PI / 2, label: formatRadiansSimple(3 * Math.PI / 2) },
  { deg: 300, rad: 5 * Math.PI / 3, label: formatRadiansSimple(5 * Math.PI / 3) },
  { deg: 315, rad: 7 * Math.PI / 4, label: formatRadiansSimple(7 * Math.PI / 4) },
  { deg: 330, rad: 11 * Math.PI / 6, label: formatRadiansSimple(11 * Math.PI / 6) },
];

// Also add non-labeled angles for snapping
const allKeyAnglesDeg = [];
for (let i = 0; i < 360; i += 15) {
    allKeyAnglesDeg.push(i);
}
export const KEY_ANGLES_RADIANS = [...new Set(allKeyAnglesDeg.map(deg => deg * Math.PI / 180))];


// Icons
// FIX: Replaced JSX with React.createElement to be compatible with a .ts file extension, which prevents TypeScript from misinterpreting JSX syntax.
export const SunIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" })
  )
);

export const MoonIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" })
  )
);

export const PlayIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', { className, fill: "currentColor", viewBox: "0 0 20 20" },
    React.createElement('path', { d: "M4.018 15.132A1.25 1.25 0 006 14.188V5.812a1.25 1.25 0 00-1.982-.944L.645 8.556a1.25 1.25 0 000 1.888l3.373 3.688zM7 5.812a1.25 1.25 0 011.982-.944l9.335 3.688a1.25 1.25 0 010 1.888l-9.335 3.688A1.25 1.25 0 017 14.188V5.812z" })
  )
);

export const PauseIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', { className, fill: "currentColor", viewBox: "0 0 20 20" },
    React.createElement('path', { d: "M5.75 4.75a1 1 0 00-1 1v8.5a1 1 0 001 1h1.5a1 1 0 001-1v-8.5a1 1 0 00-1-1H5.75zm7.5 0a1 1 0 00-1 1v8.5a1 1 0 001 1h1.5a1 1 0 001-1v-8.5a1 1 0 00-1-1h-1.5z" })
  )
);

// FIX: Add missing CloseIcon and SendIcon for Chatbot component.
export const CloseIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
  )
);

export const SendIcon: React.FC<{className?: string}> = ({className}) => (
  React.createElement('svg', { className, fill: "currentColor", viewBox: "0 0 20 20" },
    React.createElement('path', { d: "M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" })
  )
);
