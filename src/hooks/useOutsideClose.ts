"use client";

import { useEffect, type RefObject } from "react";

type Entry = [RefObject<HTMLElement | null>, (open: boolean) => void];

/**
 * Closes each [ref, setOpen] pair when a pointer-down lands outside its ref,
 * or when Escape is pressed (closes all of them). Shared by every
 * popover-style control on the site (date pickers, guest steppers, the
 * location dropdown) so outside-click and keyboard dismissal stay consistent.
 */
export function useOutsideClose(entries: Entry[]) {
  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      for (const [ref, setOpen] of entries) {
        if (ref.current && !ref.current.contains(target)) setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        for (const [, setOpen] of entries) setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
