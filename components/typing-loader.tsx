import React from "react";

interface TypingLoaderProps {
  text?: string;
  className?: string;
}

export function TypingLoader({ text = "Memuat data...", className = "" }: TypingLoaderProps) {
  return (
    <div className={`flex items-center justify-center py-12 px-4 ${className}`}>
      <div className="flex items-center gap-3 rounded-full bg-card/50 border border-border/40 px-6 py-4 shadow-sm backdrop-blur-md">
        {/* Animated bouncing dots */}
        <span className="h-3 w-3 animate-[bounce_1s_ease-in-out_0s_infinite] rounded-full bg-[#00458B]" />
        <span className="h-3 w-3 animate-[bounce_1s_ease-in-out_0.15s_infinite] rounded-full bg-[#00458B]/70" />
        <span className="h-3 w-3 animate-[bounce_1s_ease-in-out_0.3s_infinite] rounded-full bg-[#00458B]/40" />
      </div>
    </div>
  );
}
