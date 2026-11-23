"use client";

import { useRef } from "react";
import type { StoryPhoto } from "@/lib/types";

export function FramedPhoto({ photo, className = "" }: { photo: StoryPhoto; className?: string }) {
  const zoom = Math.min(3, Math.max(1, photo.zoom || 1));
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* The frame is the crop. Position and zoom choose which part of the file shows. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full max-w-none object-cover"
        style={{
          objectPosition: `${photo.x}% ${photo.y}%`,
          transform: `scale(${zoom})`,
          transformOrigin: `${photo.x}% ${photo.y}%`,
        }}
      />
    </div>
  );
}

export function PhotoEditor({
  photo,
  onChange,
  onRemove,
}: {
  photo: StoryPhoto;
  onChange: (photo: StoryPhoto) => void;
  onRemove: () => void;
}) {
  const drag = useRef<{ id: number; x: number; y: number; ox: number; oy: number } | null>(null);

  return (
    <div className="space-y-2">
      <div
        className="relative aspect-[5/2] cursor-grab touch-none overflow-hidden rounded-2xl bg-[#e7efe6] active:cursor-grabbing"
        onPointerDown={(event) => {
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, ox: photo.x, oy: photo.y };
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            // The drag still tracks while the pointer stays over the photograph.
          }
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start || start.id !== event.pointerId) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const dx = ((event.clientX - start.x) / rect.width) * 80;
          const dy = ((event.clientY - start.y) / rect.height) * 80;
          onChange({
            ...photo,
            x: Math.min(100, Math.max(0, start.ox - dx)),
            y: Math.min(100, Math.max(0, start.oy - dy)),
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <FramedPhoto photo={photo} className="h-full w-full" />
        <button
          type="button"
          className="absolute top-2 right-2 rounded-full bg-[#f7f3ea]/90 px-2 py-1 text-xs text-[#1e4038]"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
      <div className="flex items-center gap-3 text-xs text-[#5e6b64]">
        <label className="flex min-w-0 flex-1 items-center gap-3">
          <span className="w-10">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={photo.zoom}
            onChange={(event) => onChange({ ...photo, zoom: Number(event.target.value) })}
            className="w-full accent-[#1e4038]"
          />
        </label>
        <button
          type="button"
          className="shrink-0 underline-offset-2 hover:underline"
          onClick={() => onChange({ ...photo, x: 50, y: 32, zoom: 1 })}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
