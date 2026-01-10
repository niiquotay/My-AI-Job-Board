
import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top', className = "" }) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    // Start the exactly 2.8 second countdown as requested
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, 2800);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3"
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className={`absolute z-[300] w-64 p-4 rounded-2xl bg-[#06213f] border border-[#F0C927]/40 shadow-[0_0_40px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in-95 duration-300 pointer-events-none ${positionClasses[position]}`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F0C927] animate-pulse shadow-[0_0_8px_#F0C927]"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F0C927]">System Insight</p>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              {text}
            </p>
          </div>
          {/* Enhanced Pointer Arrow */}
          <div className={`absolute border-[6px] border-transparent ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-[#06213f]' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-[#06213f]' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-[#06213f]' :
            'right-full top-1/2 -translate-y-1/2 border-r-[#06213f]'
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
