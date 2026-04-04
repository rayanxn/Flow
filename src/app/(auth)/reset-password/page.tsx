"use client";

import { useActionState, useState } from "react";
import { resetPassword } from "@/lib/actions/auth";
import type { ActionResponse } from "@/lib/types";

export default function ResetPasswordPage() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);

  const [state, formAction, pending] = useActionState<
    ActionResponse | null,
    FormData
  >(async (_prev, formData) => {
    const password = formData.get("password") as string;

    if (password !== confirmPassword) {
      setMismatch(true);
      return { error: "Passwords do not match" };
    }

    setMismatch(false);
    return await resetPassword(formData);
  }, null);

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center text-background font-bold">
          F
        </div>
        <span className="font-medium text-text text-lg">Flow</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-serif text-text mb-2">
        Set new password
      </h1>
      <p className="text-text-secondary mb-8">
        Choose a strong password for your account
      </p>

      {/* Error message */}
      {(state?.error || mismatch) && (
        <div className="bg-danger-light border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm mb-6">
          {state?.error || "Passwords do not match"}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="uppercase tracking-wider text-xs font-medium text-text-secondary"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="8+ characters"
            required
            minLength={8}
            className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-border-strong transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="uppercase tracking-wider text-xs font-medium text-text-secondary"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setMismatch(false);
            }}
            className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-border-strong transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-background w-full h-12 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
