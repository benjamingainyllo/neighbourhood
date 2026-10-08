"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

/** The email form itself. Sends to /api/subscribe, which forwards to your newsletter provider. */
export function NewsletterForm({ tone = "light", source }: { tone?: "light" | "dark"; source?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"), // spam trap, real people leave this empty
          source,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(json.message || "Something went wrong. Please try again.");
      setStatus("success");
      setMessage(json.message || "You're on the list. Look out for our next letter.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const dark = tone === "dark";
  const id = `email-${source ?? "newsletter"}`;

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-0 sm:border-b ${dark ? "sm:border-paper" : "sm:border-ink"}`}>
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className={`min-w-0 flex-1 border-b bg-transparent py-3 text-base focus:outline-none sm:border-b-0 ${
            dark ? "border-paper placeholder:text-paper/50" : "border-ink placeholder:text-muted"
          }`}
        />
        {/* Hidden from people; bots fill it in */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`label h-12 shrink-0 px-6 transition-colors disabled:opacity-60 sm:h-auto sm:self-stretch ${
            dark ? "bg-paper text-ink hover:bg-accent hover:text-paper" : "bg-ink text-paper hover:bg-accent"
          }`}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${status === "error" ? "text-accent" : dark ? "text-paper/80" : "text-ink-soft"}`}
      >
        {message}
      </p>
    </form>
  );
}
