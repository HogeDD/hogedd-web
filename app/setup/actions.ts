"use server";

import { redirect } from "next/navigation";
import { auth0 } from "@/app/_lib/auth0";
import { registerAuthenticatedUser, updateCurrentUserProfile } from "@/app/_lib/hogedd-api";

// saveInitialProfileはHogeDD Userの冪等登録後に初回プロフィールを保存します。
export async function saveInitialProfile(formData: FormData) {
  if (!auth0 || !process.env.HOGEDD_API_BASE_URL) redirect("/setup?error=unavailable");

  const displayName = formData.get("display_name");
  if (typeof displayName !== "string" || displayName.trim().length === 0) {
    redirect("/setup?error=invalid");
  }

  let accessToken: string;
  try {
    ({ token: accessToken } = await auth0.getAccessToken());
  } catch {
    redirect("/login");
  }

  const registration = await registerAuthenticatedUser(
    process.env.HOGEDD_API_BASE_URL,
    accessToken,
  );
  if (registration.kind === "unauthorized") redirect("/login");
  if (registration.kind !== "ok") redirect("/setup?error=unavailable");

  const profile = await updateCurrentUserProfile(
    process.env.HOGEDD_API_BASE_URL,
    accessToken,
    displayName,
  );
  if (profile.kind === "unauthorized") redirect("/login");
  if (profile.kind === "invalid") redirect("/setup?error=invalid");
  if (profile.kind !== "ok") redirect("/setup?error=unavailable");
  redirect("/mypage");
}
