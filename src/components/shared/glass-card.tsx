import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false, style, ...props }: GlassCardProps) {
  const glassStyle: CSSProperties = {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    padding: "1.5rem",
    ...style,
  };

  return (
    <div
      className={cn(
        glow && "transition-all duration-300 hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
        className
      )}
      style={glassStyle}
      {...props}
    >
      {children}
    </div>
  );
}