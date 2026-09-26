"use client";

import { useFormStatus } from "react-dom";
import type { ManagementApp } from "@/app/_lib/hogedd-api";
import { updateApp } from "@/app/manage/contents/[slug]/actions";

export function EditAppForm({ app }: { app: ManagementApp & { version: number } }) {
  const action = updateApp.bind(null, app.slug);
  return (
    <form action={action} className="grid gap-5 border-t border-[var(--border)] pt-6">
      <input type="hidden" name="version" value={app.version} />
      <fieldset className="border-2 border-[var(--foreground)] bg-[var(--surface)] p-4">
        <legend className="px-2 text-sm font-semibold">公開状態</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-[var(--border)] bg-white px-3 text-sm font-semibold has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)] has-[:checked]:text-white">
            <input
              type="radio"
              name="status"
              value="private"
              defaultChecked={app.status !== "published"}
            />
            非公開
          </label>
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-[var(--border)] bg-white px-3 text-sm font-semibold has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)] has-[:checked]:text-white">
            <input
              type="radio"
              name="status"
              value="published"
              defaultChecked={app.status === "published"}
            />
            公開
          </label>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          公開を選ぶと、保存後すぐにHogeDDの一覧へ表示されます。
        </p>
      </fieldset>
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
      <label className="grid gap-2 text-sm font-medium">
        開発動機
        <input
          name="development_drive"
          maxLength={200}
          defaultValue={app.development_drive}
          placeholder="例: 学習DD"
          className="min-h-11 border border-[var(--border)] bg-white px-3 text-base outline-none focus:border-[var(--accent)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        YouTube URL
        <input
          name="youtube_url"
          type="url"
          defaultValue={app.youtube_url}
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
      className="min-h-11 bg-[var(--accent)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "保存中" : "変更を保存"}
    </button>
  );
}
