import React from "react";

interface UEFLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "white";
  showText?: boolean;
}

export const UEFLogo: React.FC<UEFLogoProps> = ({
  className = "",
  size = "md",
  variant = "dark",
  showText = true,
}) => {
  const iconSizes = {
    sm: 32,
    md: 44,
    lg: 56,
  };

  const isLight = variant === "light" || variant === "white";
  const primaryTextColor = isLight ? "#ffffff" : "#0f172a";
  const subtitleTextColor = isLight ? "#94a3b8" : "#475569";
  const gearColor = isLight ? "#38bdf8" : "#0284c7";
  const badgeBg = isLight ? "#0f172a" : "#0b1528";

  const dimension = iconSizes[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Mechanical Gear & UEF Badge */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="gearGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <radialGradient id="badgeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor={badgeBg} />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Outer CNC Gear Teeth (12 precision teeth) */}
        <g fill="url(#gearGradient)">
          {/* Circular Gear Body */}
          <circle cx="50" cy="50" r="46" fill="url(#gearGradient)" />
          {/* 12 Outer Gear Teeth */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <rect
              key={deg}
              x="44"
              y="0"
              width="12"
              height="8"
              rx="2"
              transform={`rotate(${deg} 50 50)`}
              fill="url(#gearGradient)"
            />
          ))}
        </g>

        {/* Inner Dark Engineered Core */}
        <circle cx="50" cy="50" r="38" fill="url(#badgeGlow)" stroke="#38bdf8" strokeWidth="2" />
        
        {/* Subtle Laser Crosshair Mark */}
        <line x1="18" y1="50" x2="28" y2="50" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="72" y1="50" x2="82" y2="50" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="50" y1="18" x2="50" y2="28" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="50" y1="72" x2="50" y2="82" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* UEF Bold Typography inside Core */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.08em"
        >
          UEF
        </text>

        {/* Small Tech Arc */}
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke="#0ea5e9"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          strokeOpacity="0.7"
        />
      </svg>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            style={{ color: primaryTextColor }}
            className="text-sm sm:text-base font-black tracking-tight font-heading uppercase"
          >
            Unique Engineering
          </span>
          <span
            style={{ color: subtitleTextColor }}
            className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-cyan-400"
          >
            &amp; Furniture
          </span>
        </div>
      )}
    </div>
  );
};

export default UEFLogo;
