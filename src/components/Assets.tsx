import React from "react";

// Black Blazer Overlay
export const BlackBlazerSVG: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = "",
  style,
}) => (
  <svg
    viewBox="0 0 200 150"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Suit Jacket Back and Shoulders */}
    <path
      d="M20 150 C25 90, 45 80, 75 76 C82 82, 118 82, 125 76 C155 80, 175 90, 180 150 Z"
      fill="#1A1A1D"
      stroke="#2D2D30"
      strokeWidth="1"
    />
    {/* Left Lapel */}
    <path
      d="M38 100 L75 76 L86 115 L60 150 Z"
      fill="#121214"
      stroke="#2E2E33"
      strokeWidth="1.5"
    />
    {/* Right Lapel */}
    <path
      d="M162 100 L125 76 L114 115 L140 150 Z"
      fill="#121214"
      stroke="#2E2E33"
      strokeWidth="1.5"
    />
    {/* Inner Shirt V-Neck */}
    <path
      d="M75 76 C85 92, 115 92, 125 76 L118 115 L82 115 Z"
      fill="#FFFFFF"
    />
    {/* Inner grey vest outline */}
    <path
      d="M78 88 L122 88 L114 115 L86 115 Z"
      fill="#D1D5DB"
      opacity="0.15"
    />
    {/* Tie (Red Accent Tie) */}
    <path
      d="M97 88 L103 88 L105 130 L100 142 L95 130 Z"
      fill="#991B1B"
    />
    {/* Collar folds */}
    <path d="M75 76 L88 88 L96 88 L90 78 Z" fill="#E5E7EB" />
    {/* Collar folds right */}
    <path d="M125 76 L112 88 L104 88 L110 78 Z" fill="#E5E7EB" />
    {/* Shadows and Creases */}
    <path d="M48 115 C52 135, 58 150, 58 150" stroke="#101012" strokeWidth="2" fill="none" />
    <path d="M152 115 C148 135, 142 150, 142 150" stroke="#101012" strokeWidth="2" fill="none" />
  </svg>
);

// Black Suit Overlay
export const BlackSuitSVG: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = "",
  style,
}) => (
  <svg
    viewBox="0 0 200 150"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Suit Jacket */}
    <path
      d="M20 150 C25 85, 45 75, 75 72 C82 78, 118 78, 125 72 C155 75, 175 85, 180 150 Z"
      fill="#0F172A"
      stroke="#1E293B"
      strokeWidth="1"
    />
    {/* Sharp Formal Lapels */}
    <path d="M35 105 L75 72 L82 118 L55 150 Z" fill="#020617" />
    <path d="M165 105 L125 72 L118 118 L145 150 Z" fill="#020617" />
    {/* Formal Shirt */}
    <path d="M75 72 C85 95, 115 95, 125 72 L115 125 L85 125 Z" fill="#FAFAFA" />
    {/* Dark Blue Tie */}
    <path d="M96 88 L104 88 L107 145 L100 150 L93 145 Z" fill="#1E3A8A" />
    <path d="M95 88 L105 88 L100 98 Z" fill="#1E40AF" />
    {/* Shirt collar tabs */}
    <path d="M75 72 L86 88 L94 88 L85 75 Z" fill="#E2E8F0" />
    <path d="M125 72 L114 88 L106 88 L115 75 Z" fill="#E2E8F0" />
  </svg>
);

// White Shirt Overlay
export const WhiteShirtSVG: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = "",
  style,
}) => (
  <svg
    viewBox="0 0 200 150"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shirt Base */}
    <path
      d="M20 150 C25 90, 45 80, 75 76 C82 82, 118 82, 125 76 C155 80, 175 90, 180 150 Z"
      fill="#F8FAFC"
      stroke="#E2E8F0"
      strokeWidth="1.5"
    />
    {/* Collar Left */}
    <path d="M75 76 L90 102 L100 102 L92 78 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
    {/* Collar Right */}
    <path d="M125 76 L110 102 L100 102 L108 78 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
    {/* Button Placket */}
    <path d="M97 102 L103 102 L103 150 L97 150 Z" fill="#F1F5F9" />
    {/* Buttons */}
    <circle cx="100" cy="115" r="1.5" fill="#94A3B8" />
    <circle cx="100" cy="132" r="1.5" fill="#94A3B8" />
    <circle cx="100" cy="145" r="1.5" fill="#94A3B8" />
  </svg>
);

