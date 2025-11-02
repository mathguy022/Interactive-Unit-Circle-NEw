
export interface Angle {
  rad: number;
  deg: number;
  cos: number;
  sin: number;
}

export interface Settings {
  snap: boolean;
  animate: boolean;
  speed: number;
  showSymmetry: boolean;
  showReference: boolean;
}

export interface KeyAngle {
  deg: number;
  rad: number;
  label: string;
}
