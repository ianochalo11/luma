import "server-only";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.RESEND_FROM?.trim() || "Luma <onboarding@resend.dev>";
}

/** Minimal HTML matching Luma’s sign-in code email. */
export function buildSignInCodeEmailHtml(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${code} is your Luma sign-in code</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;">
    <tr>
      <td style="padding:40px 32px 56px;">
        <div style="margin-bottom:28px;line-height:0;">
          <svg width="18" height="18" viewBox="0 0 133 134" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#c4c4c8" d="M133 67C96.282 67 66.5 36.994 66.5 0c0 36.994-29.782 67-66.5 67 36.718 0 66.5 30.006 66.5 67 0-36.994 29.782-67 66.5-67"/>
          </svg>
        </div>
        <div style="font-size:36px;font-weight:700;letter-spacing:0.02em;line-height:1.15;color:#111111;">${code}</div>
        <div style="margin-top:12px;font-size:16px;line-height:1.5;color:#111111;">is your Luma sign-in code.</div>
        <p style="margin:28px 0 0;font-size:14px;line-height:1.55;color:#6b7280;">
          Never share this code or enter it anywhere other than the
          <a href="https://luma.com" style="color:#2563eb;text-decoration:underline;">luma.com</a>
          domain or official Luma mobile apps.
        </p>
        <p style="margin:12px 0 0;font-size:14px;line-height:1.55;color:#6b7280;">
          If you didn’t request this code, you can ignore this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildSignInCodeEmailText(code: string): string {
  return `${code}
is your Luma sign-in code.

Never share this code or enter it anywhere other than the luma.com domain or official Luma mobile apps.

If you didn’t request this code, you can ignore this email.`;
}

export async function sendSignInCodeEmail(to: string, code: string) {
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: [to],
    subject: `${code} is your Luma sign-in code`,
    html: buildSignInCodeEmailHtml(code),
    text: buildSignInCodeEmailText(code),
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }
}
