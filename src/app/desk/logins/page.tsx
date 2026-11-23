import { LoginsPanel } from "@/components/logins-panel";
import { toManager } from "@/lib/auth";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LoginsPage() {
  const rows = await sql<{
    id: string;
    username: string;
    display_name: string;
    property_name: string;
  }>("select id, username, display_name, property_name from managers order by display_name");

  return (
    <div>
      <p className="text-[11px] tracking-[0.18em] text-[#6d6458] uppercase">Managers</p>
      <h1 className="font-display mb-8 text-5xl text-[#1a3f36]">Desk logins</h1>
      <LoginsPanel managers={rows.map((row) => toManager(row))} />
    </div>
  );
}
