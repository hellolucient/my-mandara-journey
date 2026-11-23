import { JourneyMap } from "@/components/journey-map";
import { Mark } from "@/components/mark";
import { SheetScaler } from "@/components/sheet-scaler";
import { DOT_COLORS, type Story, type StoryEvent } from "@/lib/types";

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

function PhotoGrid({ story }: { story: Story }) {
  const photos = story.photos.slice(0, 4);
  if (photos.length === 0) {
    return (
      <div className="grid h-full min-h-0 place-items-center rounded-[1.15rem] border border-dashed border-[#d9cbb6] px-6 text-center">
        <p className="font-serif text-[15px] leading-relaxed text-[#7a6d5e]">
          Four photographs sit here, in a quiet grid.
        </p>
      </div>
    );
  }
  const columns = photos.length === 1 ? "grid-cols-1" : "grid-cols-2";
  const rows = photos.length <= 2 ? "grid-rows-1" : "grid-rows-2";
  return (
    <div className={`grid h-full min-h-0 gap-2 overflow-hidden ${columns} ${rows}`}>
      {photos.map((src, index) => (
        // Photographs are data URLs or local sample drawings, so they stay as img.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${src.slice(0, 32)}-${index}`}
          src={src}
          alt=""
          className={`h-full min-h-0 w-full rounded-[1.15rem] object-cover ${photos.length === 3 && index === 0 ? "col-span-2" : ""}`}
        />
      ))}
    </div>
  );
}

export function CardFront({ story, sample = false }: { story: Story; sample?: boolean }) {
  const name = story.name.trim() || "Her name";
  const meta = [story.propertyName, story.locationLabel, story.role]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("  ·  ");
  return (
    <article className="a5-sheet flex flex-col px-[8mm] py-[7mm] text-[#1c3330]">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[#1e4038]">
          <Mark className="size-8 shrink-0" />
          <p className="text-[10px] font-medium tracking-[0.22em] uppercase">Our Mandara journey</p>
        </div>
        {sample ? (
          <p className="stamp mt-1 -rotate-6 border border-dashed border-[#8c6239] px-2 py-1 text-[9px] tracking-[0.16em] text-[#8c6239] uppercase">
            Sample data
          </p>
        ) : null}
      </header>
      <h2 className="font-display mt-2 shrink-0 text-[1.55rem] leading-[1.05] text-[#1a3f36]">
        Every Journey Starts Somewhere
      </h2>
      <div className="mt-3 min-h-0 flex-1 overflow-hidden">
        <PhotoGrid story={story} />
      </div>
      <div className="mt-3 shrink-0 text-center">
        <h3 className="font-display text-[2.7rem] leading-none text-[#1a3f36]">{name}</h3>
        {meta ? (
          <p className="mt-2 text-[11px] tracking-[0.16em] text-[#3d4f48] uppercase">{meta}</p>
        ) : null}
        {story.sinceLabel ? (
          <p className="font-serif mt-1 text-[15px] text-[#8a623c] italic">
            With Mandara since {story.sinceLabel}
          </p>
        ) : null}
        {story.quote ? (
          <blockquote className="font-serif mx-auto mt-3 max-w-[34rem] text-[1.05rem] leading-snug text-[#1e4038] italic">
            <span className="font-display mb-1 block text-4xl leading-none text-[#1a3f36] not-italic">
              “
            </span>
            <span className="line-clamp-5">{story.quote}</span>
          </blockquote>
        ) : (
          <p className="font-serif mt-3 text-[15px] text-[#7a6d5e] italic">A quote from her sits here.</p>
        )}
      </div>
    </article>
  );
}

function Timeline({ events }: { events: StoryEvent[] }) {
  const shown = events.slice(0, 6);
  return (
    <ol className="mt-2">
      {shown.map((event, index) => {
        const color = event.kind === "next" ? "#1e4038" : DOT_COLORS[index % DOT_COLORS.length];
        return (
          <li key={event.id} className="grid grid-cols-[4.35rem_0.9rem_minmax(0,1fr)] gap-x-2">
            <p
              className="pt-[1px] text-right text-[10px] leading-tight font-semibold tracking-[0.08em] uppercase"
              style={{ color }}
            >
              <DateStack value={event.dateLabel} />
            </p>
            <div className="flex flex-col items-center">
              <span
                className="mt-[3px] size-[9px] shrink-0 rounded-full"
                style={{
                  background: event.kind === "next" ? "transparent" : color,
                  boxShadow: `inset 0 0 0 1.5px ${color}`,
                }}
              />
              {index < shown.length - 1 ? (
                <span className="my-[2px] w-px flex-1" style={{ background: color }} />
              ) : null}
            </div>
            <div className={index < shown.length - 1 ? "pb-1.5" : ""}>
              <p className="text-[12px] leading-tight text-[#1c3330]">{event.title}</p>
              {event.detail ? (
                <p className="text-[11.5px] leading-tight text-[#243833]">{event.detail}</p>
              ) : null}
              {event.placeLabel ? (
                <p className="mt-0.5 text-[11px] text-[#7d7468]">{event.placeLabel}</p>
              ) : null}
            </div>
          </li>
        );
      })}
      {events.length > shown.length ? (
        <li className="mt-1 text-[11px] text-[#7d7468]">
          And {events.length - shown.length} more moment{events.length - shown.length === 1 ? "" : "s"} on the desk.
        </li>
      ) : null}
    </ol>
  );
}

export function CardBack({ story }: { story: Story }) {
  const narrativeSize = story.narrative.length > 700 ? "12px" : story.narrative.length > 480 ? "13px" : "13.75px";
  return (
    <article className="a5-sheet flex flex-col px-[8mm] py-[7mm] text-[#1c3330]">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium tracking-[0.22em] text-[#1e4038] uppercase">The journey</p>
          <h2 className="font-display text-[1.85rem] leading-none text-[#1a3f36]">Timeline</h2>
        </div>
        <p className="font-serif text-right text-[13px] text-[#6d6458] italic">{story.name}</p>
      </header>
      <div className="mt-2 h-[50mm] overflow-hidden rounded-[1.15rem] border border-[#e4d8c8]">
        <JourneyMap story={story} />
      </div>
      {story.narrative ? (
        <p className="font-serif mt-2 leading-snug text-[#24332f]" style={{ fontSize: narrativeSize }}>
          {story.narrative}
        </p>
      ) : (
        <p className="font-serif mt-3 text-[13px] text-[#7a6d5e] italic">
          The short story, written from the timeline, sits here.
        </p>
      )}
      <div className="mt-2">
        {story.events.length > 0 ? (
          <Timeline events={story.events} />
        ) : (
          <p className="font-serif text-[13px] text-[#7a6d5e] italic">
            Training, postings, and achievements line up here.
          </p>
        )}
      </div>
    </article>
  );
}

export function StorySheets({ story, sample = false }: { story: Story; sample?: boolean }) {
  return (
    <div className="card-spread grid items-start gap-8 xl:grid-cols-2">
      <figure className="min-w-0">
        <figcaption className="no-print mb-2 text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">
          Front · A5
        </figcaption>
        <SheetScaler>
          <CardFront story={story} sample={sample} />
        </SheetScaler>
      </figure>
      <figure className="min-w-0">
        <figcaption className="no-print mb-2 text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">
          Back · map and timeline
        </figcaption>
        <SheetScaler>
          <CardBack story={story} />
        </SheetScaler>
      </figure>
    </div>
  );
}
