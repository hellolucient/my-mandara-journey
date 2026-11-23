import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { StorySheets } from "@/components/story-card";
import { getCurrentManager } from "@/lib/auth";
import { getStory } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");
  const { id } = await params;
  const story = await getStory(id, manager.id);
  if (!story) notFound();

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">A5 story card</p>
          <h1 className="font-display text-5xl text-[#1a3f36]">{story.name}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5e6b64]">
            One landscape A5 side for the wall: photographs, the name, the quote, the story, and the timeline. Print, choose A5 landscape, and turn on background graphics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PrintButton />
          <Link
            href={`/desk/${story.id}`}
            className="inline-flex h-11 items-center rounded-full border border-[#d3c4ae] px-5 text-sm text-[#1e4038]"
          >
            Edit
          </Link>
        </div>
      </div>
      <StorySheets story={story} />
    </div>
  );
}
