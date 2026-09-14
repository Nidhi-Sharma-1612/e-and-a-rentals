"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const variants = {
  up: { hidden: "translate-y-6 opacity-0", shown: "translate-y-0 opacity-100" },
  scale: { hidden: "scale-95 opacity-0", shown: "scale-100 opacity-100" },
  left: { hidden: "translate-x-8 opacity-0", shown: "translate-x-0 opacity-100" },
  right: { hidden: "-translate-x-8 opacity-0", shown: "translate-x-0 opacity-100" },
};

export default function Reveal({
  children,
  className = "",
  style,
  variant = "up",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: keyof typeof variants;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Default to mounted=false so SSR/no-JS output is always fully visible —
  // this component only hides content as a client-side enhancement, never
  // as the baseline state, so a client without working JS never loses it.
  const [hasMounted, setHasMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Flips the SSR-safe "always visible" baseline into the animated
    // hidden/reveal state once we're on the client — there's no way to
    // derive this from an external system, it's the mount signal itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const show = !hasMounted || visible;
  const v = variants[variant];

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-all duration-700 ease-out ${show ? v.shown : v.hidden} ${className}`}
    >
      {children}
    </div>
  );
}
