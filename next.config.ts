import type { NextConfig } from "next";

const TARGET_ORIGIN = "https://legacalciostudenti.com";

const OLD_HOSTS = [
  "estudentsleague.com",
  "www.estudentsleague.com",
  "estudentsleague.it",
  "www.estudentsleague.it",
] as const;

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return OLD_HOSTS.flatMap((host) => [
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: `${TARGET_ORIGIN}/`,
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host" as const, value: host }],
        destination: `${TARGET_ORIGIN}/:path+`,
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
