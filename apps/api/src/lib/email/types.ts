export interface EmailMessage {
  to: string[];
  subject: string;
  body: string;
  html?: string;
  from?: string;
  replyTo?: string;
  templateId?: number;
  data?: Record<string, unknown>;
}

export interface EmailService {
  send(message: EmailMessage): Promise<{ id: number }>;
}
