import fs from "node:fs";
import path from "node:path";

function readEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = readEnv(".env");
const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "GEMINI_API_KEY"];
const missing = required.filter(k => !env[k]);
if (missing.length) {
  console.error("Missing in .env:", missing.join(", "));
  process.exit(1);
}

const out = `const SB_URL = "${env.SUPABASE_URL}";
const SB_ANON_KEY = "${env.SUPABASE_ANON_KEY}";
const GEMINI_API_KEY = "${env.GEMINI_API_KEY}";
`;

fs.writeFileSync("config.js", out);
console.log("Wrote config.js");