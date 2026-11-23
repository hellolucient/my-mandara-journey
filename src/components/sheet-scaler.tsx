"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const SHEET_WIDTH = (148 * 96) / 25.4;
const SHEET_HEIGHT = (210 * 96) / 25.4;

export function SheetScaler({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => {
      const width = element.clientWidth;
      setScale(width > 0 ? Math.min(1, width / SHEET_WIDTH) : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} className="sheet-frame w-full min-w-0 max-w-full overflow-hidden">
      <div className="sheet-slot" style={{ height: SHEET_HEIGHT * scale }}>
        <div
          className="sheet-scale"
          style={{ width: SHEET_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
