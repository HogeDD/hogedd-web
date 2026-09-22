"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth0 } from "@/app/_lib/auth0";
import { updateCurrentUserProfile } from "@/app/_lib/hogedd-api";

// updateDisplayNameは認証済みUser本人の表示名だけを更新します。
export async function updateDisplayName(formData: FormData) {
  if (!auth0 || !process.env.HOGEDD_API_BASE_URL) redirect("/mypage?error=unavailable");
  const displayName = formData.get("display_name");
  if (typeof displayName !== "string" || displayName.trim().length === 0) {
    redirect("/mypage?error=invalid");
  }

  let accessToken: string;
  try {
    ({ token: accessToken } = await auth0.getAccessToken());
  } catch {
    redirect("/login");
  }
  const result = await updateCurrentUserProfile(
    process.env.HOGEDD_API_BASE_URL,
    accessToken,
    displayName,
  );
  if (result.kind === "unauthorized") redirect("/login");
  if (result.kind === "invalid") redirect("/mypage?error=invalid");
  if (result.kind !== "ok") redirect("/mypage?error=unavailable");
  revalidatePath("/mypage");
  redirect("/mypage?updated=1");
}