// Black Tie Overlay
export const BlackTieSVG: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className = "",
  style,
}) => (
  <svg
    viewBox="0 0 200 150"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Knot */}
    <path d="M94 72 L106 72 L103 84 L97 84 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="0.5" />
    {/* Tie Blade */}
    <path d="M96 84 L104 84 L107 142 L100 150 L93 142 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="0.5" />
    {/* Accent Tie Shadow */}
    <path d="M96 84 L100 84 L100 150 L93 142 Z" fill="#0F172A" opacity="0.3" />
  </svg>
);

// High-fidelity SVG Portrait components (Sarah, David, Alex)
// Perfect for showing clean color replacement and blazer styling.
export const SarahPortraitSVG: React.FC<{
  bgColor: string;
  hasBlazer: string; // "None", "Black Blazer", "Black Suit", "White Shirt"
  adjustments: { brightness: number; contrast: number; saturation: number };
}> = ({ bgColor, hasBlazer, adjustments }) => {
  const filterStyle = {
    filter: `brightness(${1 + adjustments.brightness / 100}) contrast(${1 + adjustments.contrast / 100}) saturate(${1 + adjustments.saturation / 100})`,
  };

  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Color */}
      <rect width="200" height="240" fill={bgColor} rx="8" />

      {/* Portrait Content Filtered */}
      <g style={filterStyle}>
        {/* Shadow behind body */}
        <ellipse cx="100" cy="200" rx="60" ry="25" fill="#000000" opacity="0.1" />

        {/* Default Clothing (Soft casual blouse) */}
        <g opacity={hasBlazer === "None" ? 1 : 0}>
          <path
            d="M30 240 C35 185, 60 175, 80 172 C85 178, 115 178, 120 172 C140 175, 165 185, 170 240 Z"
            fill="#EC4899"
          />
          <path d="M80 172 C90 188, 110 188, 120 172 L115 200 L85 200 Z" fill="#FFE4E6" />
        </g>

        {/* Neck */}
        <path d="M85 130 L115 130 L110 176 L90 176 Z" fill="#FDBA74" />
        <path d="M88 130 C100 145, 112 145, 112 130 Z" fill="#F97316" opacity="0.25" />

        {/* Face Shape */}
        <path
          d="M70 95 C70 60, 130 60, 130 95 C130 130, 70 130, 70 95 Z"
          fill="#FED7AA"
        />

        {/* Ears */}
        <circle cx="68" cy="98" r="6" fill="#FDBA74" />
        <circle cx="132" cy="98" r="6" fill="#FDBA74" />

        {/* Hair Back */}
        <path
          d="M62 105 C55 60, 145 60, 138 105 C145 130, 148 180, 135 180 C125 180, 120 120, 100 120 C80 120, 75 180, 65 180 C52 180, 55 130, 62 105 Z"
          fill="#3B2314"
        />

        {/* Hair Front Bangs */}
        <path
          d="M65 85 C75 55, 125 55, 135 85 C132 75, 120 70, 100 75 C80 70, 68 75, 65 85 Z"
          fill="#4A2D1B"
        />

        {/* Eyes */}
        <ellipse cx="88" cy="94" rx="4" ry="2.5" fill="#1C1917" />
        <circle cx="89" cy="93" r="1.2" fill="#FFFFFF" />
        <ellipse cx="112" cy="94" rx="4" ry="2.5" fill="#1C1917" />
        <circle cx="113" cy="93" r="1.2" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path d="M82 89 C86 87, 92 88, 94 91" stroke="#3B2314" strokeWidth="1.5" fill="none" />
        <path d="M118 89 C114 87, 108 88, 106 91" stroke="#3B2314" strokeWidth="1.5" fill="none" />

        {/* Nose */}
        <path d="M98 94 C100 106, 102 106, 102 106" stroke="#EA580C" strokeWidth="1.2" fill="none" />

        {/* Cheeks blush */}
        <ellipse cx="78" cy="104" rx="6" ry="3" fill="#F43F5E" opacity="0.15" />
        <ellipse cx="122" cy="104" rx="6" ry="3" fill="#F43F5E" opacity="0.15" />

        {/* Mouth / Smile */}
        <path d="M92 113 C95 118, 105 118, 108 113 Z" fill="#BE123C" />

        {/* Overlay Clothing Replacement */}
        {hasBlazer === "Black Blazer" && <BlackBlazerSVG style={{ transform: "translate(0px, 140px) scale(1)" }} />}
        {hasBlazer === "Black Suit" && <BlackSuitSVG style={{ transform: "translate(0px, 140px) scale(1)" }} />}
        {hasBlazer === "White Shirt" && <WhiteShirtSVG style={{ transform: "translate(0px, 140px) scale(1)" }} />}
        {hasBlazer === "Black Tie" && (
          <>
            <WhiteShirtSVG style={{ transform: "translate(0px, 140px) scale(1)" }} />
            <BlackTieSVG style={{ transform: "translate(0px, 140px) scale(1)" }} />
          </>
        )}
      </g>
    </svg>
  );
};

