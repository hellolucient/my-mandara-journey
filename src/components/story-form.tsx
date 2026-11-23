"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { deleteStory, saveStory, type FormState } from "@/lib/actions";
import { draftNarrative } from "@/lib/narrative";
import { PLACES, placeById } from "@/lib/places";
import { PhotoEditor } from "@/components/framed-photo";
import { CardFront } from "@/components/story-card";
import { SheetScaler } from "@/components/sheet-scaler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  KIND_LABEL,
  ROLES,
  blankEvent,
  formatEventDate,
  formatSince,
  MAX_PHOTO_BYTES,
  MAX_PHOTOS,
  PHOTO_SIZE_LABEL,
  photoFromSrc,
  toMonthValue,
  type EventKind,
  type Pronoun,
  type Story,
  type StoryEvent,
  type StoryPhoto,
} from "@/lib/types";

type Draft = {
  id?: string;
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
};

async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a photograph.");
  }
  const bitmap = await createImageBitmap(file);
  let maxSide = 1400;
  let quality = 0.72;
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not prepare that photograph.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL("image/jpeg", quality);
      if (url.length <= 1_200_000) return url;
      maxSide = 1000;
      quality = 0.55;
    }
  } finally {
    bitmap.close();
  }
  throw new Error("That photograph is still too large. Try a smaller one.");
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 rounded-full bg-[#1e4038] px-5 text-[#f6f1e6] hover:bg-[#16332d]"
    >
      {pending ? "Saving…" : "Save and open the card"}
    </Button>
  );
}

