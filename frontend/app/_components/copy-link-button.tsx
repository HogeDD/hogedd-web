"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyLinkButton({
  value,
  label = "URLをコピー",
  className = "",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      className={[
        "inline-flex items-center justify-center rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition",
        "hover:bg-[var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        className,
      ].join(" ")}
    >
      {copied ? "コピー済み" : label}
    </button>
  );
}
