const SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send";

export function isEmailConfigured(): boolean {
  return !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  fromName = "DernekPro",
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn("[email] SendGrid yapılandırılmamış — e-posta gönderilemedi.");
    return { success: false, error: "E-posta servisi yapılandırılmamış" };
  }

  try {
    const response = await fetch(SENDGRID_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail, name: fromName },
        subject,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[email] SendGrid hatası:", response.status, text);
      return { success: false, error: `SendGrid hatası: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[email] Gönderim hatası:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
}

export function renderTemplate(
  htmlContent: string,
  variables: Record<string, string>
): string {
  let rendered = htmlContent;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return rendered;
}

export async function sendBulkEmail(
  recipients: { email: string; variables?: Record<string, string> }[],
  subject: string,
  htmlTemplate: string,
  fromName?: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const html = recipient.variables
      ? renderTemplate(htmlTemplate, recipient.variables)
      : htmlTemplate;

    const result = await sendEmail({
      to: recipient.email,
      subject,
      html,
      fromName,
    });

    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}
