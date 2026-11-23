import { redirect } from "next/navigation";
import { DeskShell } from "@/components/desk-shell";
import { getCurrentManager } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");
  return <DeskShell manager={manager}>{children}</DeskShell>;
}
