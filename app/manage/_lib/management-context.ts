import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import { auth0 } from "@/app/_lib/auth0";
import { fetchManagementUser, type ManagementUser } from "@/app/_lib/hogedd-api";

export type ManagementContext = {
  accessToken: string;
  apiBaseURL: string;
  user: ManagementUser;
};

// requireManagementContextは、server-sideで運営権限とAPI接続情報を確定します。
export const requireManagementContext = cache(async (): Promise<ManagementContext> => {
  const authClient = auth0;
  const apiBaseURL = process.env.HOGEDD_API_BASE_URL;
  if (!authClient || !apiBaseURL) notFound();

  let accessToken: string;
  try {
    ({ token: accessToken } = await authClient.getAccessToken());
  } catch {
    notFound();
  }

  const result = await fetchManagementUser(apiBaseURL, accessToken);
  if (result.kind !== "ok") notFound();
  return { accessToken, apiBaseURL, user: result.user };
});
