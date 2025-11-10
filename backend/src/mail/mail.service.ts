import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    const secure =
      String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
    const ignoreTls =
      String(process.env.SMTP_IGNORE_TLS || '').toLowerCase() === 'true';
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? (secure ? 465 : 587)),
      secure,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
      tls: ignoreTls ? { rejectUnauthorized: false } : undefined,
    });
    this.transporter
      .verify()
      .then(() => {
        console.log('[SMTP] Transporter ready:', {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure,
        });
        console.log('[SMTP] MAIL_FROM at startup:', process.env.MAIL_FROM);
      })
      .catch((err) => {
        console.error('[SMTP] Transporter verify failed:', err?.message || err);
      });
  }

  async sendExchangeRequest(params: {
    to: string;
    fromEmail: string;
    fromName?: string | null;
    senderBooks: { id: number; name: string; author: string }[];
    bookRequested: { id: number; name: string; author: string };
  }) {
    const from = process.env.MAIL_FROM || 'Book Hub <aquatrack04@gmail.com>';
    const subject = `Запит на обмін: ${params.bookRequested.name} — ${params.bookRequested.author}`;
    const booksList = params.senderBooks
      .map((b) => `• ${b.name} — ${b.author} (id: ${b.id})`)
      .join('\n');
    const text = `Ви отримали запит на обмін книжкою "${params.bookRequested.name}" (${params.bookRequested.author}).\n\nВідправник: ${params.fromName || 'Користувач'} <${params.fromEmail}>\n\nЙого книги для обміну:\n${booksList || '— немає доданих книг —'}\n`;
    const booksListHtml = params.senderBooks.length
      ? params.senderBooks
          .map((b) => `<li>${b.name} — ${b.author} (id: ${b.id})</li>`)
          .join('')
      : '<li>— немає доданих книг —</li>';
    const html = `
      <p>Ви отримали запит на обмін книжкою "${params.bookRequested.name}" (${params.bookRequested.author}).</p>
      <p>Відправник: <strong>${params.fromName || 'Користувач'}</strong> &lt;${params.fromEmail}&gt;</p>
      <p>Його книги для обміну:</p>
      <ul>${booksListHtml}</ul>
    `;
    const useEthereal =
      String(process.env.MAIL_TEST_ETHEREAL || '').toLowerCase() === 'true';
    if (useEthereal) {
      console.log('[ETHEREAL] Using FROM:', from);
      const testAccount = await nodemailer.createTestAccount();
      const ethTransport = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      const info = await ethTransport.sendMail({
        from,
        to: params.to || testAccount.user,
        subject,
        text,
        html,
        replyTo: {
          name: params.fromName || 'Користувач',
          address: params.fromEmail,
        },
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('[ETHEREAL] Sent', {
        messageId: info?.messageId,
        previewUrl,
      });
      return { ok: true, previewUrl } as any;
    }
    const dryRun =
      process.env.MAIL_DRY_RUN === 'true' || !process.env.SMTP_HOST;
    if (dryRun) {
      console.log('[MAIL_DRY_RUN] Exchange request email', {
        to: params.to,
        from,
        subject,
        text,
      });
      return { ok: true, dryRun: true } as any;
    }

    try {
      console.log('[SMTP] Using FROM:', from);
      const info = await this.transporter.sendMail({
        from,
        to: params.to,
        subject,
        text,
        html,
        replyTo: {
          name: params.fromName || 'Користувач',
          address: params.fromEmail,
        },
      });
      console.log('[SMTP] Sent', {
        messageId: info?.messageId,
        response: info?.response,
      });
      return { ok: true, messageId: info?.messageId } as any;
    } catch (e) {
      console.error('[SMTP] sendMail error', (e as any)?.message || e);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
