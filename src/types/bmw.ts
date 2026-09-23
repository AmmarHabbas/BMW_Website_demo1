export interface CarColor {
  id: string;
  name: string;
  hex: string;
  accentHex?: string;
  finishType: 'Metallic' | 'Frozen Matte' | 'Non-Metallic' | 'BMW Individual';
}

export interface WheelOption {
  id: string;
  name: string;
  size: string;
  type: string;
  finish: string;
  previewUrl?: string;
}

export interface BrakeCaliperOption {
  id: string;
  name: string;
  colorHex: string;
}

export interface SketchfabModelInfo {
  uid: string;
  title: string;
  author: string;
  authorUrl?: string;
  url: string;
  likes?: number;
  views?: number;
}

export interface ModelSpec {
  id: string;
  name: string;
  series: string;
  category: 'BMW M' | 'BMW i' | 'BMW X' | 'Sedans & Coupes';
  tagline: string;
  powerHp: number;
  powerKw: number;
  torqueNm: number;
  acceleration0to100: number; // in seconds
  topSpeedKmH: number;
  rangeKm?: number; // WLTP
  consumption?: string; // kWh/100km or l/100km
  batteryCapacityKwh?: number;
  drivetrain: 'xDrive (All-Wheel Drive)' | 'M xDrive with 2WD mode' | 'sDrive (Rear-Wheel Drive)';
  transmission: string;
  startingPriceEur: number;
  image: string;
  description: string;
  highlights: string[];
  sketchfabModel?: SketchfabModelInfo;
  dimensions: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    wheelbaseMm: number;
    trunkCapacityL: number;
    curbWeightKg: number;
  };
  charging?: {
    maxDcKw: number;
    time10to80Min: number;
    acKw: number;
  };
}

export interface Dealership {
  id: string;
  city: string;
  name: string;
  address: string;
  country: string;
  phone: string;
  hasMStudio: boolean;
  hasElectricLounge: boolean;
}

export interface TestDriveBooking {
  id: string;
  modelId: string;
  modelName: string;
  dealershipId: string;
  dealershipName: string;
  experienceType: 'Track Master' | 'Street Luxury' | 'Electric Discovery';
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  email: string;
  phone: string;
  driversLicenseConfirmed: boolean;
  createdAt: string;
  bookingCode: string;
}
