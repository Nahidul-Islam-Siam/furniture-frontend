import React from "react";
import Image from "next/image";

interface UEFLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light" | "white";
  showText?: boolean;
  layout?: "horizontal" | "full";
}

export const UEFLogo: React.FC<UEFLogoProps> = ({
  className = "",
  size = "md",
  variant = "dark",
  showText = true,
  layout = "horizontal",
}) => {
  const iconSizes = {
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 56, height: 56 },
  };

  const isLight = variant === "light" || variant === "white";
  const primaryTextColor = isLight ? "#ffffff" : "#0f172a";
  const subtitleTextColor = isLight ? "#38bdf8" : "#0284c7";
  const dimension = iconSizes[size];

  // If full stacked layout is requested (e.g. In splash/modal/cards)
  if (layout === "full") {
    const fullHeights = { sm: 40, md: 54, lg: 72 };
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <Image
          src="/images/logo.png"
          alt="Unique Engineering &amp; Furniture"
          width={fullHeights[size] * 1.8}
          height={fullHeights[size]}
          className="h-auto object-contain drop-shadow-sm"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Authentic UEF Gear & Monogram Emblem */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden shadow-xs"
        style={{ width: dimension.width, height: dimension.height }}
      >
        <Image
          src="/logo/916421240_1675591394297447_7907002081699647637_n.jpg"
          alt="UEF Emblem"
          width={dimension.width * 2}
          height={dimension.height * 2}
          className="w-full h-full object-cover filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105 rounded-md"
          priority
        />
      </div>

      {/* Brand Name Typography matching reference mockup */}
      {showText && (
        <div className="flex flex-col justify-center leading-[1.05] tracking-tight">
          <span
            style={{ color: primaryTextColor }}
            className="text-[13px] sm:text-[14px] font-black tracking-wider uppercase font-heading"
          >
            UNIQUE
          </span>
          <span
            style={{ color: primaryTextColor }}
            className="text-[12px] sm:text-[13px] font-black tracking-wider uppercase font-heading"
          >
            ENGINEERING
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase text-[#0ea5e9]"
          >
            &amp; FURNITURE
          </span>
        </div>
      )}
    </div>
  );
};

export default UEFLogo;
