// Free a TCP port before `next dev` binds it.
// Kills any stray server (a previous dev/start that didn't exit, which on
// Windows keeps a lock on .next and desyncs the next run). Cross-platform,
// no dependencies. Best-effort: every failure is swallowed so it never
// blocks `npm run dev`.
import { execSync } from "node:child_process";

const port = process.argv[2] || "3000";
const run = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString();

const pids = new Set();
try {
  if (process.platform === "win32") {
    // netstat columns: Proto  Local Address  Foreign Address  State  PID
    for (const line of run("netstat -ano -p tcp").split("\n")) {
      const p = line.trim().split(/\s+/);
      if (p.length >= 5 && p[3] === "LISTENING" && p[1].endsWith(`:${port}`)) pids.add(p[4]);
    }
  } else {
    for (const pid of run(`lsof -ti tcp:${port}`).split("\n")) {
      const t = pid.trim();
      if (t) pids.add(t);
    }
  }
} catch {
  // nothing listening on the port — the common, happy case
}

for (const pid of pids) {
  if (!pid || pid === "0") continue;
  try {
    execSync(process.platform === "win32" ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`, { stdio: "ignore" });
    console.log(`[free-port] freed :${port} (pid ${pid})`);
  } catch {
    // process already gone or not ours to kill
  }
}