export const DavidPortraitSVG: React.FC<{
  bgColor: string;
  hasBlazer: string;
  adjustments: { brightness: number; contrast: number; saturation: number };
}> = ({ bgColor, hasBlazer, adjustments }) => {
  const filterStyle = {
    filter: `brightness(${1 + adjustments.brightness / 100}) contrast(${1 + adjustments.contrast / 100}) saturate(${1 + adjustments.saturation / 100})`,
  };

  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="240" fill={bgColor} rx="8" />

      <g style={filterStyle}>
        <ellipse cx="100" cy="200" rx="62" ry="24" fill="#000000" opacity="0.12" />

        {/* Default Clothing (Casual grey t-shirt) */}
        <g opacity={hasBlazer === "None" ? 1 : 0}>
          <path
            d="M22 240 C28 180, 50 170, 76 166 C82 172, 118 172, 124 166 C150 170, 172 180, 178 240 Z"
            fill="#475569"
          />
          <path d="M76 166 C86 182, 114 182, 124 166 Z" fill="#FFEDD5" />
        </g>

        {/* Neck */}
        <path d="M84 125 L116 125 L112 172 L88 172 Z" fill="#FDBA74" />
        <path d="M84 125 C98 140, 112 140, 116 125 Z" fill="#E05600" opacity="0.22" />

        {/* Face Shape (Male jawline) */}
        <path
          d="M72 90 C72 58, 128 58, 128 90 C128 122, 114 132, 100 132 C86 132, 72 122, 72 90 Z"
          fill="#FFD8A8"
        />

        {/* Hair */}
        <path
          d="M66 84 C62 65, 78 52, 100 52 C122 52, 138 65, 134 84 C132 80, 125 76, 122 78 C118 72, 106 70, 100 74 C94 70, 82 72, 78 78 C75 76, 68 80, 66 84 Z"
          fill="#1C1917"
        />

        {/* Eyes */}
        <ellipse cx="88" cy="92" rx="3.8" ry="2.5" fill="#1C1917" />
        <circle cx="89" cy="91" r="1" fill="#FFFFFF" />
        <ellipse cx="112" cy="92" rx="3.8" ry="2.5" fill="#1C1917" />
        <circle cx="113" cy="91" r="1" fill="#FFFFFF" />

        {/* Eyebrows (Male, thicker) */}
        <path d="M80 84 C85 82, 92 84, 94 87" stroke="#1C1917" strokeWidth="2.2" fill="none" />
        <path d="M120 84 C115 82, 108 84, 106 87" stroke="#1C1917" strokeWidth="2.2" fill="none" />

        {/* Nose */}
        <path d="M97 92 L100 106 L103 106" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Mouth / Smile */}
        <path d="M92 115 Q100 120 108 115" stroke="#9A3412" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Overlay Clothing Replacement */}
        {hasBlazer === "Black Blazer" && <BlackBlazerSVG style={{ transform: "translate(0px, 135px) scale(1)" }} />}
        {hasBlazer === "Black Suit" && <BlackSuitSVG style={{ transform: "translate(0px, 135px) scale(1)" }} />}
        {hasBlazer === "White Shirt" && <WhiteShirtSVG style={{ transform: "translate(0px, 135px) scale(1)" }} />}
        {hasBlazer === "Black Tie" && (
          <>
            <WhiteShirtSVG style={{ transform: "translate(0px, 135px) scale(1)" }} />
            <BlackTieSVG style={{ transform: "translate(0px, 135px) scale(1)" }} />
          </>
        )}
      </g>
    </svg>
  );
};

