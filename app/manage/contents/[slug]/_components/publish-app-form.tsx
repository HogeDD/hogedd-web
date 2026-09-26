"use client";

import { useFormStatus } from "react-dom";
import type { ManagementApp } from "@/app/_lib/hogedd-api";
import { publishApp } from "@/app/manage/contents/[slug]/publication-actions";

export function PublishAppForm({ app }: { app: ManagementApp & { version: number } }) {
  return (
    <form
      action={publishApp.bind(null, app.slug)}
      className="grid gap-5 border-t border-[var(--border)] pt-6"
    >
      <input type="hidden" name="version" value={app.version} />
      <label className="grid gap-2 text-sm font-medium">
        開発動機
        <input
          name="development_drive"
          required
          maxLength={200}
          placeholder="例: 学習DD"
          className="min-h-11 border border-[var(--border)] bg-white px-3 text-base outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        YouTube URL
        <input
          name="youtube_url"
          type="url"
          required
          placeholder="https://youtu.be/..."
          className="min-h-11 border border-[var(--border)] bg-white px-3 text-base outline-none focus:border-[var(--accent)]"
        />
      </label>
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 bg-[var(--accent)] px-5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "公開中" : "公開する"}
    </button>
  );
}
