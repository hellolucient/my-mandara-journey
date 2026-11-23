import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">Missing</p>
      <h1 className="font-display text-5xl text-[#1a3f36]">That page is not on the desk</h1>
      <Link href="/desk" className="mt-6 inline-flex text-[#1e4038] underline-offset-4 hover:underline">
        Back to the team
      </Link>
    </div>
  );
}
