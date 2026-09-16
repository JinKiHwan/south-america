import { createError } from 'h3';
import { z } from 'zod';
import { defaultContactTypes } from '../../shared/contact-types';

export const CONTACT_RECIPIENT = 'visionthruthebible@gmail.com';

const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .refine((value) => !/[\r\n\0]/.test(value)),
    email: z.string().trim().email().max(254),
    type: z.string().regex(/^[a-z0-9-]{1,80}$/),
    message: z
      .string()
      .trim()
      .min(5)
      .max(5000)
      .refine((value) => !value.includes('\0')),
    website: z.string().max(0).optional().default(''),
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;

export function parseContactInput(value: unknown, allowedTypes: readonly string[] = defaultContactTypes.map((type) => type.id)): ContactInput {
  const result = contactSchema.safeParse(value);
  if (!result.success || !allowedTypes.includes(result.data.type)) {
    throw createError({
      statusCode: 400,
      message: '이름, 이메일과 문의 내용을 확인해주세요.',
    });
  }
  return result.data;
}

export function createContactMail(input: ContactInput, smtpUser: string, typeLabel = defaultContactTypes.find((type) => type.id === input.type)?.labels.ko || input.type) {
  return {
    from: { name: 'Vision Thru the Bible 홈페이지', address: smtpUser },
    to: CONTACT_RECIPIENT,
    replyTo: { name: input.name, address: input.email },
    subject: `[VTB 홈페이지 문의] ${typeLabel} - ${input.name}`,
    text: [
      `이름: ${input.name}`,
      `이메일: ${input.email}`,
      `문의 유형: ${typeLabel}`,
      '',
      '문의 내용:',
      input.message,
    ].join('\n'),
  };
}
