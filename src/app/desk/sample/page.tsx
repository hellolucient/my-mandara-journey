import { copySample } from "@/lib/actions";
import { PrintButton } from "@/components/print-button";
import { CardFront } from "@/components/story-card";
import { SheetScaler } from "@/components/sheet-scaler";
import { Button } from "@/components/ui/button";
import { sampleStory } from "@/lib/sample-story";

export const dynamic = "force-dynamic";

export default function SamplePage() {
  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">Sample data</p>
          <h1 className="font-display text-5xl text-[#1a3f36]">Two ways without the map</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5e6b64]">
            The journey from Bali to the Maldives is almost the same on every card, and it disappears at print size. These two use that space differently. The five cards in the hand are stand-ins for the rest of a team.
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
      <div className="space-y-12">
        <figure>
          <figcaption className="mb-2 text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">
            A · The rest of the team, fanned like a hand
          </figcaption>
          <SheetScaler>
            <CardFront story={sampleStory} sample treatment="hand" />
          </SheetScaler>
        </figure>
        <figure>
          <figcaption className="mb-2 text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">
            B · The name, the resort, the quote, and the story, bigger
          </figcaption>
          <SheetScaler>
            <CardFront story={sampleStory} sample treatment="type" />
          </SheetScaler>
        </figure>
      </div>
    </div>
  );
}
