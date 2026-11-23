import { copySample } from "@/lib/actions";
import { PrintButton } from "@/components/print-button";
import { StorySheets } from "@/components/story-card";
import { Button } from "@/components/ui/button";
import { sampleStory } from "@/lib/sample-story";

export const dynamic = "force-dynamic";

export default function SamplePage() {
  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">Sample data</p>
          <h1 className="font-display text-5xl text-[#1a3f36]">Novita</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5e6b64]">
            This is the shape of a finished card. The illustrations stand in for photographs. Copy it onto your desk to replace them with her own pictures, or start a blank card.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PrintButton label="Print the sample" />
          <form action={copySample}>
            <Button type="submit" variant="outline" className="h-11 rounded-full border-[#d3c4ae] px-5">
              Copy onto my desk
            </Button>
          </form>
        </div>
      </div>
      <StorySheets story={sampleStory} sample />
    </div>
  );
}
