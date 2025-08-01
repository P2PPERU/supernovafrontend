// src/components/ads/AdPlaceholder.tsx
'use client';

interface AdPlaceholderProps {
  width: number;
  height: number;
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export function AdPlaceholder({ 
  width, 
  height, 
  text, 
  bgColor = '#1a1a1a',
  textColor = '#22c55e',
  className = ''
}: AdPlaceholderProps) {
  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
        width: '100%',
        height: '100%',
        minHeight: height,
      }}
    >
      {/* Patrón de fondo */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${text}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M 20 0 L 0 0 0 20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${text})`} />
      </svg>

      {/* Texto central */}
      <div className="relative z-10 text-center px-4">
        <p 
          className="font-bold text-lg md:text-xl lg:text-2xl"
          style={{ color: textColor }}
        >
          {text}
        </p>
        <p 
          className="text-xs md:text-sm opacity-50 mt-1"
          style={{ color: textColor }}
        >
          {width} × {height}
        </p>
      </div>

      {/* Bordes decorativos */}
      <div 
        className="absolute inset-0 border-2 opacity-10"
        style={{ borderColor: textColor }}
      />
    </div>
  );
}