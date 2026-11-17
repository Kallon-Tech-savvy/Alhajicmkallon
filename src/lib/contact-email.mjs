// Server-only contact delivery. No visitor-controlled recipient or sender address.
export const CONTACT_INTENTS = Object.freeze([
  'Clarify an idea',
  'Design and build a product',
  'Improve a product',
  'Something else',
]);

export const SENDER_PROFILES = Object.freeze({
  noreply: { address: 'noreply@alhajikallon.com', label: 'Automated correspondence', signoff: 'Alhaji C M Kallon', note: 'This is an automated message. Please do not reply.' },
  dev: { address: 'dev@alhajikallon.com', label: 'Development correspondence', signoff: 'Alhaji C M Kallon', note: 'Technical and product-development correspondence.' },
  cm: { address: 'cm@alhajikallon.com', label: 'Personal correspondence', signoff: 'Alhaji C M Kallon', note: 'Personal and professional correspondence.' },
  info: { address: 'info@alhajikallon.com', label: 'General enquiries', signoff: 'Alhaji C M Kallon', note: 'General information and enquiries.' },
  contact: { address: 'contact@alhajikallon.com', label: 'Website enquiries', signoff: 'Alhaji C M Kallon', note: 'Sent from the contact form at alhajikallon.com.' },
});

const MAX_BYTES = 16 * 1024;
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const DEV_INTENTS = new Set(['Design and build a product', 'Improve a product']);

function result(status, data) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

export function isValidContactEmail(value) {
  return typeof value === 'string' && value.length <= 254 && value.length >= 3 &&
    !/[\s<>(),;:\r\n]/.test(value) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseContactInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const { name, email, message, intent = '', website = '', turnstileToken } = input;
  if ([name, email, message, intent, website, turnstileToken].some((value) => typeof value !== 'string')) return null;
  const cleaned = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    intent,
    website: website.trim(),
    turnstileToken: turnstileToken.trim(),
  };
  if (cleaned.name.length < 2 || cleaned.name.length > 120 ||
      /[\r\n\x00-\x1f]/.test(cleaned.name) ||
      !isValidContactEmail(cleaned.email) ||
      cleaned.message.length < 10 || cleaned.message.length > 5000 ||
      (cleaned.intent !== '' && !CONTACT_INTENTS.includes(cleaned.intent)) ||
      cleaned.website.length > 0 ||
      cleaned.turnstileToken.length < 1 || cleaned.turnstileToken.length > 2048) return null;
  return cleaned;
}

export function escapeEmailHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function htmlParagraph(value) {
  return escapeEmailHtml(value).replace(/\r?\n/g, '<br>');
}

export function renderSenderEmail(profile, { title, preheader, intro, rows = [], closing }) {
  const heading = escapeEmailHtml(title);
  const detailRows = rows.map(([label, value]) =>
    '<tr><td style="padding:12px 0;border-bottom:1px solid #e6e8ec;vertical-align:top;width:126px;color:#687385;font-size:13px;">' +
    escapeEmailHtml(label) + '</td><td style="padding:12px 0;border-bottom:1px solid #e6e8ec;vertical-align:top;font-size:14px;white-space:normal;overflow-wrap:anywhere;">' +
    htmlParagraph(value) + '</td></tr>'
  ).join('');
  const html = [
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>',
    '<body style="margin:0;padding:24px 12px;background:#f2f4f6;color:#162134;font-family:Arial,Helvetica,sans-serif;">',
    '<div style="display:none!important;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;">',
    escapeEmailHtml(preheader), '</div>',
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e9ef;border-collapse:collapse;">',
    '<tr><td style="padding:28px 32px 18px;border-bottom:2px solid #ba995d;">',
    '<div style="font-family:Georgia,serif;font-size:22px;letter-spacing:-.5px;">Alhaji C M Kallon</div>',
    '<div style="font-size:11px;color:#657185;margin-top:8px;letter-spacing:1px;text-transform:uppercase;">',
    escapeEmailHtml(profile.label), '</div></td></tr>',
    '<tr><td style="padding:32px;line-height:1.65;"><h1 style="font-family:Georgia,serif;font-size:26px;font-weight:normal;line-height:1.25;margin:0 0 20px;">',
    heading, '</h1><p style="margin:0 0 22px;font-size:15px;">', htmlParagraph(intro), '</p>',
    detailRows ? '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:24px;">' + detailRows + '</table>' : '',
    '<p style="margin:0;font-size:14px;">', htmlParagraph(closing || profile.signoff), '</p></td></tr>',
    '<tr><td style="padding:20px 32px;border-top:1px solid #e5e9ef;font-size:12px;line-height:1.6;color:#657185;">',
    escapeEmailHtml(profile.note), '<br>alhajikallon.com</td></tr></table></body></html>'
  ].join('');
  const text = [title, '', intro, '', ...rows.map(([label, value]) => label + ': ' + value),
    '', closing || profile.signoff, '', profile.note, 'alhajikallon.com'].join('\n');
  return { html, text };
}

export function buildNotification(enquiry) {
  const purpose = enquiry.intent || 'General enquiry';
  return {
    from: 'Alhaji C M Kallon <' + SENDER_PROFILES.contact.address + '>',
    reply_to: enquiry.email,
    subject: 'Website enquiry: ' + purpose,
    ...renderSenderEmail(SENDER_PROFILES.contact, {
      title: 'New website enquiry',
      preheader: 'New message from ' + enquiry.name,
      intro: 'Someone has contacted you through alhajikallon.com.',
      rows: [['Name', enquiry.name], ['Email', enquiry.email], ['Topic', purpose], ['Message', enquiry.message]],
      closing: 'Reply to this message to contact the sender.',
    }),
  };
}

