"use client";

import { useFormStatus } from "react-dom";
import type { ManagementApp } from "@/app/_lib/hogedd-api";
import { updateApp } from "@/app/manage/contents/[slug]/actions";

export function EditAppForm({ app }: { app: ManagementApp & { version: number } }) {
  const action = updateApp.bind(null, app.slug);
  return (
    <form action={action} className="grid gap-5 border-t border-[var(--border)] pt-6">
      <input type="hidden" name="version" value={app.version} />
      <label className="grid gap-2 text-sm font-medium">
        アプリ名
        <input
          name="title"
          required
          maxLength={100}
          defaultValue={app.title}
          className="min-h-11 border border-[var(--border)] bg-white px-3 text-base outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        説明
        <textarea
          name="description"
          required
          maxLength={1000}
          rows={5}
          defaultValue={app.description}
          className="resize-y border border-[var(--border)] bg-white px-3 py-3 text-base outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        タグ
        <input
          name="tags"
          maxLength={300}
          defaultValue={app.tags.join(", ")}
          className="min-h-11 border border-[var(--border)] bg-white px-3 text-base outline-none focus:border-[var(--accent)]"
        />
      </label>
      <div>
        <SubmitButton disabled={app.status !== "preparing"} />
      </div>
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="min-h-11 bg-[var(--accent)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "保存中" : "変更を保存"}
    </button>
  );
}
