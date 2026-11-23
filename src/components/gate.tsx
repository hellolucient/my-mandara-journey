"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, setupDesk, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GateError({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-xl bg-[#f6e4d8] px-3 py-2 text-sm text-[#6b3a28]" role="alert">
      {state.error}
    </p>
  );
}

function Submit({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-full bg-[#1e4038] text-[#f6f1e6] hover:bg-[#16332d]"
    >
      {pending ? "One moment…" : children}
    </Button>
  );
}

export function SetupForm() {
  const [state, action] = useActionState(setupDesk, null);
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Your name</Label>
        <Input id="displayName" name="displayName" required autoComplete="name" className="h-11 bg-[#f7f3ea]" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="propertyName">Property</Label>
        <Input
          id="propertyName"
          name="propertyName"
          required
          placeholder="Mandara Spa, Sanur"
          className="h-11 bg-[#f7f3ea]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="sanur"
          className="h-11 bg-[#f7f3ea]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="h-11 bg-[#f7f3ea]"
        />
        <p className="text-xs text-[#6d6458]">At least 8 characters. You will share logins like this with the other managers.</p>
      </div>
      <GateError state={state} />
      <Submit>Open the desk</Submit>
    </form>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(login, null);
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          className="h-11 bg-[#f7f3ea]"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 bg-[#f7f3ea]"
        />
      </div>
      <GateError state={state} />
      <Submit>Sign in</Submit>
    </form>
  );
}
