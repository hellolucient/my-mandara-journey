import { FramedPhoto } from "@/components/framed-photo";
import { JourneyMap } from "@/components/journey-map";
import { Mark } from "@/components/mark";
import { SheetScaler } from "@/components/sheet-scaler";
import { DOT_COLORS, formatEventDate, formatSince, type Story, type StoryEvent, type StoryPhoto } from "@/lib/types";

const FILLERS = ["/sample/garden.svg", "/sample/gathering.svg", "/sample/shore.svg", "/sample/water.svg"];

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

function PhotoRow({ photos }: { photos: StoryPhoto[] }) {
  const slots = Array.from({ length: 4 }, (_, index) => photos[index] ?? null);
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {slots.map((photo, index) =>
        photo ? (
          <FramedPhoto key={`${photo.src.slice(0, 24)}-${index}`} photo={photo} className="aspect-square rounded-lg" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={FILLERS[index]} src={FILLERS[index]} alt="" className="aspect-square w-full rounded-lg object-cover" />
        ),
      )}
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
          <li key={event.id} className="grid grid-cols-[2.35rem_0.7rem_minmax(0,1fr)] gap-x-1">
            <p
              className="pt-px text-right text-[9px] leading-tight font-semibold tracking-[0.04em] uppercase"
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
              {index < shown.length - 1 ? <span className="my-px w-px flex-1" style={{ background: color }} /> : null}
            </div>
            <div className={index < shown.length - 1 ? "pb-1.5" : ""}>
              <p className="line-clamp-2 text-[11px] leading-tight text-[#1c3330]">{event.title}</p>
              {event.placeLabel ? <p className="truncate text-[10px] text-[#7d7468]">{event.placeLabel}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function CardFront({ story, sample = false }: { story: Story; sample?: boolean }) {
  const name = story.name.trim() || "Name";
  const property = story.propertyName.trim();
  const location = story.locationLabel.trim();
  const showLocation = location && !property.toLowerCase().includes(location.toLowerCase());
  const meta = [property, showLocation ? location : "", story.role.trim()].filter(Boolean).join("  ·  ");
  const since = formatSince(story.sinceLabel);
  return (
    <article className="a5-sheet grid grid-cols-[1.22fr_0.78fr] gap-[4mm] px-[6mm] py-[5mm] text-[#1c3330]">
      <div className="flex min-h-0 flex-col">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-[#1e4038]">
            <Mark className="size-7 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] font-medium tracking-[0.18em] uppercase">Our Mandara journey</p>
              <p className="font-display text-[13px] leading-none text-[#1a3f36]">Every journey starts somewhere</p>
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
          {since ? <p className="font-serif shrink-0 pb-1 text-right text-[12px] text-[#8a623c] italic">Since {since}</p> : null}
        </div>
        {meta ? <p className="mt-1 text-[10px] leading-snug tracking-[0.12em] text-[#3d4f48] uppercase">{meta}</p> : null}
        {story.quote ? (
          <blockquote className="font-serif mt-1.5 line-clamp-2 text-[13px] leading-snug text-[#1e4038] italic">
            “{story.quote}
          </blockquote>
        ) : (
          <p className="font-serif mt-1.5 text-[13px] text-[#7a6d5e] italic">A quote sits here.</p>
        )}

        <div className="mt-2 min-h-0 flex-1 overflow-hidden">
          {story.narrative.trim() ? (
            <p className="font-serif line-clamp-8 text-[12.5px] leading-snug text-[#243833]">{story.narrative}</p>
          ) : (
            <p className="font-serif text-[12.5px] text-[#7a6d5e] italic">The story sits here.</p>
          )}
        </div>

        <div className="mt-2">
          <PhotoRow photos={story.photos} />
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="aspect-[8/5] shrink-0 overflow-hidden rounded-xl border border-[#e4d8c8]">
          <JourneyMap story={story} />
        </div>
        <div className="mt-2 min-h-0 flex-1 overflow-hidden">
          <p className="mb-1.5 text-[9px] font-medium tracking-[0.16em] text-[#1e4038] uppercase">The journey</p>
          {story.events.length > 0 ? (
            <Timeline events={story.events} />
          ) : (
            <p className="font-serif text-[12px] text-[#7a6d5e] italic">Training, postings, and achievements line up here.</p>
          )}
        </div>
      </div>
    </article>
  );
}

export function StorySheets({ story, sample = false }: { story: Story; sample?: boolean }) {
  return (
    <div className="card-spread mx-auto max-w-[54rem]">
      <figure className="min-w-0">
        <figcaption className="no-print mb-2 text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">
          A5 landscape · one side, for the wall
        </figcaption>
        <SheetScaler>
          <CardFront story={story} sample={sample} />
        </SheetScaler>
      </figure>
    </div>
  );
}
