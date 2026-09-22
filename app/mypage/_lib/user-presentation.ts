import type { RegisteredUser } from "@/app/_lib/hogedd-api";

const roleLabels: Record<RegisteredUser["role"], string> = {
  owner: "オーナー",
  admin: "管理者",
  member: "メンバー",
};

const statusLabels: Record<RegisteredUser["status"], string> = {
  active: "利用中",
  disabled: "利用停止",
};

// presentUserは、APIのUser表現をマイページ用の日本語表示へ変換します。
export function presentUser(user: RegisteredUser) {
  return {
    email: user.email,
    emailVerification: user.email_verified ? "確認済み" : "未確認",
    role: roleLabels[user.role],
    status: statusLabels[user.status],
    registeredAt: new Intl.DateTimeFormat("ja-JP", {
      dateStyle: "long",
      timeZone: "Asia/Tokyo",
    }).format(new Date(user.created_at)),
  };
}
