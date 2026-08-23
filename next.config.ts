import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allows the dev server (JS bundle + HMR) to be reachable when testing on a
  // phone over LAN Wi-Fi — otherwise Next.js blocks those requests and the
  // page never hydrates on the device (menu clicks, animated headings, etc.
  // all silently fail because React never mounts).
  allowedDevOrigins: ["192.168.0.241"],
};

export default nextConfig;
