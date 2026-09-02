type ShapeDividerProps = {
  variant?: "wave" | "tilt" | "curve" | "peaks" | "blob";
  flip?: boolean;
  position?: "top" | "bottom";
  className?: string;
};

const paths: Record<NonNullable<ShapeDividerProps["variant"]>, string> = {
  wave: "M0,60 C240,10 480,100 720,80 C960,60 1200,10 1440,50 L1440,0 L0,0 Z",
  tilt: "M0,100 L1440,0 L1440,0 L0,0 Z",
  curve: "M0,0 C480,100 960,100 1440,0 L1440,0 L0,0 Z",
  peaks: "M0,80 L180,20 L360,70 L540,15 L720,60 L900,10 L1080,65 L1260,25 L1440,55 L1440,0 L0,0 Z",
  blob: "M0,45 C160,90 320,0 480,35 C640,70 800,10 960,40 C1120,70 1280,20 1440,45 L1440,0 L0,0 Z",
};

/**
 * A decorative SVG divider dropped between sections instead of a plain
 * straight edge. `position="bottom"` flips it to sit at the bottom of a
 * section (mirroring the path) rather than the top.
 */
export default function ShapeDivider({
  variant = "wave",
  flip = false,
  position = "top",
  className = "",
}: ShapeDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-10 h-10 overflow-hidden md:h-16 ${
        position === "top" ? "top-0" : "bottom-0"
      } ${className}`}
    >
      <svg
        className={`h-full w-full ${position === "bottom" ? "rotate-180" : ""} ${flip ? "-scale-x-100" : ""}`}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path d={paths[variant]} fill="currentColor" />
      </svg>
    </div>
  );
}
