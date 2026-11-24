const TARGET_ORIGIN = "https://www.legacalciostudenti.com";

const DEFAULT_HOSTS = [
  "estudentsleague.com",
  "www.estudentsleague.com",
  "estudentsleague.it",
  "www.estudentsleague.it",
];

const CASES = [
  { path: "/", location: `${TARGET_ORIGIN}/` },
  {
    path: "/competitions/leonessa-cup",
    location: `${TARGET_ORIGIN}/competizioni/leonessa-cup`,
  },
  {
    path: "/competitions/roma-school-cup",
    location: `${TARGET_ORIGIN}/competizioni/colosseo-cup`,
  },
  {
    path: "/competitions/leonessa-cup/classifica",
    location: `${TARGET_ORIGIN}/competizioni/leonessa-cup/classifica`,
  },
  { path: "/partner", location: `${TARGET_ORIGIN}/collabora` },
  { path: "/team", location: `${TARGET_ORIGIN}/#mission` },
  {
    path: "/competitions",
    location: `${TARGET_ORIGIN}/#competizioni`,
  },
  {
    path: "/competitions/roma-school-cup/classifica",
    location: `${TARGET_ORIGIN}/competizioni/colosseo-cup`,
  },
  {
    path: "/competitions/leonessa-cup/staff",
    location: `${TARGET_ORIGIN}/competizioni/leonessa-cup`,
  },
  {
    path: "/pagina-inventata-xyz?foo=bar",
    location: `${TARGET_ORIGIN}/pagina-inventata-xyz?foo=bar`,
  },
];

function parseArgs(argv) {
  const envBase = process.env.BASE_URL?.trim();
  const envHosts = process.env.HOSTS?.trim();
  let baseUrl = envBase || "";
  let hostsArg = envHosts || "";
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--base-url" || arg === "--base") {
      baseUrl = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (arg.startsWith("--base-url=")) {
      baseUrl = arg.slice("--base-url=".length);
      continue;
    }
    if (arg === "--hosts") {
      hostsArg = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (arg.startsWith("--hosts=")) {
      hostsArg = arg.slice("--hosts=".length);
      continue;
    }
    positional.push(arg);
  }

  if (!baseUrl && positional[0]) {
    baseUrl = positional[0];
  }
  if (!hostsArg && positional[1]) {
    hostsArg = positional[1];
  }

  const hosts = hostsArg
    ? hostsArg
        .split(",")
        .map((host) => host.trim())
        .filter(Boolean)
    : baseUrl
      ? ["(base)"]
      : DEFAULT_HOSTS;

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    hosts,
  };
}

function requestUrl(baseUrl, host, path) {
  if (baseUrl) {
    return `${baseUrl}${path}`;
  }
  return `https://${host}${path}`;
}

async function checkOne(baseUrl, host, testCase) {
  const url = requestUrl(baseUrl, host, testCase.path);
  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
  });
  const location = response.headers.get("location");
  const statusOk = response.status === 301 || response.status === 308;
  const locationOk = location === testCase.location;
  const ok = statusOk && locationOk;

  return {
    ok,
    host,
    path: testCase.path,
    url,
    status: response.status,
    location,
    expectedLocation: testCase.location,
  };
}

function formatResult(result) {
  const mark = result.ok ? "PASS" : "FAIL";
  const label = result.host === "(base)" ? result.path : `${result.host}${result.path}`;
  const lines = [
    `${mark}  ${label}`,
    `      request:  ${result.url}`,
    `      status:   ${result.status} (expected 301 or 308)`,
    `      location: ${result.location ?? "(missing)"}`,
  ];
  if (!result.ok) {
    lines.push(`      expected: ${result.expectedLocation}`);
  }
  return lines.join("\n");
}

async function main() {
  const { baseUrl, hosts } = parseArgs(process.argv.slice(2));

  if (!baseUrl && hosts.length === 0) {
    console.error(
      "Pass BASE_URL (preview or local) or HOSTS (comma-separated old domains).",
    );
    process.exit(1);
  }

  console.log(
    baseUrl
      ? `Checking ${CASES.length} paths via ${baseUrl}`
      : `Checking ${CASES.length} paths on ${hosts.length} hosts`,
  );

  const results = [];
  for (const host of hosts) {
    for (const testCase of CASES) {
      try {
        results.push(await checkOne(baseUrl, host, testCase));
      } catch (error) {
        results.push({
          ok: false,
          host,
          path: testCase.path,
          url: requestUrl(baseUrl, host, testCase.path),
          status: 0,
          location: null,
          expectedLocation: testCase.location,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  for (const result of results) {
    console.log(formatResult(result));
    if ("error" in result && result.error) {
      console.log(`      error:    ${result.error}`);
    }
  }

  const failed = results.filter((result) => !result.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} passed, ${failed.length} failed`,
  );
  process.exit(failed.length === 0 ? 0 : 1);
}

main();
