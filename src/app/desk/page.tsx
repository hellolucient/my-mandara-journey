import Link from "next/link";
import { getCurrentManager } from "@/lib/auth";
import { listStories } from "@/lib/stories";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DeskPage() {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");
  const stories = await listStories(manager.id);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">{manager.displayName}</p>
          <h1 className="font-display text-5xl text-[#1a3f36]">Your team</h1>
        </div>
        <Link
          href="/desk/new"
          className="inline-flex h-11 items-center rounded-full bg-[#1e4038] px-5 text-sm text-[#f6f1e6]"
        >
          Add someone
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="mt-10 max-w-xl rounded-3xl border border-dashed border-[#d3c4ae] bg-[#f7f3ea] px-6 py-10">
          <h2 className="font-display text-3xl text-[#1a3f36]">No one here yet</h2>
          <p className="mt-2 leading-relaxed text-[#3d4f48]">
            Add a name, a role, the resort, a quote, the story, a few photographs, and the timeline. The card is one landscape side of A5, ready to pin on the wall.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/desk/new" className="inline-flex h-11 items-center rounded-full bg-[#1e4038] px-5 text-sm text-[#f6f1e6]">
              Start a card
            </Link>
            <Link href="/desk/sample" className="inline-flex h-11 items-center rounded-full border border-[#d3c4ae] px-5 text-sm text-[#1e4038]">
              Look at the sample
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {stories.map((story) => (
            <li key={story.id} className="overflow-hidden rounded-3xl border border-[#e4d8c8] bg-[#f7f3ea]">
              <div className="flex gap-4 p-4">
                {story.photos[0] ? (
                  // Data URLs from the desk are not served through the image optimizer.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={story.photos[0].src} alt="" className="size-20 rounded-2xl object-cover" />
                ) : (
                  <div className="font-display grid size-20 place-items-center rounded-2xl bg-[#e7efe6] text-2xl text-[#1e4038]">
                    {story.name.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-display truncate text-2xl text-[#1a3f36]">{story.name}</h2>
                  <p className="truncate text-sm text-[#5e6b64]">
                    {[story.role, story.propertyName, story.locationLabel].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-3 flex gap-3 text-sm">
                    <Link href={`/desk/${story.id}/card`} className="text-[#1e4038] underline-offset-4 hover:underline">
                      Open card
                    </Link>
                    <Link href={`/desk/${story.id}`} className="text-[#1e4038] underline-offset-4 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
