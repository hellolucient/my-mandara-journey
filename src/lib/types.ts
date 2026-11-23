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
  "Spa Therapist",
  "Senior Spa Therapist",
  "Massage Therapist",
  "Beauty Therapist",
  "Spa Trainer",
  "Spa Supervisor",
  "Assistant Spa Manager",
  "Spa Manager",
  "Receptionist",
  "Guest Relations",
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

export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export const PHOTO_SIZE_LABEL = "15 MB";

export function photoFromSrc(src: string): StoryPhoto {
  return { src, x: 50, y: 32, zoom: 1 };
}

export function formatEventDate(event: Pick<StoryEvent, "date" | "dateLabel" | "kind">): string {
  if (event.date && /^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
    const [year, month, day] = event.date.split("-").map(Number);
    return `${day} ${MONTHS[month - 1]} ${year}`;
  }
  if (event.kind === "next" && !event.dateLabel.trim()) return "Next";
  return event.dateLabel.trim();
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
