import { FramedPhoto } from "@/components/framed-photo";
import { JourneyMap } from "@/components/journey-map";
import { Mark } from "@/components/mark";
import { SheetScaler } from "@/components/sheet-scaler";
import { DOT_COLORS, formatEventDate, formatSince, type Story, type StoryEvent, type StoryPhoto } from "@/lib/types";

const FILLERS = ["/sample/garden.svg", "/sample/gathering.svg", "/sample/shore.svg"];

function clampLines(lines: number) {
  return {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as const,
    WebkitLineClamp: lines,
    overflow: "hidden",
  };
}

function PhotoSlot({ photo, index }: { photo: StoryPhoto | null; index: number }) {
  if (photo) {
    return <FramedPhoto photo={photo} className="aspect-[4/3] rounded-xl" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={FILLERS[index]} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
  );
}

function TimelineRow({ events, offset }: { events: StoryEvent[]; offset: number }) {
  return (
    <ol className="grid" style={{ gridTemplateColumns: `repeat(${events.length}, minmax(0, 1fr))` }}>
      {events.map((event, index) => {
        const color = event.kind === "next" ? "#1e4038" : DOT_COLORS[(offset + index) % DOT_COLORS.length];
        return (
          <li key={event.id} className="min-w-0 px-0.5 text-center">
            <p className="truncate text-[8px] leading-none font-semibold tracking-[0.04em] uppercase" style={{ color }}>
              {formatEventDate(event) || "—"}
            </p>
            <div className="relative my-[3px] flex h-2.5 items-center justify-center">
              {index > 0 ? <span className="absolute top-1/2 right-1/2 left-0 h-px -translate-y-1/2 bg-[#d3c4ae]" /> : null}
              {index < events.length - 1 ? (
                <span className="absolute top-1/2 right-0 left-1/2 h-px -translate-y-1/2 bg-[#d3c4ae]" />
              ) : null}
              <span
                className="relative size-[7px] rounded-full"
                style={{
                  background: event.kind === "next" ? "#f4efe4" : color,
                  boxShadow: `inset 0 0 0 1.25px ${color}`,
                }}
              />
            </div>
            <p className="line-clamp-2 text-[8.5px] leading-[1.15] text-[#1c3330]">{event.title}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Timeline({ events }: { events: StoryEvent[] }) {
  const shown = events.slice(0, 8);
  const rows = shown.length > 4 ? [shown.slice(0, Math.ceil(shown.length / 2)), shown.slice(Math.ceil(shown.length / 2))] : [shown];
  return (
    <div className="space-y-1">
      {rows.map((row, index) => (
        <TimelineRow key={row[0]?.id ?? index} events={row} offset={index === 0 ? 0 : rows[0].length} />
      ))}
    </div>
  );
}

export function CardFront({ story, sample = false }: { story: Story; sample?: boolean }) {
  const name = story.name.trim() || "Name";
  const property = story.propertyName.trim();
  const location = story.locationLabel.trim();
  const showLocation = location && !property.toLowerCase().includes(location.toLowerCase());
  const meta = [property, showLocation ? location : ""].filter(Boolean).join("  ·  ");
  const since = formatSince(story.sinceLabel);
  return (
    <article className="a5-sheet relative flex flex-col px-[5.5mm] pt-[3mm] pb-[3mm] text-center text-[#1c3330]">
      {sample ? (
        <p className="absolute top-[3.2mm] right-[5mm] -rotate-6 border border-dashed border-[#8c6239] px-1.5 py-0.5 text-[8px] tracking-[0.14em] text-[#8c6239] uppercase">
          Sample
        </p>
      ) : null}

      <p className="flex items-center justify-center gap-1.5 text-[8px] font-medium tracking-[0.22em] text-[#1e4038] uppercase">
        <Mark className="size-4" />
        Our Mandara journey
      </p>

      <div className="mt-1.5 grid flex-1 grid-cols-3 content-start gap-x-1.5 gap-y-1.5">
        {Array.from({ length: 3 }, (_, index) => (
          <PhotoSlot key={index} photo={story.photos[index] ?? null} index={index} />
        ))}

        <div className="aspect-[4/3] self-start overflow-hidden rounded-xl bg-[#d5e3dc]">
          <JourneyMap story={story} />
        </div>
        <div className="col-span-2 flex min-h-0 flex-col justify-center px-2 text-center">
          <h2 className={`font-display leading-none text-[#1a3f36] ${name.length > 18 ? "text-[1.35rem]" : "text-[1.7rem]"}`}>
            {name}
          </h2>
          {meta ? <p className="mt-1 text-[9px] tracking-[0.16em] text-[#3d4f48] uppercase">{meta}</p> : null}
          {since ? <p className="font-serif mt-0.5 text-[11px] text-[#8a623c] italic">With Mandara since {since}</p> : null}
          {story.quote ? (
            <blockquote className="font-serif mt-1 text-[16px] leading-snug font-semibold text-[#1e4038] italic" style={clampLines(2)}>
              “{story.quote}
            </blockquote>
          ) : (
            <p className="font-serif mt-1 text-[16px] font-semibold text-[#7a6d5e] italic">A quote sits here.</p>
          )}
          {story.narrative.trim() ? (
            <p className="font-serif mt-1.5 text-left text-[11px] leading-snug text-[#243833]" style={clampLines(5)}>
              {story.narrative}
            </p>
          ) : (
            <p className="font-serif mt-1.5 text-[11px] text-[#7a6d5e] italic">The story sits here.</p>
          )}
        </div>
      </div>

      <div className="mt-1.5 shrink-0">
        {story.events.length > 0 ? (
          <Timeline events={story.events} />
        ) : (
          <p className="font-serif text-[11px] text-[#7a6d5e] italic">The timeline reads across here.</p>
        )}
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
