"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/actions/auth";
import type { ActionResponse } from "@/lib/types";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<
    ActionResponse | null,
    FormData
  >(async (_prev, formData) => {
    return await forgotPassword(formData);
  }, null);

  const success = state && "data" in state && !state.error;

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
        Reset your password
      </h1>
      <p className="text-text-secondary mb-8">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {/* Success message */}
      {success && (
        <div className="bg-success-light border border-success/20 text-success rounded-lg px-4 py-3 text-sm mb-6">
          Check your email for a password reset link. It may take a few minutes
          to arrive.
        </div>
      )}

      {/* Error message */}
      {state?.error && (
        <div className="bg-danger-light border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm mb-6">
          {state.error}
        </div>
      )}

      {/* Form */}
      {!success && (
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="uppercase tracking-wider text-xs font-medium text-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-border-strong transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="bg-primary text-background w-full h-12 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {pending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      {/* Footer link */}
      <p className="text-center text-sm text-text-secondary mt-8">
        <Link
          href="/login"
          className="text-text font-medium hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
