"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword, createManager, type FormState, type LoginState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RESORTS } from "@/lib/resorts";
import type { Manager } from "@/lib/types";

function PendingButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 rounded-full bg-[#1e4038] px-5 text-[#f6f1e6] hover:bg-[#16332d]"
    >
      {pending ? "Saving…" : children}
    </Button>
  );
}

export function LoginsPanel({ managers }: { managers: Manager[] }) {
  const [created, createAction] = useActionState(createManager, null as LoginState);
  const [passwordState, passwordAction] = useActionState(changePassword, null as FormState);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl text-[#1a3f36]">New desk login</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#5e6b64]">
            Make a username and password, then give them to the manager. The password is shown once, and only the scrambled form is kept.
          </p>
        </div>
        <form action={createAction} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="displayName">Manager&apos;s name</Label>
            <Input id="displayName" name="displayName" required className="h-11 bg-[#f7f3ea]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="propertyName">Resort</Label>
            <select
              id="propertyName"
              name="propertyName"
              required
              defaultValue=""
              className="h-11 w-full rounded-lg border border-[#ddcfba] bg-[#f7f3ea] px-3 text-sm"
            >
              <option value="" disabled>
                Choose a resort
              </option>
              {RESORTS.map((resort) => (
                <option key={resort.name} value={resort.name}>
                  {resort.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" required autoCapitalize="none" spellCheck={false} className="h-11 bg-[#f7f3ea]" placeholder="maldives" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="text" required minLength={8} autoComplete="off" className="h-11 bg-[#f7f3ea]" />
            <p className="text-xs text-[#6d6458]">Shown in the clear so you can read it out. At least 8 characters.</p>
          </div>
          {created?.error ? <p className="text-sm text-[#6b3a28]">{created.error}</p> : null}
          <PendingButton>Create login</PendingButton>
        </form>
        {created?.created ? (
          <div className="rounded-2xl border border-[#d7c4a4] bg-[#f7f3ea] p-4">
            <p className="text-xs tracking-[0.16em] text-[#8a623c] uppercase">Give this to {created.created.displayName}</p>
            <p className="mt-2 text-sm">Username</p>
            <p className="font-display text-2xl text-[#1a3f36]">{created.created.username}</p>
            <p className="mt-2 text-sm">Password</p>
            <p className="font-display text-2xl text-[#1a3f36]">{created.created.password}</p>
            <p className="mt-2 text-sm text-[#5e6b64]">{created.created.propertyName}. It will not be shown again.</p>
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="font-display text-3xl text-[#1a3f36]">Desks</h2>
          <ul className="mt-3 divide-y divide-[#e4d8c8]">
            {managers.map((manager) => (
              <li key={manager.id} className="py-3">
                <p className="font-medium text-[#1c3330]">{manager.displayName}</p>
                <p className="text-sm text-[#5e6b64]">
                  {manager.username} · {manager.propertyName}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <form action={passwordAction} className="space-y-3 rounded-2xl border border-[#e4d8c8] p-4">
          <h3 className="font-display text-2xl text-[#1a3f36]">Change your password</h3>
          <div className="space-y-1.5">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" name="current" type="password" required autoComplete="current-password" className="h-11 bg-[#f7f3ea]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="next">New password</Label>
            <Input id="next" name="next" type="password" required minLength={8} autoComplete="new-password" className="h-11 bg-[#f7f3ea]" />
          </div>
          {passwordState?.error ? <p className="text-sm text-[#6b3a28]">{passwordState.error}</p> : null}
          {passwordState?.saved ? <p className="text-sm text-[#1e4038]">Password updated.</p> : null}
          <PendingButton>Update password</PendingButton>
        </form>
      </section>
    </div>
  );
}
