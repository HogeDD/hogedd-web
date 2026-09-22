"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateDisplayName } from "@/app/mypage/actions";

type DisplayNameEditorProps = {
  displayName: string;
  error?: string;
  updated?: string;
};

export function DisplayNameEditor({ displayName, error, updated }: DisplayNameEditorProps) {
  const [isEditing, setIsEditing] = useState(Boolean(error));

  if (!isEditing) {
    return (
      <div className="border-y border-[var(--border)] py-5">
        <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center">
          <p className="text-sm font-medium text-[var(--muted)]">表示名</p>
          <p className="min-w-0 break-words text-base font-medium text-[var(--foreground)]">
            {displayName}
          </p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex min-h-11 w-fit items-center justify-center border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            編集
          </button>
        </div>
        {updated ? (
          <p role="status" className="mt-3 text-sm font-medium text-emerald-700 sm:ml-40">
            表示名を更新しました。
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={updateDisplayName} className="border-y border-[var(--border)] py-5">
      <label htmlFor="display_name" className="block text-sm font-medium text-[var(--muted)]">
        表示名
      </label>
      <div className="mt-3 flex max-w-2xl flex-col gap-3 sm:flex-row">
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          maxLength={50}
          autoComplete="nickname"
          defaultValue={displayName}
          autoFocus
          className="min-h-11 min-w-0 flex-1 border border-[var(--border)] bg-white px-4 text-base text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
        <div className="flex gap-2">
          <SaveButton />
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex min-h-11 items-center justify-center border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)] hover:bg-[var(--surface)]"
          >
            キャンセル
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">1〜50文字</p>
      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {error === "invalid"
            ? "表示名を1〜50文字で入力してください。"
            : "更新できませんでした。時間をおいて、もう一度お試しください。"}
        </p>
      ) : null}
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "保存中" : "保存"}
    </button>
  );
}
