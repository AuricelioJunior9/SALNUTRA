import { VariableConfig } from "./monitoringData";

export interface FuzzyResult {
  /** Linguistic label */
  label: "Muito Baixo" | "Baixo" | "Normal" | "Alto" | "Muito Alto";
  /** Membership degrees for each fuzzy set (0-1) */
  memberships: {
    muitoBaixo: number;
    baixo: number;
    normal: number;
    alto: number;
    muitoAlto: number;
  };
  /** Dominant membership degree (0-1) */
  degree: number;
}

/**
 * Triangular membership function.
 * Returns membership degree (0-1) for value x in triangle [a, b, c].
 */
function triangular(x: number, a: number, b: number, c: number): number {
  if (x <= a || x >= c) return 0;
  if (x <= b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

/**
 * Left shoulder membership (trapezoidal open on the left).
 * Full membership below a, ramps down from a to b.
 */
function leftShoulder(x: number, a: number, b: number): number {
  if (x <= a) return 1;
  if (x >= b) return 0;
  return (b - x) / (b - a);
}

/**
 * Right shoulder membership (trapezoidal open on the right).
 * Ramps up from a to b, full membership above b.
 */
function rightShoulder(x: number, a: number, b: number): number {
  if (x <= a) return 0;
  if (x >= b) return 1;
  return (x - a) / (b - a);
}

/**
 * Calculates fuzzy membership degrees for a sensor value given its config.
 * 
 * Universe of discourse: [min, max]
 * Fuzzy sets anchored to warningMin/warningMax:
 *   - Muito Baixo: left shoulder ending at warningMin
 *   - Baixo: triangle between critMin and center-low
 *   - Normal: triangle centered between warningMin and warningMax
 *   - Alto: triangle between center-high and critMax
 *   - Muito Alto: right shoulder starting at warningMax
 */
export function calculateFuzzy(value: number, config: VariableConfig): FuzzyResult {
  const { min, max, warningMin, warningMax } = config;
  const range = warningMax - warningMin;
  const center = (warningMin + warningMax) / 2;

  // Anchor points
  const critMin = Math.max(min, warningMin - range * 0.3);
  const critMax = Math.min(max, warningMax + range * 0.3);
  const lowCenter = (critMin + warningMin) / 2;
  const highCenter = (warningMax + critMax) / 2;

  const memberships = {
    muitoBaixo: leftShoulder(value, critMin, warningMin),
    baixo: triangular(value, critMin, lowCenter, center),
    normal: triangular(value, warningMin, center, warningMax),
    alto: triangular(value, center, highCenter, critMax),
    muitoAlto: rightShoulder(value, warningMax, critMax),
  };

  // Find dominant set
  const entries = Object.entries(memberships) as [keyof typeof memberships, number][];
  const dominant = entries.reduce((a, b) => (b[1] > a[1] ? b : a));

  const labelMap: Record<keyof typeof memberships, FuzzyResult["label"]> = {
    muitoBaixo: "Muito Baixo",
    baixo: "Baixo",
    normal: "Normal",
    alto: "Alto",
    muitoAlto: "Muito Alto",
  };

  return {
    label: labelMap[dominant[0]],
    memberships,
    degree: Math.round(dominant[1] * 100) / 100,
  };
}
