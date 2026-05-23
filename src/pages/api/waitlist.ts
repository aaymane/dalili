import type { APIRoute } from 'astro';
import { appendFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR  = join(process.cwd(), 'data');
const CSV_FILE  = join(DATA_DIR, 'waitlist.csv');

// Simple email regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse body (JSON or form)
    let email = '';
    let source = 'unknown';

    const ct = request.headers.get('content-type') ?? '';

    if (ct.includes('application/json')) {
      const body = await request.json();
      email  = String(body.email  ?? '').trim();
      source = String(body.source ?? 'hero').trim();
    } else {
      const fd = await request.formData();
      email  = String(fd.get('email')  ?? '').trim();
      source = String(fd.get('source') ?? 'form').trim();
    }

    // Validate
    if (!email || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Email invalide.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitise (strip any commas/newlines that could break CSV)
    const safeEmail  = email.replace(/[,\n\r"]/g, '');
    const safeSource = source.replace(/[,\n\r"]/g, '');
    const timestamp  = new Date().toISOString();

    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    // Write CSV header if new file
    if (!existsSync(CSV_FILE)) {
      await appendFile(CSV_FILE, 'timestamp,email,source\n', 'utf8');
    }

    // Append row
    await appendFile(CSV_FILE, `${timestamp},${safeEmail},${safeSource}\n`, 'utf8');

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[waitlist]', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Erreur serveur.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Block GET
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
