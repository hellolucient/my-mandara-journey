export const EVENT_KINDS = ["training", "posting", "achievement", "next"] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

export const PRONOUNS = ["she", "he", "they"] as const;
export type Pronoun = (typeof PRONOUNS)[number];

export type StoryPhoto = {
  src: string;
  x: number;
  y: number;
  zoom: number;
};

export type StoryEvent = {
  id: string;
  kind: EventKind;
  date: string;
  dateLabel: string;
  title: string;
  detail: string;
  placeId: string;
  placeLabel: string;
};

export const ROLES = [
  "Therapist",
  "Senior Therapist",
  "Spa Supervisor",
  "Assistant Spa Manager",
  "Spa Manager",
  "Receptionist",
] as const;

export type Story = {
  id: string;
  managerId: string;
  name: string;
  role: string;
  propertyName: string;
  locationLabel: string;
  placeId: string;
  sinceLabel: string;
  pronoun: Pronoun;
  quote: string;
  narrative: string;
  photos: StoryPhoto[];
  events: StoryEvent[];
  updatedAt: string;
};

export type Manager = {
  id: string;
  username: string;
  displayName: string;
  propertyName: string;
};

export function blankEvent(kind: EventKind = "training"): StoryEvent {
  return {
    id: crypto.randomUUID(),
    kind,
    date: "",
    dateLabel: "",
    title: "",
    detail: "",
    placeId: "",
    placeLabel: "",
  };
}

export const KIND_LABEL: Record<EventKind, string> = {
  training: "Training",
  posting: "At work",
  achievement: "Achievement",
  next: "What's next",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MAX_PHOTOS = 3;
/** Longest edge kept for the wall card. About 70 mm at 300 dpi, larger than a tile. */
export const PHOTO_MAX_EDGE = 900;
/** Stored data-URL ceiling: roughly 300 KB of JPEG, enough for a sharp print at this size. */
export const MAX_PHOTO_DATA_URL = 420_000;
export const PHOTO_SIZE_LABEL = "300 KB";

export function photoFromSrc(src: string): StoryPhoto {
  return { src, x: 50, y: 32, zoom: 1 };
}

export function formatEventDate(
  event: Pick<StoryEvent, "date" | "dateLabel" | "kind">,
  length: "short" | "long" = "short",
): string {
  const months = length === "long" ? MONTHS_LONG : MONTHS;
  const match = event.date?.match(/^(\d{4})-(\d{2})/);
  if (match) {
    const month = Number(match[2]);
    if (month >= 1 && month <= 12) return `${months[month - 1]} ${match[1]}`;
  }
  const label = event.dateLabel.trim().replace(/^\d{1,2}\s+(?=[A-Za-z])/, "");
  if (event.kind === "next" && !label) return "Next";
  return label;
}

export function eventMonth(event: StoryEvent): StoryEvent {
  const date = toMonthValue(event.date);
  if (!date) return { ...event, date: "" };
  return { ...event, date, dateLabel: formatEventDate({ ...event, date, dateLabel: "" }) };
}

export function formatSince(value: string): string {
  const match = value.trim().match(/^(\d{4})-(\d{2})$/);
  if (!match) return value.trim();
  const month = Number(match[2]);
  if (month < 1 || month > 12) return value.trim();
  return `${MONTHS_LONG[month - 1]} ${match[1]}`;
}

export function toMonthValue(value: string): string {
  const iso = value.trim().match(/^(\d{4})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}`;
  const named = value.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (!named) return "";
  const index = MONTHS_LONG.findIndex((month) => month.toLowerCase() === named[1].toLowerCase());
  if (index < 0) {
    const short = MONTHS.findIndex((month) => month.toLowerCase() === named[1].toLowerCase());
    if (short < 0) return "";
    return `${named[2]}-${String(short + 1).padStart(2, "0")}`;
  }
  return `${named[2]}-${String(index + 1).padStart(2, "0")}`;
}

export const DOT_COLORS = [
  "#1d4638",
  "#c4784a",
  "#c4922e",
  "#6f9478",
  "#5c4d7a",
  "#2f6f62",
  "#8d4a4a",
  "#3d6b8a",
];
