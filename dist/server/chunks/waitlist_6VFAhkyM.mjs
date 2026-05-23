import { mkdir, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), "data");
const CSV_FILE = join(DATA_DIR, "waitlist.csv");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POST = async ({ request }) => {
  try {
    let email = "";
    let source = "unknown";
    const ct = request.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const body = await request.json();
      email = String(body.email ?? "").trim();
      source = String(body.source ?? "hero").trim();
    } else {
      const fd = await request.formData();
      email = String(fd.get("email") ?? "").trim();
      source = String(fd.get("source") ?? "form").trim();
    }
    if (!email || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Email invalide." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const safeEmail = email.replace(/[,\n\r"]/g, "");
    const safeSource = source.replace(/[,\n\r"]/g, "");
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
    if (!existsSync(CSV_FILE)) {
      await appendFile(CSV_FILE, "timestamp,email,source\n", "utf8");
    }
    await appendFile(CSV_FILE, `${timestamp},${safeEmail},${safeSource}
`, "utf8");
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[waitlist]", err);
    return new Response(
      JSON.stringify({ ok: false, error: "Erreur serveur." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const GET = () => new Response(JSON.stringify({ error: "Method not allowed" }), {
  status: 405,
  headers: { "Content-Type": "application/json" }
});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
