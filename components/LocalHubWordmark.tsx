"use client";

export function LocalHubWordmark({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`flex items-baseline select-none ${className}`}
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeight: 700,
        fontSize: "2.5rem",
        letterSpacing: "-0.05em",
        lineHeight: 1
      }}
    >
      <span style={{ color: "#1F2A37" }}>Local</span>
      <span style={{ color: "#B85C38" }}>Hub</span>
    </div>
  );
}
