import land from "@/lib/land-paths.json";
import { MAP, journeyStops, project } from "@/lib/places";
import type { Story } from "@/lib/types";

const LABELS = [
  { name: "INDIA", lon: 78.2, lat: 16.2 },
  { name: "THAILAND", lon: 101.2, lat: 15.2 },
  { name: "SRI LANKA", lon: 80.6, lat: 7.4 },
  { name: "BORNEO", lon: 114.2, lat: 1.6 },
  { name: "INDIAN OCEAN", lon: 90, lat: 0.2, ocean: true },
];

function shorten(value: string, max: number): string {
  const text = value.trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function JourneyMap({ story }: { story: Story }) {
  const stops = journeyStops(story.events, story.placeId);
  const route = stops.map((stop, index) => `${index === 0 ? "M" : "L"}${stop.x.toFixed(1)} ${stop.y.toFixed(1)}`).join(" ");
  const current = stops[stops.length - 1];
  const photo = story.photos[0];
  const clipId = `portrait-${story.id.replace(/[^a-z0-9-]/gi, "") || "card"}`;
  const scalePx = (2000 / 111.32 / (MAP.east - MAP.west)) * MAP.width;
  let boxX = 24;
  let boxY = 24;
  if (current) {
    boxX = current.x + 28;
    boxY = current.y - 46;
    if (boxX + 188 > MAP.width - 8) boxX = current.x - 188 - 22;
    if (boxY < 10) boxY = 10;
    if (boxY > MAP.height - 78) boxY = MAP.height - 78;
  }

  return (
    <svg
      viewBox={`0 0 ${MAP.width} ${MAP.height}`}
      className="h-full w-full"
      role="img"
      aria-label={
        stops.length
          ? `Journey map for ${story.name || "this story"}, ending in ${current?.name ?? "the region"}`
          : "Map of the Indian Ocean and Southeast Asia"
      }
    >
      <defs>
        <clipPath id="map-frame">
          <rect width={MAP.width} height={MAP.height} rx="28" />
        </clipPath>
        <clipPath id={clipId}>
          {current ? <circle cx={current.x} cy={current.y} r="22" /> : null}
        </clipPath>
      </defs>
      <g clipPath="url(#map-frame)">
        <rect width={MAP.width} height={MAP.height} fill="#d5e3dc" />
        {Array.from({ length: 6 }, (_, index) => {
          const lon = 70 + index * 10;
          const [x] = project(lon, 0);
          return (
            <line
              key={`lon-${lon}`}
              x1={x}
              x2={x}
              y1={0}
              y2={MAP.height}
              stroke="#c5d5ce"
              strokeWidth="1"
            />
          );
        })}
        {Array.from({ length: 4 }, (_, index) => {
          const lat = 15 - index * 8;
          const [, y] = project(80, lat);
          return (
            <line
              key={`lat-${lat}`}
              x1={0}
              x2={MAP.width}
              y1={y}
              y2={y}
              stroke="#c5d5ce"
              strokeWidth="1"
            />
          );
        })}
        <g>
          {land.map((shape) =>
            shape.d ? (
              <path
                key={shape.id}
                d={shape.d}
                fill="#e7f1e8"
                stroke="#b7cdc2"
                strokeWidth="1.1"
              />
            ) : null,
          )}
        </g>
        {(() => {
          const [x, y] = project(73.5, 3.2);
          return (
            <g fill="#edf6f0" stroke="#9db8ad" strokeWidth="1">
              <ellipse cx={x - 6} cy={y + 14} rx="9" ry="4" />
              <ellipse cx={x + 8} cy={y + 18} rx="7" ry="3.2" />
              <ellipse cx={x + 2} cy={y + 24} rx="5" ry="2.4" />
            </g>
          );
        })()}
        {LABELS.map((label) => {
          const [x, y] = project(label.lon, label.lat);
          return (
            <text
              key={label.name}
              x={x}
              y={y}
              textAnchor="middle"
              fill={label.ocean ? "#6d8278" : "#5f756b"}
              fontSize={label.ocean ? 15 : 13}
              letterSpacing={label.ocean ? 3.2 : 2.4}
              fontFamily="Outfit, ui-sans-serif, sans-serif"
            >
              {label.name}
            </text>
          );
        })}
        {route ? (
          <path
            d={route}
            fill="none"
            stroke="#b8883d"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1.5 9"
            className="journey-route"
          />
        ) : null}
        {stops.slice(0, -1).map((stop) => (
          <circle key={stop.id} cx={stop.x} cy={stop.y} r="5" fill="#b8883d" />
        ))}
        {current ? (
          <g>
            <circle cx={current.x} cy={current.y} r="26" fill="#f7f3ea" stroke="#1e4038" strokeWidth="2" />
            {photo ? (
              <image
                href={photo.src}
                x={current.x - 22}
                y={current.y - 22}
                width="44"
                height="44"
                clipPath={`url(#${clipId})`}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <text
                x={current.x}
                y={current.y + 5}
                textAnchor="middle"
                fill="#1e4038"
                fontSize="16"
                fontFamily="Fraunces, Georgia, serif"
              >
                {(story.name || "?").slice(0, 1)}
              </text>
            )}
            <text
              x={current.x}
              y={current.y + 42}
              textAnchor="middle"
              fill="#1e4038"
              fontSize="13"
              fontWeight="600"
              fontFamily="Outfit, ui-sans-serif, sans-serif"
            >
              {shorten(story.name || "Journey", 16)}
            </text>
            <g transform={`translate(${boxX} ${boxY})`}>
              <rect width="186" height="52" rx="14" fill="#f7f3ea" stroke="#e4d7c6" />
              <text
                x="14"
                y="22"
                fill="#1e4038"
                fontSize="11"
                fontWeight="600"
                letterSpacing="0.6"
                fontFamily="Outfit, ui-sans-serif, sans-serif"
              >
                {shorten((story.propertyName || "Mandara Spa").toUpperCase(), 26)}
              </text>
              <text
                x="14"
                y="40"
                fill="#6d6458"
                fontSize="12"
                fontFamily="Source Serif 4, Georgia, serif"
                fontStyle="italic"
              >
                {shorten(story.locationLabel || current.name, 22)}
                {stops.length > 1 ? " · 1 journey" : ""}
              </text>
            </g>
          </g>
        ) : null}
        <g transform="translate(28 418)">
          <line x1="0" x2={scalePx} y1="8" y2="8" stroke="#5f756b" strokeWidth="1.4" />
          <line x1="0" x2="0" y1="3" y2="13" stroke="#5f756b" strokeWidth="1.4" />
          <line x1={scalePx} x2={scalePx} y1="3" y2="13" stroke="#5f756b" strokeWidth="1.4" />
          <text
            x={scalePx / 2}
            y="0"
            textAnchor="middle"
            fill="#5f756b"
            fontSize="11"
            fontFamily="Outfit, ui-sans-serif, sans-serif"
          >
            2000 km
          </text>
        </g>
      </g>
    </svg>
  );
}
