const MATES = [
  {
    name: "Trenty",
    resort: "Dhonveli",
    photos: ["/sample/shore.svg", "/sample/water.svg", "/sample/garden.svg"],
  },
  {
    name: "Ayu",
    resort: "Vadoo",
    photos: ["/sample/gathering.svg", "/sample/shore.svg", "/sample/garden.svg"],
  },
  {
    name: "Putu",
    resort: "Hakuraa",
    photos: ["/sample/water.svg", "/sample/garden.svg", "/sample/shore.svg"],
  },
  {
    name: "Sari",
    resort: "Whale Lagoon",
    photos: ["/sample/garden.svg", "/sample/gathering.svg", "/sample/water.svg"],
  },
  {
    name: "Kadek",
    resort: "Kunaavashi",
    photos: ["/sample/shore.svg", "/sample/gathering.svg", "/sample/water.svg"],
  },
];

function MiniCard({ name, resort, photos }: { name: string; resort: string; photos: string[] }) {
  return (
    <article className="overflow-hidden rounded-[3px] bg-[#f7f3ea] shadow-[0_1px_1px_rgba(48,28,10,0.2),0_4px_8px_rgba(48,28,10,0.14)] ring-1 ring-[#e3d3bc]">
      <div className="px-[3px] pt-[3px] text-left">
        <p className="font-display text-[9px] leading-none text-[#1a3f36]">{name}</p>
        <p className="mt-px truncate text-[4.5px] tracking-[0.06em] text-[#6a6258] uppercase">{resort}</p>
      </div>
      <div className="mt-[2px] grid grid-cols-3 gap-px bg-[#e3d3bc]">
        {photos.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className="aspect-[5/3] w-full object-cover" />
        ))}
      </div>
    </article>
  );
}

export function TeamHand() {
  const mid = (MATES.length - 1) / 2;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e7dece]" aria-label="The rest of the team">
      {MATES.map((mate, index) => {
        const offset = index - mid;
        return (
          <div
            key={mate.name}
            className="absolute top-[46%] left-1/2 w-[42%]"
            style={{
              zIndex: index + 1,
              transform: `translate(-50%, -54%) translateX(${offset * 32}%) translateY(${Math.abs(offset) * 10}%) rotate(${offset * 7}deg)`,
            }}
          >
            <MiniCard {...mate} />
          </div>
        );
      })}
    </div>
  );
}