export const AlexPortraitSVG: React.FC<{
  bgColor: string;
  hasBlazer: string;
  adjustments: { brightness: number; contrast: number; saturation: number };
}> = ({ bgColor, hasBlazer, adjustments }) => {
  const filterStyle = {
    filter: `brightness(${1 + adjustments.brightness / 100}) contrast(${1 + adjustments.contrast / 100}) saturate(${1 + adjustments.saturation / 100})`,
  };

  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="240" fill={bgColor} rx="8" />

      <g style={filterStyle}>
        <ellipse cx="100" cy="202" rx="58" ry="22" fill="#000000" opacity="0.1" />

        {/* Default Clothing (Casual mustard polo shirt) */}
        <g opacity={hasBlazer === "None" ? 1 : 0}>
          <path
            d="M26 240 C32 185, 52 175, 78 170 C84 176, 116 176, 122 170 C148 175, 168 185, 174 240 Z"
            fill="#D97706"
          />
          <path d="M78 170 C88 184, 112 184, 122 170 Z" fill="#FFE4E6" />
        </g>

        {/* Neck */}
        <path d="M84 128 L116 128 L112 172 L88 172 Z" fill="#E9A893" />
        <path d="M84 128 C98 142, 112 142, 116 128 Z" fill="#B24F33" opacity="0.2" />

        {/* Face Shape */}
        <path
          d="M72 92 C72 60, 128 60, 128 92 C128 124, 112 131, 100 131 C88 131, 72 124, 72 92 Z"
          fill="#F5C0B0"
        />

        {/* Hair (Short styled blonde hair) */}
        <path
          d="M68 86 C64 68, 76 54, 100 54 C124 54, 136 68, 132 86 C128 78, 114 74, 100 76 C86 74, 72 78, 68 86 Z"
          fill="#CA8A04"
        />

        {/* Eyes */}
        <ellipse cx="88" cy="93" rx="3.5" ry="2.2" fill="#1C1917" />
        <circle cx="89" cy="92" r="0.8" fill="#FFFFFF" />
        <ellipse cx="112" cy="93" rx="3.5" ry="2.2" fill="#1C1917" />
        <circle cx="113" cy="92" r="0.8" fill="#FFFFFF" />

        {/* Eyebrows */}
        <path d="M81 86 C85 84, 91 85, 93 88" stroke="#CA8A04" strokeWidth="1.8" fill="none" />
        <path d="M119 86 C115 84, 109 85, 107 88" stroke="#CA8A04" strokeWidth="1.8" fill="none" />

        {/* Nose */}
        <path d="M97 93 C100 105, 102 105, 102 105" stroke="#9A3412" strokeWidth="1.2" fill="none" />

        {/* Mouth */}
        <path d="M93 115 Q100 119 107 115" stroke="#9A3412" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Overlay Clothing Replacement */}
        {hasBlazer === "Black Blazer" && <BlackBlazerSVG style={{ transform: "translate(0px, 138px) scale(1)" }} />}
        {hasBlazer === "Black Suit" && <BlackSuitSVG style={{ transform: "translate(0px, 138px) scale(1)" }} />}
        {hasBlazer === "White Shirt" && <WhiteShirtSVG style={{ transform: "translate(0px, 138px) scale(1)" }} />}
        {hasBlazer === "Black Tie" && (
          <>
            <WhiteShirtSVG style={{ transform: "translate(0px, 138px) scale(1)" }} />
            <BlackTieSVG style={{ transform: "translate(0px, 138px) scale(1)" }} />
          </>
        )}
      </g>
    </svg>
  );
};
