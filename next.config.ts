import type { NextConfig } from "next";

const defaultAllowedDevOrigins = ["192.168.10.102"];
const allowedDevOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedDevOrigins ?? defaultAllowedDevOrigins,
};

export default nextConfig;
