"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AppLaunchTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const match = pathname.match(/^\/apps\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
    if (match) void fetch(`/api/apps/${match[1]}/launches`, { method: "POST", keepalive: true });
  }, [pathname]);
  return null;
}
