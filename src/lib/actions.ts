"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearSession,
  findManagerByUsername,
  getCurrentManager,
  hashPassword,
  managerCount,
  openSession,
  verifyPassword,
} from "@/lib/auth";
import { sql } from "@/lib/db";
import { sampleStory } from "@/lib/sample-story";
import { insertStory, parseStoryForm, updateStory } from "@/lib/stories";

export type FormState = { error?: string; saved?: boolean } | null;

export type CreatedLogin = {
  username: string;
  password: string;
  displayName: string;
  propertyName: string;
};

export type LoginState = { error?: string; created?: CreatedLogin } | null;

function cleanUsername(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim().toLowerCase();
}

function validUsername(username: string): boolean {
  return /^[a-z0-9._-]{3,32}$/.test(username);
}

async function requireManager() {
  const manager = await getCurrentManager();
  if (!manager) redirect("/");
  return manager;
}

export async function setupDesk(_prev: FormState, formData: FormData): Promise<FormState> {
  if ((await managerCount()) > 0) {
    return { error: "A desk already exists. Sign in with that username." };
  }
  const displayName = String(formData.get("displayName") ?? "").trim().slice(0, 80);
  const propertyName = String(formData.get("propertyName") ?? "").trim().slice(0, 80);
  const username = cleanUsername(formData.get("username"));
  const password = String(formData.get("password") ?? "");
  if (!displayName || !propertyName) return { error: "Add your name and the property." };
  if (!validUsername(username)) {
    return { error: "Usernames use 3–32 lowercase letters, numbers, dots, or hyphens." };
  }
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };
  const id = crypto.randomUUID();
  await sql(
    `insert into managers (id, username, password_hash, display_name, property_name)
     values ($1, $2, $3, $4, $5)`,
    [id, username, await hashPassword(password), displayName, propertyName],
  );
  await openSession(id);
  redirect("/desk");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = cleanUsername(formData.get("username"));
  const password = String(formData.get("password") ?? "");
  const manager = await findManagerByUsername(username);
  const matches = manager ? await verifyPassword(password, manager.passwordHash) : false;
  if (!manager || !matches) {
    return { error: "Those details don't match a desk login." };
  }
  await openSession(manager.id);
  redirect("/desk");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/");
}

export async function saveStory(_prev: FormState, formData: FormData): Promise<FormState> {
  const manager = await requireManager();
  const parsed = parseStoryForm(formData);
  if ("error" in parsed) return parsed;
  const existingId = String(formData.get("id") ?? "");
  if (existingId) {
    const saved = await updateStory(existingId, manager.id, parsed.input);
    if (!saved) return { error: "That story is no longer on your desk." };
    revalidatePath("/desk");
    revalidatePath(`/desk/${existingId}`);
    revalidatePath(`/desk/${existingId}/card`);
    redirect(`/desk/${existingId}/card`);
  }
  const id = await insertStory(manager.id, parsed.input);
  revalidatePath("/desk");
  redirect(`/desk/${id}/card`);
}

export async function deleteStory(formData: FormData): Promise<void> {
  const manager = await requireManager();
  const id = String(formData.get("id") ?? "");
  await sql("delete from stories where id = $1 and manager_id = $2", [id, manager.id]);
  revalidatePath("/desk");
  redirect("/desk");
}

export async function copySample(): Promise<void> {
  const manager = await requireManager();
  const id = await insertStory(manager.id, {
    name: sampleStory.name,
    role: sampleStory.role,
    propertyName: sampleStory.propertyName,
    locationLabel: sampleStory.locationLabel,
    placeId: sampleStory.placeId,
    sinceLabel: sampleStory.sinceLabel,
    pronoun: sampleStory.pronoun,
    quote: sampleStory.quote,
    narrative: sampleStory.narrative,
    photos: [],
    events: sampleStory.events.map((event) => ({ ...event, id: crypto.randomUUID() })),
  });
  revalidatePath("/desk");
  redirect(`/desk/${id}`);
}

export async function createManager(_prev: LoginState, formData: FormData): Promise<LoginState> {
  await requireManager();
  const displayName = String(formData.get("displayName") ?? "").trim().slice(0, 80);
  const propertyName = String(formData.get("propertyName") ?? "").trim().slice(0, 80);
  const username = cleanUsername(formData.get("username"));
  const password = String(formData.get("password") ?? "");
  if (!displayName || !propertyName) return { error: "Add the manager's name and property." };
  if (!validUsername(username)) {
    return { error: "Usernames use 3–32 lowercase letters, numbers, dots, or hyphens." };
  }
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };
  try {
    await sql(
      `insert into managers (id, username, password_hash, display_name, property_name)
       values ($1, $2, $3, $4, $5)`,
      [crypto.randomUUID(), username, await hashPassword(password), displayName, propertyName],
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/unique|duplicate/i.test(message)) {
      return { error: "That username is already in use." };
    }
    throw error;
  }
  revalidatePath("/desk/logins");
  return { created: { username, password, displayName, propertyName } };
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const manager = await requireManager();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 8) return { error: "Use a new password of at least 8 characters." };
  const row = await findManagerByUsername(manager.username);
  if (!row || !(await verifyPassword(current, row.passwordHash))) {
    return { error: "The current password doesn't match." };
  }
  await sql("update managers set password_hash = $2 where id = $1", [
    manager.id,
    await hashPassword(next),
  ]);
  return { saved: true };
}
