import { redirect } from "next/navigation";
import { Mark } from "@/components/mark";
import { CardFront } from "@/components/story-card";
import { SheetScaler } from "@/components/sheet-scaler";
import { LoginForm, SetupForm } from "@/components/gate";
import { getCurrentManager, managerCount } from "@/lib/auth";
import { sampleStory } from "@/lib/sample-story";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const manager = await getCurrentManager();
  if (manager) redirect("/desk");
  const count = await managerCount();
  const firstDesk = count === 0;

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:px-8">
      <section className="min-w-0">
        <div className="mb-6 flex items-center gap-3 text-[#1e4038]">
          <Mark className="size-11" />
          <p className="text-[11px] tracking-[0.22em] uppercase">Our Mandara journey</p>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] text-[#1a3f36]">
          Every journey starts somewhere
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-[#3d4f48]">
          {firstDesk
            ? "There isn’t a login yet. Choose a username and password for yourself, then add one for each spa manager."
            : "Sign in with the username and password created for your property. Then add someone on your team and print their A5 card."}
        </p>
        <div className="mt-8 max-w-md">{firstDesk ? <SetupForm /> : <LoginForm />}</div>
      </section>
      <section className="mx-auto w-full min-w-0 max-w-xl">
        <p className="mb-2 text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">Sample card · front</p>
        <SheetScaler>
          <CardFront story={sampleStory} sample />
        </SheetScaler>
      </section>
    </div>
  );
}
