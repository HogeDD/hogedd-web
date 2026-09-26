"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createManagementApp } from "@/app/_lib/hogedd-api";
import { requireManagementContext } from "@/app/manage/_lib/management-context";

// createAppは入力を整形し、運営APIへ公開準備中Appを登録します。
export async function createApp(formData: FormData) {
  const slug = formValue(formData, "slug");
  const title = formValue(formData, "title");
  const description = formValue(formData, "description");
  const tags = formValue(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (!slug || !title || !description) redirect("/manage/contents?error=invalid");

  const { apiBaseURL, accessToken } = await requireManagementContext();
  const result = await createManagementApp(apiBaseURL, accessToken, {
    slug,
    title,
    description,
    tags,
  });
  if (result.kind === "conflict") redirect("/manage/contents?error=conflict");
  if (result.kind === "invalid") redirect("/manage/contents?error=invalid");
  if (result.kind !== "ok") redirect("/manage/contents?error=unavailable");
  revalidatePath("/manage/contents");
  redirect(`/manage/contents?created=${encodeURIComponent(result.app.slug)}`);
}

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
