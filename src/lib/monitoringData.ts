export interface VariableConfig {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  warningMin: number;
  warningMax: number;
  icon: string;
  category: "salmoura" | "motor";
}

export const DEFAULT_VARIABLES: VariableConfig[] = [
  { id: "tds", name: "TDS", unit: "ppm", min: 0, max: 300000, warningMin: 50000, warningMax: 280000, icon: "Droplets", category: "salmoura" },
  { id: "ph", name: "pH", unit: "", min: 0, max: 14, warningMin: 6.5, warningMax: 8.5, icon: "FlaskConical", category: "salmoura" },
  { id: "temp_sal", name: "Temperatura", unit: "°C", min: 0, max: 100, warningMin: 15, warningMax: 45, icon: "Thermometer", category: "salmoura" },
  { id: "na", name: "Na⁺", unit: "mg/L", min: 0, max: 150000, warningMin: 30000, warningMax: 120000, icon: "Atom", category: "salmoura" },
  { id: "ca", name: "Ca²⁺", unit: "mg/L", min: 0, max: 5000, warningMin: 100, warningMax: 4000, icon: "Circle", category: "salmoura" },
  { id: "mg", name: "Mg²⁺", unit: "mg/L", min: 0, max: 10000, warningMin: 200, warningMax: 8000, icon: "Hexagon", category: "salmoura" },
  { id: "nivel", name: "Nível", unit: "%", min: 0, max: 100, warningMin: 20, warningMax: 95, icon: "Cylinder", category: "salmoura" },
  { id: "vibracao", name: "Vibração", unit: "m/s²", min: 0, max: 20, warningMin: 0, warningMax: 10, icon: "Activity", category: "motor" },
  
  { id: "corrente", name: "Corrente Elétrica", unit: "A", min: 0, max: 100, warningMin: 5, warningMax: 80, icon: "Zap", category: "motor" },
  { id: "temp_motor", name: "Temperatura", unit: "°C", min: 0, max: 150, warningMin: 20, warningMax: 90, icon: "Thermometer", category: "motor" },
];

export function generateValue(v: VariableConfig): number {
  const center = (v.warningMin + v.warningMax) / 2;
  const range = (v.warningMax - v.warningMin) / 2;
  const val = center + (Math.random() - 0.5) * range * 2.5;
  return Math.round(Math.max(v.min, Math.min(v.max, val)) * 100) / 100;
}

export type Status = "normal" | "warning" | "critical";

export function getStatus(value: number, config: VariableConfig): Status {
  if (value < config.warningMin || value > config.warningMax) {
    const critMin = config.warningMin - (config.warningMax - config.warningMin) * 0.3;
    const critMax = config.warningMax + (config.warningMax - config.warningMin) * 0.3;
    if (value < critMin || value > critMax) return "critical";
    return "warning";
  }
  return "normal";
}
