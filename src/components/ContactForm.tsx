"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Message from ${name || "the website"}`;
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-bold uppercase tracking-wide text-muted">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-wood/30 bg-card px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terracotta"
          placeholder="Your name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide text-muted">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-wood/30 bg-card px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terracotta"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-wide text-muted">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none rounded-xl border border-wood/30 bg-card px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terracotta"
          placeholder="Which home are you interested in, and what dates are you thinking?"
        />
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-card transition-colors hover:bg-terracotta-dark"
      >
        <Send className="h-4 w-4" strokeWidth={2.2} />
        Send message
      </button>
      <p className="text-center text-[11px] leading-relaxed text-muted">
        This opens your email app with the message ready to send to Eddie directly.
      </p>
    </form>
  );
}
