"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { isValidEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setNoticeMessage("");

    if (!isValidEmail(email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/boards`
        : undefined;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setErrorMessage("Unable to send reset email. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setNoticeMessage("If an account exists for this email, you will receive reset instructions.");
      setIsSubmitting(false);
    } catch {
      setErrorMessage(
        "Unable to reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your network connection."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      {noticeMessage && <p className="text-sm text-muted-foreground">{noticeMessage}</p>}

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset email"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          login
        </Link>
      </p>
    </form>
  );
}
