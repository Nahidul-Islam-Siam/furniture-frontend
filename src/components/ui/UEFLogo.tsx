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
        className="relative flex-shrink-0 flex items-center justify-center rounded-lg overflow-hidden"
        style={{ width: dimension.width, height: dimension.height }}
      >
        <Image
          src="/images/uef-emblem.png"
          alt="UEF Emblem"
          width={dimension.width * 2}
          height={dimension.height * 2}
          className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          priority
        />
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none tracking-tight">
          <span
            style={{ color: primaryTextColor }}
            className="text-[14px] sm:text-[15px] font-black tracking-wider uppercase font-heading"
          >
            Unique Engineering
          </span>
          <span
            style={{ color: subtitleTextColor }}
            className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] uppercase mt-0.5"
          >
            &amp; Furniture
          </span>
        </div>
      )}
    </div>
  );
};

export default UEFLogo;
