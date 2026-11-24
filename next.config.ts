import type { NextConfig } from "next";

const TARGET_ORIGIN = "https://www.legacalciostudenti.com";

const OLD_HOSTS = [
  "estudentsleague.com",
  "www.estudentsleague.com",
  "estudentsleague.it",
  "www.estudentsleague.it",
] as const;

const PATH_MAP: { source: string; destination: string }[] = [
  {
    source: "/competitions/roma-school-cup",
    destination: "/competizioni/colosseo-cup",
  },
  {
    source: "/competitions/roma-school-cup/:path*",
    destination: "/competizioni/colosseo-cup",
  },
  {
    source: "/competitions/:slug/blog/:post",
    destination: "/competizioni/:slug/blog/:post",
  },
  {
    source: "/competitions/:slug/squadre/:team",
    destination: "/competizioni/:slug/squadre/:team",
  },
  {
    source: "/competitions/:slug/partite",
    destination: "/competizioni/:slug/partite",
  },
  {
    source: "/competitions/:slug/classifica",
    destination: "/competizioni/:slug/classifica",
  },
  {
    source: "/competitions/:slug/squadre",
    destination: "/competizioni/:slug/squadre",
  },
  {
    source: "/competitions/:slug/blog",
    destination: "/competizioni/:slug/blog",
  },
  {
    source: "/competitions/:slug/info",
    destination: "/competizioni/:slug/info",
  },
  {
    source: "/competitions/:slug/statistiche",
    destination: "/competizioni/:slug/statistiche",
  },
  {
    source: "/competitions/:slug/staff",
    destination: "/competizioni/:slug",
  },
  {
    source: "/competitions/:slug/:path*",
    destination: "/competizioni/:slug",
  },
  {
    source: "/competitions/:slug",
    destination: "/competizioni/:slug",
  },
  {
    source: "/competitions",
    destination: "/#competizioni",
  },
  {
    source: "/partite",
    destination: "/#competizioni",
  },
  {
    source: "/squadre",
    destination: "/#competizioni",
  },
  {
    source: "/classifica",
    destination: "/#competizioni",
  },
  {
    source: "/team",
    destination: "/#mission",
  },
  {
    source: "/partner",
    destination: "/collabora",
  },
  {
    source: "/",
    destination: "/",
  },
  {
    source: "/:path+",
    destination: "/:path+",
  },
];

function redirectsForHost(host?: string) {
  return PATH_MAP.map((rule) => ({
    source: rule.source,
    destination: `${TARGET_ORIGIN}${rule.destination}`,
    permanent: true,
    ...(host
      ? { has: [{ type: "host" as const, value: host }] }
      : {}),
  }));
}

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...OLD_HOSTS.flatMap((host) => redirectsForHost(host)),
      // Same map without a host filter so preview URLs and local `next start`
      // 308 in one hop; fetch() cannot set the Host header.
      ...redirectsForHost(),
    ];
  },
};

export default nextConfig;
