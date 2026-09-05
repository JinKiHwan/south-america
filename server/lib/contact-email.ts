import { createError } from 'h3';
import { z } from 'zod';

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
    type: z.enum(['materials', 'prayer', 'general']),
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

const typeLabels: Record<ContactInput['type'], string> = {
  materials: '자료 요청',
  prayer: '기도 동역',
  general: '일반 문의',
};

export function parseContactInput(value: unknown): ContactInput {
  const result = contactSchema.safeParse(value);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: '이름, 이메일과 문의 내용을 확인해주세요.',
    });
  }
  return result.data;
}

export function createContactMail(input: ContactInput, smtpUser: string) {
  return {
    from: { name: 'Vision Thru the Bible 홈페이지', address: smtpUser },
    to: CONTACT_RECIPIENT,
    replyTo: { name: input.name, address: input.email },
    subject: `[VTB 홈페이지 문의] ${typeLabels[input.type]} - ${input.name}`,
    text: [
      `이름: ${input.name}`,
      `이메일: ${input.email}`,
      `문의 유형: ${typeLabels[input.type]}`,
      '',
      '문의 내용:',
      input.message,
    ].join('\n'),
  };
}
