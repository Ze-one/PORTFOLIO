const CONTACT_TO = 'abdel.samad@ets.ntech.org';

function clean(value: unknown, max = 2000) {
  return String(value || '').trim().slice(0, max);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendWithSendGrid(input: { name: string; email: string; subject: string; message: string }) {
  const apiKey = process.env.SENDGRID_API_KEY || '';
  if (!apiKey) return { configured: false };

  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || CONTACT_TO;
  const fromName = process.env.CONTACT_FROM_NAME || 'Abdel Samad Portfolio';
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message).replace(/\n/g, '<br />');

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: CONTACT_TO }],
          subject: `Portfolio Contact: ${input.subject}`
        }
      ],
      from: { email: fromEmail, name: fromName },
      reply_to: { email: input.email, name: input.name },
      content: [
        {
          type: 'text/plain',
          value: `New portfolio contact message\n\nName: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`
        },
        {
          type: 'text/html',
          value: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a"><h2>New portfolio contact message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Subject:</strong> ${safeSubject}</p><div style="margin-top:16px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px"><strong>Message</strong><br />${safeMessage}</div></div>`
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`SendGrid failed with status ${response.status}: ${detail}`);
  }

  return { configured: true };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const name = clean(req.body?.name, 120);
    const email = clean(req.body?.email, 180).toLowerCase();
    const subject = clean(req.body?.subject, 180);
    const message = clean(req.body?.message, 5000);
    const website = clean(req.body?.website, 200);

    // Hidden honeypot field: real users leave this empty.
    if (website) {
      res.status(200).json({ success: true });
      return;
    }

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: 'Name, email, subject and message are required.' });
      return;
    }

    if (!isEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const result = await sendWithSendGrid({ name, email, subject, message });
    if (!result.configured) {
      res.status(500).json({ error: 'Email service is not configured. Add SENDGRID_API_KEY and CONTACT_FROM_EMAIL in Vercel environment variables.' });
      return;
    }

    res.status(200).json({ success: true, to: CONTACT_TO });
  } catch (error: any) {
    console.error('[CONTACT_FORM]', error?.message || error);
    res.status(500).json({ error: 'Message could not be sent. Please try again or email directly.' });
  }
}
