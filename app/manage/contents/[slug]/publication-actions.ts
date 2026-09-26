"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { publishManagementApp } from "@/app/_lib/hogedd-api";
import { requireManagementContext } from "@/app/manage/_lib/management-context";

// publishAppは公開条件を運営APIへ送り、公開結果へ遷移します。
export async function publishApp(slug: string, formData: FormData) {
  const developmentDrive = value(formData, "development_drive");
  const youtubeUrl = value(formData, "youtube_url");
  const version = Number(value(formData, "version"));
  if (!developmentDrive || !youtubeUrl || !Number.isSafeInteger(version) || version < 1)
    redirect(`/manage/contents/${slug}?error=invalid`);
  const { apiBaseURL, accessToken } = await requireManagementContext();
  const result = await publishManagementApp(apiBaseURL, accessToken, slug, {
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
  redirect(`/manage/contents/${slug}?published=1`);
}

function value(formData: FormData, key: string): string {
  const result = formData.get(key);
  return typeof result === "string" ? result.trim() : "";
}
