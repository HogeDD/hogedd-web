import { describe, expect, it } from "vitest";
import { presentUser } from "@/app/mypage/_lib/user-presentation";

describe("My Page User presentation", () => {
  it("maps persisted account values to Japanese labels", () => {
    expect(
      presentUser({
        id: "0199-user",
        email: "owner@example.com",
        email_verified: true,
        role: "owner",
        status: "active",
        created_at: "2026-09-22T00:00:00Z",
        updated_at: "2026-09-22T00:00:00Z",
      }),
    ).toEqual({
      email: "owner@example.com",
      emailVerification: "確認済み",
      role: "オーナー",
      status: "利用中",
      registeredAt: "2026年9月22日",
    });
  });
});
