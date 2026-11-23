export const EVENT_KINDS = ["training", "posting", "achievement", "next"] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

export const PRONOUNS = ["she", "he", "they"] as const;
export type Pronoun = (typeof PRONOUNS)[number];

export type StoryEvent = {
  id: string;
  kind: EventKind;
  dateLabel: string;
  title: string;
  detail: string;
  placeId: string;
  placeLabel: string;
};

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
  photos: string[];
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
