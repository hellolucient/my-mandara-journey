import { FramedPhoto } from "@/components/framed-photo";
import { JourneyMap } from "@/components/journey-map";
import { Mark } from "@/components/mark";
import { SheetScaler } from "@/components/sheet-scaler";
import { DOT_COLORS, formatEventDate, formatSince, type Story, type StoryEvent } from "@/lib/types";

function DateStack({ value }: { value: string }) {
  const text = value.trim();
  const match = text.match(/^(.*\D)\s*(\d{4})$/);
  if (match?.[1] && match[2]) {
    return (
      <>
        {match[1].trim()}
        <br />
        {match[2]}
      </>
    );
  }
  return <>{text || "—"}</>;
}

function PhotoRow({ story }: { story: Story }) {
  const photos = story.photos.slice(0, 4);
  if (photos.length === 0) {
    return (
      <div className="grid h-[28mm] place-items-center rounded-xl border border-dashed border-[#d9cbb6] text-center">
        <p className="font-serif text-[12px] text-[#7a6d5e]">Photographs sit here.</p>
      </div>
    );
  }
  return (
    <div className="flex h-[40mm] justify-center gap-1.5">
      {photos.map((photo, index) => (
        <FramedPhoto
          key={`${photo.src.slice(0, 24)}-${index}`}
          photo={photo}
          className="h-full aspect-[3/4] rounded-xl"
        />
      ))}
    </div>
  );
}

function Timeline({ events }: { events: StoryEvent[] }) {
  const shown = events.slice(0, 6);
  return (
    <ol>
      {shown.map((event, index) => {
        const color = event.kind === "next" ? "#1e4038" : DOT_COLORS[index % DOT_COLORS.length];
        return (
          <li key={event.id} className="grid grid-cols-[2.55rem_0.65rem_minmax(0,1fr)] gap-x-1">
            <p
              className="pt-px text-right text-[8px] leading-tight font-semibold tracking-[0.04em] uppercase"
              style={{ color }}
            >
              <DateStack value={formatEventDate(event)} />
            </p>
            <div className="flex flex-col items-center">
              <span
                className="mt-[3px] size-[7px] shrink-0 rounded-full"
                style={{
                  background: event.kind === "next" ? "transparent" : color,
                  boxShadow: `inset 0 0 0 1.25px ${color}`,
                }}
              />
              {index < shown.length - 1 ? (
                <span className="my-px w-px flex-1" style={{ background: color }} />
              ) : null}
            </div>
            <div className={index < shown.length - 1 ? "pb-1" : ""}>
              <p className="line-clamp-2 text-[10px] leading-tight text-[#1c3330]">{event.title}</p>
              {event.placeLabel ? (
                <p className="truncate text-[9px] text-[#7d7468]">{event.placeLabel}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function CardFront({ story, sample = false }: { story: Story; sample?: boolean }) {
  const name = story.name.trim() || "Name";
  const meta = [story.propertyName, story.locationLabel, story.role]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("  ·  ");
  const since = formatSince(story.sinceLabel);
  return (
    <article className="a5-sheet flex flex-col px-[6mm] py-[5.5mm] text-[#1c3330]">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[#1e4038]">
          <Mark className="size-7 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] font-medium tracking-[0.18em] uppercase">Our Mandara journey</p>
            <p className="font-display truncate text-[13px] leading-none text-[#1a3f36]">
              Every journey starts somewhere
            </p>
          </div>
        </div>
        {sample ? (
          <p className="shrink-0 -rotate-6 border border-dashed border-[#8c6239] px-1.5 py-0.5 text-[8px] tracking-[0.14em] text-[#8c6239] uppercase">
            Sample
          </p>
        ) : null}
      </header>

      <div className="mt-2 flex items-end justify-between gap-3">
        <h2 className="font-display text-[2.15rem] leading-none text-[#1a3f36]">{name}</h2>
        {since ? (
          <p className="font-serif shrink-0 pb-1 text-right text-[11px] text-[#8a623c] italic">Since {since}</p>
        ) : null}
      </div>
      {meta ? (
        <p className="mt-1 text-[10px] tracking-[0.14em] text-[#3d4f48] uppercase">{meta}</p>
      ) : null}
      {story.quote ? (
        <blockquote className="font-serif mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-[#1e4038] italic">
          “ {story.quote}
        </blockquote>
      ) : (
        <p className="font-serif mt-1.5 text-[12px] text-[#7a6d5e] italic">A quote sits here.</p>
      )}

      <div className="mt-2">
        <PhotoRow story={story} />
      </div>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[1.08fr_0.92fr] content-start gap-2">
        <div className="aspect-[8/5] overflow-hidden rounded-xl border border-[#e4d8c8]">
          <JourneyMap story={story} />
        </div>
        <div className="min-h-0 overflow-hidden">
          <p className="mb-1 text-[9px] font-medium tracking-[0.16em] text-[#1e4038] uppercase">The journey</p>
          {story.events.length > 0 ? (
            <Timeline events={story.events} />
          ) : (
            <p className="font-serif text-[11px] text-[#7a6d5e] italic">Training, postings, and achievements line up here.</p>
          )}
        </div>
      </div>
    </article>
  );
}

export function StorySheets({ story, sample = false }: { story: Story; sample?: boolean }) {
  return (
    <div className="card-spread mx-auto max-w-[42rem]">
      <figure className="min-w-0">
        <figcaption className="no-print mb-2 text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">
          A5 · one side, for the wall
        </figcaption>
        <SheetScaler>
          <CardFront story={story} sample={sample} />
        </SheetScaler>
      </figure>
    </div>
  );
}
