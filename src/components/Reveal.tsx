"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export default function Reveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Default to mounted=false so SSR/no-JS output is always fully visible —
  // this component only hides content as a client-side enhancement, never
  // as the baseline state, so a client without working JS never loses it.
  const [hasMounted, setHasMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-all duration-700 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