export function buildReceipt(enquiry) {
  return {
    from: 'Alhaji C M Kallon <' + SENDER_PROFILES.noreply.address + '>',
    to: [enquiry.email],
    subject: 'Your enquiry was submitted',
    ...renderSenderEmail(SENDER_PROFILES.noreply, {
      title: 'Thank you for reaching out',
      preheader: 'Your website enquiry has been submitted.',
      intro: 'Hello ' + enquiry.name + ', your message has been submitted for review. I will respond when I can.',
      closing: 'Alhaji C M Kallon',
    }),
  };
}

async function readLimitedJson(request) {
  if (!request.body) throw new SyntaxError('Missing request body');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let raw = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        throw new RangeError('Body too large');
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    return JSON.parse(raw);
  } finally {
    reader.releaseLock();
  }
}

function allowedOrigins(env) {
  const allowed = new Set(['https://alhajikallon.com', 'https://www.alhajikallon.com']);
  if (env.NEXT_PUBLIC_SITE_URL) {
    try {
      const configured = new URL(env.NEXT_PUBLIC_SITE_URL);
      if (configured.protocol === 'https:') allowed.add(configured.origin);
    } catch { /* malformed configuration cannot widen accepted origins */ }
  }
  if (env.NODE_ENV !== 'production') {
    allowed.add('http://localhost:3000');
    allowed.add('http://127.0.0.1:3000');
  }
  return allowed;
}

async function sendResendEmail(fetcher, apiKey, email) {
  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(email),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return false;
  const data = await response.json();
  return typeof data?.id === 'string' && data.id.length > 0;
}

/** Dependency injection permits tests without sending real email. */
export function createContactHandler({
  getEnv = () => process.env,
  fetcher = (...args) => fetch(...args),
  logger = console,
} = {}) {
  return async function POST(request) {
    const env = getEnv();
    const origin = request.headers.get('origin');
    const permitted = allowedOrigins(env);
    if (!origin || !permitted.has(origin) ||
        (request.headers.get('sec-fetch-site') &&
         request.headers.get('sec-fetch-site') !== 'same-origin')) {
      return result(403, { error: 'Request not allowed.' });
    }
    if (!/^application\/json(?:\s*;\s*charset\s*=\s*utf-8)?$/i.test(request.headers.get('content-type') || '')) {
      return result(415, { error: 'JSON is required.' });
    }
    const length = request.headers.get('content-length');
    if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) {
      return result(413, { error: 'Request is too large.' });
    }
    let input;
    try {
      input = await readLimitedJson(request);
    } catch (error) {
      return result(error instanceof RangeError ? 413 : 400, { error: 'Invalid request.' });
    }
    const enquiry = parseContactInput(input);
    if (!enquiry) return result(422, { error: 'Please check your details and verification.' });

    // Fail closed: a missing secret never makes the form an unauthenticated email relay.
    const defaultInbox = env.CONTACT_TO_EMAIL;
    const developmentInbox = env.CONTACT_DEV_TO_EMAIL;
    const turnstileSecret = env.TURNSTILE_SECRET || env.TURNSTILE_SECRET_KEY;
    if (!env.RESEND_API_KEY || !turnstileSecret || !isValidContactEmail(defaultInbox) ||
        (developmentInbox && !isValidContactEmail(developmentInbox))) {
      return result(503, { error: 'The contact service is unavailable.' });
    }

    let verified;
    try {
      const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: turnstileSecret, response: enquiry.turnstileToken }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error('Turnstile unavailable');
      verified = await response.json();
    } catch {
      logger.warn('contact_verification_unavailable');
      return result(503, { error: 'Verification is temporarily unavailable.' });
    }
    // Both the widget action and the real site it was solved on must match
    // this request. An allowed-but-different hostname is not sufficient.
    const verifiedHostname = verified?.hostname;
    const expectedHostname = new URL(origin).hostname;
    if (verified?.success !== true ||
        verified?.action !== 'contact' ||
        verifiedHostname !== expectedHostname) {
      return result(422, { error: 'Verification expired or failed. Please retry.' });
    }

    const to = DEV_INTENTS.has(enquiry.intent) && developmentInbox ? developmentInbox : defaultInbox;
    const notification = { ...buildNotification(enquiry), to: [to] };
    try {
      if (!await sendResendEmail(fetcher, env.RESEND_API_KEY, notification)) {
        logger.warn('contact_delivery_rejected');
        return result(502, { error: 'The message could not be accepted. Please try again.' });
      }
    } catch {
      logger.warn('contact_delivery_unavailable');
      return result(502, { error: 'Delivery could not be confirmed. Please check before resending.' });
    }

    // Optional; a receipt failure must never hide a successful primary submission.
    // Enable only after considering email abuse and configuring a working reply inbox.
    if (env.CONTACT_CONFIRMATION_ENABLED === '1') {
      try {
        if (!await sendResendEmail(fetcher, env.RESEND_API_KEY, buildReceipt(enquiry))) {
          logger.warn('contact_receipt_rejected');
        }
      } catch {
        logger.warn('contact_receipt_unavailable');
      }
    }
    return result(200, { ok: true });
  };
}
