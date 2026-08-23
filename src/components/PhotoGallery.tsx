"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";

export default function PhotoGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, images.length]);

  const main = images[0];
  const rest = images.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:h-[420px]">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="relative col-span-4 row-span-2 h-64 md:col-span-2 md:h-full"
        >
          <Image src={main} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" priority />
        </button>
        {rest.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => openAt(i + 1)}
            className="relative col-span-1 row-span-1 hidden h-full md:block"
          >
            <Image src={src} alt={`${alt} — photo ${i + 2}`} fill sizes="25vw" className="object-cover" />
            {i === rest.length - 1 && images.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/50 text-sm font-bold text-cream">
                +{images.length - 5} more
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => openAt(0)}
        className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink md:hidden"
      >
        <Images className="h-4 w-4" strokeWidth={2} />
        View all {images.length} photos
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/95">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-semibold text-cream">
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10"
            >
              <X className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={images[index]}
              alt={`${alt} — photo ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur-sm transition-colors hover:bg-cream/20"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur-sm transition-colors hover:bg-cream/20"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
