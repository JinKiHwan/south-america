import { z } from 'zod';

export const contactLocales = ['ko', 'en', 'es', 'pt'] as const;
const safeLabel = z.string().trim().min(1).max(80).refine((value) => !/[\r\n\0]/.test(value));
export const contactTypeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,80}$/),
  labels: z.object({
    ko: safeLabel,
    en: safeLabel,
    es: safeLabel,
    pt: safeLabel,
  }).strict(),
}).strict();
export type ContactType = z.infer<typeof contactTypeSchema>;

export const defaultContactTypes: ContactType[] = [
  { id: 'materials', labels: {
    ko: '자료 요청 (일대일 제자 양육 교재 PDF 등)', en: 'Request Materials (PDF, etc.)',
    es: 'Solicitar materiales (PDF, etc.)', pt: 'Solicitar materiais (PDF, etc.)',
  } },
  { id: 'prayer', labels: {
    ko: '기도 동역 문의', en: 'Prayer Support',
    es: 'Apoyo en oración', pt: 'Apoio em oração',
  } },
  { id: 'general', labels: {
    ko: '일반 문의', en: 'General Inquiry',
    es: 'Consulta general', pt: 'Consulta geral',
  } },
];
