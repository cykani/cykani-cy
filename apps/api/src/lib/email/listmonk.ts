import type { EmailMessage, EmailService } from "./types";

export class ListmonkEmailService implements EmailService {
  private baseUrl: string;
  private apiKey: string;
  private defaultFrom: string;

  constructor(opts: { baseUrl: string; apiKey: string; defaultFrom?: string }) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, "");
    this.apiKey = opts.apiKey;
    this.defaultFrom = opts.defaultFrom ?? "noreply@cykani.app";
  }

  async send(message: EmailMessage): Promise<{ id: number }> {
    const body: Record<string, unknown> = {
      subject: message.subject,
      content: message.html ?? message.body,
      text_content: message.body,
      from: message.from ?? this.defaultFrom,
      reply_to: message.replyTo ?? this.defaultFrom,
      to: message.to,
    };

    if (message.templateId !== undefined) {
      body.template_id = message.templateId;
      body.data = message.data ?? {};
    }

    const res = await fetch(`${this.baseUrl}/api/v1/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Listmonk email failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as { data: { id: number } };
    return { id: data.data.id };
  }
}
