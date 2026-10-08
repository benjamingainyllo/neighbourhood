import { NextResponse } from "next/server";

/*
 * NEWSLETTER CONNECTION
 * The sign-up form sends emails here. Pick your provider by adding these
 * settings in Vercel (Project -> Settings -> Environment Variables) or in a
 * local .env.local file. No code changes needed.
 *
 *   NEWSLETTER_PROVIDER = beehiiv | convertkit | mailchimp
 *
 *   Beehiiv:    BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID
 *   ConvertKit: CONVERTKIT_API_KEY, CONVERTKIT_FORM_ID
 *   Mailchimp:  MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID
 *               (the data centre, e.g. "us21", is read from the end of the API key)
 *
 * With no provider set, sign-ups are accepted and printed to the server log
 * (placeholder mode), so the form works while you decide.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: { email?: unknown; website?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Spam trap: real visitors never fill in the hidden "website" field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ message: "Thanks for subscribing." });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  const provider = (process.env.NEWSLETTER_PROVIDER ?? "").toLowerCase();

  try {
    switch (provider) {
      case "beehiiv":
        await subscribeBeehiiv(email);
        break;
      case "convertkit":
      case "kit":
        await subscribeConvertKit(email);
        break;
      case "mailchimp":
        await subscribeMailchimp(email);
        break;
      default:
        console.log(`[newsletter] Placeholder mode, would subscribe: ${email}`);
    }
  } catch (err) {
    console.error("[newsletter] Subscription failed:", err);
    return NextResponse.json(
      { message: "Sorry, we couldn't sign you up just now. Please try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "You're on the list. Look out for our next letter." });
}

function need(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

async function check(res: Response, provider: string) {
  if (res.ok) return;
  const text = await res.text().catch(() => "");
  throw new Error(`${provider} responded ${res.status}: ${text.slice(0, 300)}`);
}

async function subscribeBeehiiv(email: string) {
  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${need("BEEHIIV_PUBLICATION_ID")}/subscriptions`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${need("BEEHIIV_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, reactivate_existing: true, send_welcome_email: true, utm_source: "website" }),
    },
  );
  await check(res, "Beehiiv");
}

async function subscribeConvertKit(email: string) {
  const res = await fetch(`https://api.convertkit.com/v3/forms/${need("CONVERTKIT_FORM_ID")}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: need("CONVERTKIT_API_KEY"), email }),
  });
  await check(res, "ConvertKit");
}

async function subscribeMailchimp(email: string) {
  const key = need("MAILCHIMP_API_KEY");
  const dc = key.split("-").pop();
  const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${need("MAILCHIMP_AUDIENCE_ID")}/members`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${key}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email, status: "subscribed" }),
  });
  // "Member Exists" is fine: they're already subscribed.
  if (res.status === 400) {
    const json = (await res.clone().json().catch(() => ({}))) as { title?: string };
    if (json.title === "Member Exists") return;
  }
  await check(res, "Mailchimp");
}
