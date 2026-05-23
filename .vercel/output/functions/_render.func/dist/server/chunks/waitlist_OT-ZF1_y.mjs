import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_TO = "boyayman388@gmail.com";
const NOTIFY_FROM = "DALILI Waitlist <onboarding@resend.dev>";
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
    const apiKey = undefined                              ;
    if (!apiKey) {
      console.error("[waitlist] RESEND_API_KEY not set");
      return new Response(
        JSON.stringify({ ok: false, error: "Configuration serveur manquante." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const resend = new Resend(apiKey);
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    await resend.emails.send({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: `Nouvelle inscription DALILI — ${email}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#02040F;color:#fff;border-radius:12px">
          <h2 style="margin:0 0 8px;color:#014df8;font-size:22px">Nouvelle inscription liste d'attente</h2>
          <p style="margin:0 0 24px;color:rgba(255,255,255,0.6);font-size:14px">${timestamp}</p>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px;width:80px">Email</td>
              <td style="padding:10px 0;font-weight:600">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:rgba(255,255,255,0.5);font-size:13px">Source</td>
              <td style="padding:10px 0">${source}</td>
            </tr>
          </table>
        </div>
      `
    });
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
