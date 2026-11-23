import { sql } from "@/lib/db";
import { placeById } from "@/lib/places";
import {
  EVENT_KINDS,
  PRONOUNS,
  type EventKind,
  type Pronoun,
  type Story,
  type StoryEvent,
} from "@/lib/types";

type StoryRow = {
  id: string;
  manager_id: string;
  name: string;
  role: string;
  property_name: string;
  location_label: string;
  place_id: string;
  since_label: string;
  pronoun: string;
  quote: string;
  narrative: string;
  photos: unknown;
  events: unknown;
  updated_at: Date | string;
};

function asArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function cleanPhotos(value: unknown): string[] {
  const photos: string[] = [];
  for (const item of asArray(value)) {
    if (typeof item !== "string") continue;
    const sample = /^\/sample\/[a-z0-9-]+\.svg$/.test(item);
    const upload =
      item.startsWith("data:image/jpeg;base64,") || item.startsWith("data:image/png;base64,");
    if (!sample && !upload) continue;
    if (upload && item.length > 1_400_000) continue;
    photos.push(item);
    if (photos.length === 4) break;
  }
  return photos;
}

function cleanEvents(value: unknown): StoryEvent[] {
  const events: StoryEvent[] = [];
  for (const item of asArray(value)) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const kind = EVENT_KINDS.includes(record.kind as EventKind)
      ? (record.kind as EventKind)
      : "training";
    const placeId = typeof record.placeId === "string" && placeById(record.placeId) ? record.placeId : "";
    const title = clip(record.title, 180);
    const detail = clip(record.detail, 180);
    const dateLabel = clip(record.dateLabel, 40);
    const placeLabel = clip(record.placeLabel, 80);
    if (!title && !detail && !dateLabel) continue;
    events.push({
      id: typeof record.id === "string" && record.id.length < 80 ? record.id : crypto.randomUUID(),
      kind,
      dateLabel,
      title,
      detail,
      placeId,
      placeLabel,
    });
    if (events.length === 8) break;
  }
  return events;
}

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function toStory(row: StoryRow): Story {
  const pronoun = PRONOUNS.includes(row.pronoun as Pronoun) ? (row.pronoun as Pronoun) : "she";
  const updated =
    row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at ?? "");
  return {
    id: row.id,
    managerId: row.manager_id,
    name: row.name,
    role: row.role,
    propertyName: row.property_name,
    locationLabel: row.location_label,
    placeId: row.place_id,
    sinceLabel: row.since_label,
    pronoun,
    quote: row.quote,
    narrative: row.narrative,
    photos: cleanPhotos(row.photos),
    events: cleanEvents(row.events),
    updatedAt: updated,
  };
}

const STORY_COLUMNS = `id, manager_id, name, role, property_name, location_label, place_id,
  since_label, pronoun, quote, narrative, photos, events, updated_at`;

export async function listStories(managerId: string): Promise<Story[]> {
  const rows = await sql<StoryRow>(
    `select ${STORY_COLUMNS} from stories where manager_id = $1 order by updated_at desc`,
    [managerId],
  );
  return rows.map(toStory);
}

export async function getStory(id: string, managerId: string): Promise<Story | null> {
  const rows = await sql<StoryRow>(
    `select ${STORY_COLUMNS} from stories where id = $1 and manager_id = $2`,
    [id, managerId],
  );
  return rows[0] ? toStory(rows[0]) : null;
}

export type StoryInput = {
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
};

export function parseStoryForm(formData: FormData): { input: StoryInput } | { error: string } {
  const name = clip(formData.get("name"), 80);
  if (!name) return { error: "Add the person's name." };
  const pronounValue = String(formData.get("pronoun") ?? "she");
  const pronoun = PRONOUNS.includes(pronounValue as Pronoun) ? (pronounValue as Pronoun) : "she";
  const placeIdRaw = String(formData.get("placeId") ?? "");
  let photos: string[] = [];
  let events: StoryEvent[] = [];
  try {
    photos = cleanPhotos(JSON.parse(String(formData.get("photos") ?? "[]")));
  } catch {
    return { error: "Those photographs could not be read. Try them again." };
  }
  try {
    events = cleanEvents(JSON.parse(String(formData.get("events") ?? "[]")));
  } catch {
    return { error: "The timeline could not be read. Try again." };
  }
  return {
    input: {
      name,
      role: clip(formData.get("role"), 80) || "Spa Therapist",
      propertyName: clip(formData.get("propertyName"), 80),
      locationLabel: clip(formData.get("locationLabel"), 80),
      placeId: placeById(placeIdRaw) ? placeIdRaw : "",
      sinceLabel: clip(formData.get("sinceLabel"), 40),
      pronoun,
      quote: clip(formData.get("quote"), 400),
      narrative: clip(formData.get("narrative"), 1200),
      photos,
      events,
    },
  };
}

export async function insertStory(managerId: string, input: StoryInput): Promise<string> {
  const id = crypto.randomUUID();
  await sql(
    `insert into stories (
      id, manager_id, name, role, property_name, location_label, place_id,
      since_label, pronoun, quote, narrative, photos, events
    ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb)`,
    [
      id,
      managerId,
      input.name,
      input.role,
      input.propertyName,
      input.locationLabel,
      input.placeId,
      input.sinceLabel,
      input.pronoun,
      input.quote,
      input.narrative,
      JSON.stringify(input.photos),
      JSON.stringify(input.events),
    ],
  );
  return id;
}

export async function updateStory(id: string, managerId: string, input: StoryInput): Promise<boolean> {
  const rows = await sql<{ id: string }>(
    `update stories set
      name = $3,
      role = $4,
      property_name = $5,
      location_label = $6,
      place_id = $7,
      since_label = $8,
      pronoun = $9,
      quote = $10,
      narrative = $11,
      photos = $12::jsonb,
      events = $13::jsonb,
      updated_at = now()
    where id = $1 and manager_id = $2
    returning id`,
    [
      id,
      managerId,
      input.name,
      input.role,
      input.propertyName,
      input.locationLabel,
      input.placeId,
      input.sinceLabel,
      input.pronoun,
      input.quote,
      input.narrative,
      JSON.stringify(input.photos),
      JSON.stringify(input.events),
    ],
  );
  return rows.length > 0;
}
