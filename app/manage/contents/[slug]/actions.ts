"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateManagementApp } from "@/app/_lib/hogedd-api";
import { requireManagementContext } from "@/app/manage/_lib/management-context";

// updateAppは編集フォームを運営APIへ送り、結果を画面状態へ変換します。
export async function updateApp(slug: string, formData: FormData) {
  const title = value(formData, "title");
  const description = value(formData, "description");
  const version = Number(value(formData, "version"));
  const status = value(formData, "status");
  const developmentDrive = value(formData, "development_drive");
  const youtubeUrl = value(formData, "youtube_url");
  const tags = value(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (
    !title ||
    !description ||
    (status !== "private" && status !== "published") ||
    !Number.isSafeInteger(version) ||
    version < 1
  )
    redirect(`/manage/contents/${slug}?error=invalid`);
  const { apiBaseURL, accessToken } = await requireManagementContext();
  const result = await updateManagementApp(apiBaseURL, accessToken, slug, {
    title,
    description,
    tags,
    status,
    development_drive: developmentDrive,
    youtube_url: youtubeUrl,
    version,
  });
  if (result.kind === "not_found") redirect("/manage/contents");
  if (result.kind === "conflict") redirect(`/manage/contents/${slug}?error=conflict`);
  if (result.kind === "invalid") redirect(`/manage/contents/${slug}?error=invalid`);
  if (result.kind !== "ok") redirect(`/manage/contents/${slug}?error=unavailable`);
  revalidatePath("/manage/contents");
  revalidatePath(`/manage/contents/${slug}`);
  redirect(`/manage/contents/${slug}?saved=1`);
}

function value(formData: FormData, key: string): string {
  const result = formData.get(key);
  return typeof result === "string" ? result.trim() : "";
}
