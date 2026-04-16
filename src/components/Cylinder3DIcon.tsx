interface Cylinder3DIconProps {
  className?: string;
  fillLevel?: number; // 0 to 1
}

export function Cylinder3DIcon({ className = "h-5 w-5", fillLevel = 0.6 }: Cylinder3DIconProps) {
  const bodyTop = 8;
  const bodyBottom = 20;
  const bodyHeight = bodyBottom - bodyTop;
  const liquidTop = bodyBottom - bodyHeight * fillLevel;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body fill (liquid) */}
      <path
        d={`M4 ${liquidTop} v ${bodyBottom - liquidTop} c0 2 3.5 4 8 4 s8-2 8-4 v-${bodyBottom - liquidTop} c0 1.5-3.5 3-8 3s-8-1.5-8-3z`}
        fill="currentColor"
        opacity={0.25}
      />

      {/* Cylinder body */}
      <path
        d="M4 8 v12 c0 2 3.5 4 8 4 s8-2 8-4 V8"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top ellipse */}
      <ellipse
        cx={12}
        cy={8}
        rx={8}
        ry={3.5}
        stroke="currentColor"
        strokeWidth={1.5}
      />

      {/* Liquid level line */}
      {fillLevel > 0 && fillLevel < 1 && (
        <ellipse
          cx={12}
          cy={liquidTop}
          rx={8}
          ry={2.5}
          stroke="currentColor"
          strokeWidth={0.8}
          strokeDasharray="2 2"
          opacity={0.5}
        />
      )}
    </svg>
  );
}
