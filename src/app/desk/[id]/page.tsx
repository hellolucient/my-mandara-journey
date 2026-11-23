import { notFound, redirect } from "next/navigation";
import { StoryForm } from "@/components/story-form";
import { getCurrentManager } from "@/lib/auth";
import { getStory } from "@/lib/stories";

export const dynamic = "force-dynamic";

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");
  const { id } = await params;
  const story = await getStory(id, manager.id);
  if (!story) notFound();
  return (
    <div>
      <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">Edit</p>
      <h1 className="font-display mb-8 text-5xl text-[#1a3f36]">{story.name}</h1>
      <StoryForm initial={story} />
    </div>
  );
}
