"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Github } from "lucide-react";
import { signUp, signInWithOAuth } from "@/lib/actions/auth";
import type { ActionResponse } from "@/lib/types";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState<
    ActionResponse | null,
    FormData
  >(async (_prev, formData) => {
    return await signUp(formData);
  }, null);

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold">
          F
        </div>
        <span className="font-medium text-text text-lg">Flow</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-serif text-text mb-2">
        Create your account
      </h1>
      <p className="text-text-secondary mb-8">
        Start managing projects in minutes
      </p>

      {/* Error message */}
      {state?.error && (
        <div className="bg-danger-light border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm mb-6">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="uppercase tracking-wider text-xs font-medium text-text-secondary"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your full name"
            required
            className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-border-strong transition-colors"
          />
        </div>

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

        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-white w-full h-12 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-xs font-medium uppercase tracking-wider">
          Or
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* OAuth buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => signInWithOAuth("google")}
          className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border rounded-lg h-12 font-medium text-sm text-text hover:bg-surface-hover transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={() => signInWithOAuth("github")}
          className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border rounded-lg h-12 font-medium text-sm text-text hover:bg-surface-hover transition-colors"
        >
          <Github className="w-5 h-5" />
          GitHub
        </button>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-text-secondary mt-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-text font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
