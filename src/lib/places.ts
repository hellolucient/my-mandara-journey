export const MAP = {
  west: 70,
  east: 121,
  north: 21,
  south: -11,
  width: 800,
  height: 500,
} as const;

export function project(lon: number, lat: number): [number, number] {
  const x = ((lon - MAP.west) / (MAP.east - MAP.west)) * MAP.width;
  const y = ((MAP.north - lat) / (MAP.north - MAP.south)) * MAP.height;
  return [x, y];
}

export type Place = {
  id: string;
  name: string;
  short: string;
  lat: number;
  lon: number;
};

export const PLACES: Place[] = [
  { id: "sanur", name: "Sanur, Bali", short: "Sanur", lat: -8.683, lon: 115.263 },
  { id: "nusa-dua", name: "Nusa Dua, Bali", short: "Nusa Dua", lat: -8.795, lon: 115.232 },
  { id: "ubud", name: "Ubud, Bali", short: "Ubud", lat: -8.506, lon: 115.262 },
  { id: "seminyak", name: "Seminyak, Bali", short: "Seminyak", lat: -8.691, lon: 115.168 },
  { id: "male", name: "Malé, Maldives", short: "Malé", lat: 4.175, lon: 73.509 },
  { id: "vadoo", name: "Adaaran Vadoo, Maldives", short: "Vadoo", lat: 4.02, lon: 73.47 },
  { id: "colombo", name: "Colombo, Sri Lanka", short: "Colombo", lat: 6.927, lon: 79.861 },
  { id: "phuket", name: "Phuket, Thailand", short: "Phuket", lat: 7.88, lon: 98.39 },
  { id: "bangkok", name: "Bangkok, Thailand", short: "Bangkok", lat: 13.756, lon: 100.502 },
  { id: "singapore", name: "Singapore", short: "Singapore", lat: 1.352, lon: 103.82 },
  { id: "kuala-lumpur", name: "Kuala Lumpur", short: "Kuala Lumpur", lat: 3.139, lon: 101.687 },
  { id: "jakarta", name: "Jakarta", short: "Jakarta", lat: -6.208, lon: 106.846 },
];

export function placeById(id: string): Place | undefined {
  return PLACES.find((place) => place.id === id);
}

export type MapStop = {
  id: string;
  x: number;
  y: number;
  name: string;
};

export function journeyStops(
  events: { placeId: string }[],
  currentPlaceId: string,
): MapStop[] {
  const ids = events.map((event) => event.placeId).filter(Boolean);
  if (currentPlaceId) ids.push(currentPlaceId);
  const stops: MapStop[] = [];
  for (const id of ids) {
    const place = placeById(id);
    if (!place) continue;
    const [x, y] = project(place.lon, place.lat);
    const previous = stops[stops.length - 1];
    if (previous && Math.hypot(previous.x - x, previous.y - y) < 16) continue;
    stops.push({ id, x, y, name: place.short });
  }
  return stops;
}
