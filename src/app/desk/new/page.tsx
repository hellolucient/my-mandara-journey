import { StoryForm } from "@/components/story-form";
import { getCurrentManager } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewStoryPage() {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");
  return (
    <div>
      <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">New story card</p>
      <h1 className="font-display mb-8 text-5xl text-[#1a3f36]">Add someone</h1>
      <StoryForm
        initial={{
          name: "",
          role: "Spa Therapist",
          propertyName: manager.propertyName,
          locationLabel: "",
          placeId: "",
          sinceLabel: "",
          pronoun: "she",
          quote: "",
          narrative: "",
          photos: [],
          events: [],
        }}
      />
    </div>
  );
}
