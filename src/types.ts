export interface FaceLandmarks {
  faceRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  nose: { x: number; y: number };
  chin: { x: number; y: number };
  shoulders: {
    left: { x: number; y: number };
    right: { x: number; y: number };
  };
}

export interface PhotoAdjustments {
  brightness: number;  // -100 to 100
  contrast: number;    // -100 to 100
  saturation: number;  // -100 to 100
  vibrance: number;    // -100 to 100
  sharpness: number;   // -100 to 100
  warmth: number;      // -100 to 100
  tint: number;        // -100 to 100
  highlights: number;  // -100 to 100
  shadows: number;     // -100 to 100
}

export interface PhotoSize {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  aspectRatio: number;
  description: string;
}

export interface BackgroundColorOption {
  name: string;
  value: string; // CSS color
  hex: string;
}

export interface FlutterCodeFile {
  path: string;
  language: string;
  content: string;
}

export interface RecentPhoto {
  id: string;
  imageSrc: string;
  createdAt: string;
  sizeName: string;
  bgColorName: string;
  hasBlazer: boolean;
}