export function StoryForm({ initial }: { initial: Draft }) {
  const [state, action] = useActionState(saveStory, null as FormState);
  const [name, setName] = useState(initial.name);
  const [role, setRole] = useState(initial.role);
  const [propertyName, setPropertyName] = useState(initial.propertyName);
  const [locationLabel, setLocationLabel] = useState(initial.locationLabel);
  const [placeId, setPlaceId] = useState(initial.placeId);
  const parsedSince = toMonthValue(initial.sinceLabel);
  const [sinceLabel, setSinceLabel] = useState(parsedSince);
  const [pronoun, setPronoun] = useState<Pronoun>(initial.pronoun);
  const [quote, setQuote] = useState(initial.quote);
  const [narrative, setNarrative] = useState(initial.narrative);
  const [photos, setPhotos] = useState(initial.photos);
  const [events, setEvents] = useState<StoryEvent[]>(
    initial.events.length ? initial.events : [blankEvent()],
  );
  const [photoError, setPhotoError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const preview = useMemo<Story>(
    () => ({
      id: initial.id ?? "draft",
      managerId: "",
      name,
      role,
      propertyName,
      locationLabel,
      placeId,
      sinceLabel: sinceLabel || initial.sinceLabel,
      pronoun,
      quote,
      narrative,
      photos,
      events,
      updatedAt: "",
    }),
    [events, initial.id, initial.sinceLabel, locationLabel, name, narrative, photos, placeId, pronoun, propertyName, quote, role, sinceLabel],
  );

  function updateEvent(id: string, patch: Partial<StoryEvent>) {
    setEvents((current) => current.map((event) => (event.id === id ? { ...event, ...patch } : event)));
  }

  function moveEvent(index: number, direction: -1 | 1) {
    setEvents((current) => {
      const next = index + direction;
      if (next < 0 || next >= current.length) return current;
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item);
      return copy;
    });
  }

  async function onPhotos(fileList: FileList | null) {
    if (!fileList?.length) return;
    setPhotoError("");
    const room = MAX_PHOTOS - photos.length;
    const files = Array.from(fileList).slice(0, room);
    try {
      const next: StoryPhoto[] = [];
      for (const file of files) {
        if (file.size > MAX_PHOTO_BYTES) {
          throw new Error(`${file.name || "That photograph"} is larger than ${PHOTO_SIZE_LABEL}.`);
        }
        next.push(photoFromSrc(await compressImage(file)));
      }
      setPhotos((current) => [...current, ...next].slice(0, 4));
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Could not add that photograph.");
    }
  }

  return (
    <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,40rem)_minmax(18rem,1fr)]">
      <form action={action} className="space-y-8">
        {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <input type="hidden" name="photos" value={JSON.stringify(photos)} />
        <input type="hidden" name="events" value={JSON.stringify(events)} />

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-3xl text-[#1a3f36]">The person</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#5e6b64]">
              The name, where they work today, and when they started with Mandara.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required value={name} onChange={(event) => setName(event.target.value)} className="h-11 bg-[#f7f3ea]" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#ddcfba] bg-[#f7f3ea] px-3 text-sm"
              >
                {(ROLES as readonly string[]).includes(role) ? null : <option value={role}>{role}</option>}
                {ROLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pronoun">Story voice</Label>
              <select
                id="pronoun"
                name="pronoun"
                value={pronoun}
                onChange={(event) => setPronoun(event.target.value as Pronoun)}
                className="h-11 w-full rounded-lg border border-[#ddcfba] bg-[#f7f3ea] px-3 text-sm"
              >
                <option value="she">She</option>
                <option value="he">He</option>
                <option value="they">They</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="propertyName">Property today</Label>
              <Input
                id="propertyName"
                name="propertyName"
                value={propertyName}
                onChange={(event) => setPropertyName(event.target.value)}
                placeholder="Barceló Nasandhura"
                className="h-11 bg-[#f7f3ea]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="locationLabel">Place name on the card</Label>
              <Input
                id="locationLabel"
                name="locationLabel"
                value={locationLabel}
                onChange={(event) => setLocationLabel(event.target.value)}
                placeholder="Malé"
                className="h-11 bg-[#f7f3ea]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="placeId">Pin on the map</Label>
              <select
                id="placeId"
                name="placeId"
                value={placeId}
                onChange={(event) => {
                  const next = event.target.value;
                  setPlaceId(next);
                  const place = placeById(next);
                  if (place && !locationLabel) setLocationLabel(place.short);
                }}
                className="h-11 w-full rounded-lg border border-[#ddcfba] bg-[#f7f3ea] px-3 text-sm"
              >
                <option value="">Not on the map</option>
                {PLACES.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sinceLabel">With Mandara since</Label>
              <Input
                id="sinceLabel"
                name={sinceLabel ? "sinceLabel" : undefined}
                type="month"
                value={sinceLabel}
                onChange={(event) => setSinceLabel(event.target.value)}
                className="h-11 bg-[#f7f3ea]"
              />
              {!sinceLabel && initial.sinceLabel ? (
                <input type="hidden" name="sinceLabel" value={initial.sinceLabel} />
              ) : null}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="font-display text-3xl text-[#1a3f36]">The quote</h2>
            <p className="mt-1 text-sm text-[#5e6b64]">A short line, in their own voice. Two lines fit on the wall card.</p>
          </div>
          <Textarea
            name="quote"
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            maxLength={400}
            rows={4}
            placeholder="I believe this journey…"
            className="min-h-28 bg-[#f7f3ea] text-base"
          />
          <p className="text-xs text-[#7a6d5e]">{quote.length}/400</p>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="font-display text-3xl text-[#1a3f36]">Photographs</h2>
            <p className="mt-1 text-sm text-[#5e6b64]">
              Up to four photographs, {PHOTO_SIZE_LABEL} each. Drag a photo to choose the part that shows, and use zoom when you only want a detail. Two photos stay as portraits, so they are not sliced in half.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.map((photo, index) => (
              <PhotoEditor
                key={`${index}-${photo.src.slice(0, 24)}`}
                photo={photo}
                onChange={(next) =>
                  setPhotos((current) => current.map((item, photoIndex) => (photoIndex === index ? next : item)))
                }
                onRemove={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
              />
            ))}
            {photos.length < MAX_PHOTOS ? (
              <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d3c4ae] bg-[#f7f3ea] px-4 text-center text-sm text-[#5e6b64]">
                Add a photo
                <span className="mt-1 text-xs">{PHOTO_SIZE_LABEL} maximum</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    void onPhotos(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
            ) : null}
          </div>
          {photoError ? <p className="text-sm text-[#6b3a28]">{photoError}</p> : null}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-3xl text-[#1a3f36]">Timeline</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#5e6b64]">
              When they started training, each place they worked, what they achieved, and what is next.
              The map draws a line through the places, in this order. The card shows the first six.
            </p>
          </div>
          <ol className="space-y-4">
            {events.map((event, index) => (
              <li key={event.id} className="rounded-2xl border border-[#e4d8c8] bg-[#f7f3ea]/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs tracking-[0.16em] text-[#6d6458] uppercase">Moment {index + 1}</p>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => moveEvent(index, -1)} disabled={index === 0}>
                      Up
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveEvent(index, 1)}
                      disabled={index === events.length - 1}
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEvents((current) => current.filter((item) => item.id !== event.id))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Kind</Label>
                    <select
                      value={event.kind}
                      onChange={(change) => updateEvent(event.id, { kind: change.target.value as EventKind })}
                      className="h-10 w-full rounded-lg border border-[#ddcfba] bg-white px-3 text-sm"
                    >
                      {(Object.keys(KIND_LABEL) as EventKind[]).map((kind) => (
                        <option key={kind} value={kind}>
                          {KIND_LABEL[kind]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={event.date}
                      onChange={(change) => {
                        const date = change.target.value;
                        updateEvent(event.id, {
                          date,
                          dateLabel: date ? formatEventDate({ ...event, date, dateLabel: "" }) : "",
                        });
                      }}
                      className="h-10 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>What happened</Label>
                    <Input
                      value={event.title}
                      onChange={(change) => updateEvent(event.id, { title: change.target.value })}
                      placeholder="Training begins in Sanur, Bali"
                      className="h-10 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>A little more</Label>
                    <Input
                      value={event.detail}
                      onChange={(change) => updateEvent(event.id, { detail: change.target.value })}
                      placeholder="about three months including OJT"
                      className="h-10 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Where, on the map</Label>
                    <select
                      value={event.placeId}
                      onChange={(change) => {
                        const next = change.target.value;
                        const place = placeById(next);
                        const previous = placeById(event.placeId);
                        const patch: Partial<StoryEvent> = { placeId: next };
                        if (place && (!event.placeLabel || event.placeLabel === previous?.name)) {
                          patch.placeLabel = place.name;
                        }
                        updateEvent(event.id, patch);
                      }}
                      className="h-10 w-full rounded-lg border border-[#ddcfba] bg-white px-3 text-sm"
                    >
                      <option value="">No pin</option>
                      {PLACES.map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Place, as printed</Label>
                    <Input
                      value={event.placeLabel}
                      onChange={(change) => updateEvent(event.id, { placeLabel: change.target.value })}
                      placeholder="Sanur, Bali"
                      className="h-10 bg-white"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
          {events.length < 8 ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-[#d3c4ae] bg-transparent"
              onClick={() => setEvents((current) => [...current, blankEvent(current.length ? "posting" : "training")])}
            >
              Add a moment
            </Button>
          ) : (
            <p className="text-sm text-[#6d6458]">Eight moments is the limit.</p>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl text-[#1a3f36]">The paragraph</h2>
              <p className="mt-1 text-sm text-[#5e6b64]">
                Kept with the story on the desk. The wall card uses the quote, the photographs, the map, and the timeline.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-[#d3c4ae]"
              onClick={() =>
                setNarrative(
                  draftNarrative({
                    name,
                    sinceLabel: formatSince(sinceLabel || initial.sinceLabel),
                    pronoun,
                    events,
                  }),
                )
              }
            >
              Draft from the timeline
            </Button>
          </div>
          <Textarea
            name="narrative"
            value={narrative}
            onChange={(event) => setNarrative(event.target.value)}
            maxLength={1200}
            rows={7}
            className="min-h-36 bg-[#f7f3ea] text-base"
          />
          <p className="text-xs text-[#7a6d5e]">{narrative.length}/1200</p>
        </section>

        {state?.error ? (
          <p className="rounded-xl bg-[#f6e4d8] px-3 py-2 text-sm text-[#6b3a28]" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <SaveButton />
          {initial.id ? (
            <Link href={`/desk/${initial.id}/card`} className="text-sm text-[#1e4038] underline-offset-4 hover:underline">
              Open the card without saving
            </Link>
          ) : null}
        </div>
      </form>

      <aside className="no-print min-w-0 space-y-4 xl:sticky xl:top-6">
        <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">Wall card, as you type</p>
        <SheetScaler>
          <CardFront story={preview} />
        </SheetScaler>
        {initial.id ? (
          <div className="rounded-2xl border border-[#e4d8c8] p-4">
            {confirmDelete ? (
              <form action={deleteStory} className="flex flex-wrap gap-2">
                <input type="hidden" name="id" value={initial.id} />
                <Button type="submit" variant="destructive" className="rounded-full">
                  Delete this story
                </Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setConfirmDelete(false)}>
                  Keep it
                </Button>
              </form>
            ) : (
              <button type="button" className="text-sm text-[#8a4b3a] underline-offset-4 hover:underline" onClick={() => setConfirmDelete(true)}>
                Delete this story
              </button>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
