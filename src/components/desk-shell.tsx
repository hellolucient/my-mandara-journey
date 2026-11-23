import Link from "next/link";
import { logout } from "@/lib/actions";
import { Mark } from "@/components/mark";
import type { Manager } from "@/lib/types";

export function DeskShell({ manager, children }: { manager: Manager; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="no-print border-b border-[#e4d8c8]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/desk" className="flex items-center gap-2 text-[#1e4038]">
            <Mark className="size-9" />
            <span>
              <span className="font-display block text-xl leading-none">Mandara desk</span>
              <span className="text-xs text-[#6d6458]">{manager.propertyName}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            <Link href="/desk" className="rounded-full px-3 py-2 hover:bg-[#e7efe6]">
              Team
            </Link>
            <Link href="/desk/new" className="rounded-full px-3 py-2 hover:bg-[#e7efe6]">
              Add someone
            </Link>
            <Link href="/desk/sample" className="rounded-full px-3 py-2 hover:bg-[#e7efe6]">
              Sample card
            </Link>
            <Link href="/desk/logins" className="rounded-full px-3 py-2 hover:bg-[#e7efe6]">
              Logins
            </Link>
            <form action={logout}>
              <button type="submit" className="rounded-full px-3 py-2 text-[#6d6458] hover:bg-[#e7efe6]">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
