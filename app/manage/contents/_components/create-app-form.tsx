"use client";

import { useFormStatus } from "react-dom";
import { createApp } from "@/app/manage/contents/actions";

export function CreateAppForm() {
  return (
    <form action={createApp} className="grid gap-5 border-t border-[var(--border)] pt-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="アプリ名" name="title" maxLength={100} placeholder="例: HogeDD Quiz" />
        <Field
          label="Slug"
          name="slug"
          maxLength={80}
          placeholder="例: hogedd-quiz"
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
        />
      </div>
      <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
        説明
        <textarea
          name="description"
          required
          maxLength={1000}
          rows={4}
          className="resize-y border border-[var(--border)] bg-white px-3 py-3 text-base outline-none focus:border-[var(--accent)]"
        />
      </label>
      <Field
        label="タグ"
        name="tags"
        maxLength={300}
        placeholder="Game, Next.js（カンマ区切り）"
        required={false}
      />
      <div>
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required = true,
  ...props
}: {
  label: string;
  name: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
      {label}
      <input
        name={name}
        required={required}
        {...props}
        className="min-h-11 border border-[var(--border)] bg-white px-3 text-base outline-none focus:border-[var(--accent)]"
      />
    </label>
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
      {pending ? "登録中" : "Draftを登録"}
    </button>
  );
}
