import { newsletterId } from '../../../../shared/newsletter';
import { getDatabase, isFirebaseConfigured } from '../../../lib/firebase';
import {
  pdfByteRange,
  readPdfStream,
  type PdfUploadRecord,
} from '../../../lib/pdf-storage';
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store, private');
  setHeader(event, 'X-Content-Type-Options', 'nosniff');
  const id = newsletterId.safeParse(getRouterParam(event, 'id'));
  if (!id.success || !isFirebaseConfigured())
    throw createError({
      statusCode: 404,
      statusMessage: 'PDF를 찾을 수 없습니다.',
    });
  const db = getDatabase();
  const post = (await db.collection('newsletters').doc(id.data).get()).data();
  if (!post || post.status !== 'published' || !post.attachment)
    throw createError({
      statusCode: 404,
      statusMessage: 'PDF를 찾을 수 없습니다.',
    });
  const record = (
    await db.collection('newsletterUploads').doc(post.attachment.id).get()
  ).data() as PdfUploadRecord | undefined;
  if (!record || record.postId !== id.data || record.state !== 'complete')
    throw createError({
      statusCode: 404,
      statusMessage: 'PDF를 찾을 수 없습니다.',
    });
  setHeader(event, 'Accept-Ranges', 'bytes');
  let range;
  try {
    range = pdfByteRange(getHeader(event, 'range'), record.size);
  } catch (error) {
    setHeader(event, 'Content-Range', 'bytes */' + record.size);
    throw error;
  }
  const stream = await readPdfStream(record, range);
  setHeader(event, 'Content-Type', 'application/pdf');
  setHeader(
    event,
    'Content-Disposition',
    `attachment; filename="newsletter.pdf"; filename*=UTF-8''${encodeURIComponent(record.name).replace(/['()*]/g, (c) => '%' + c.charCodeAt(0).toString(16))}`,
  );
  setHeader(
    event,
    'Content-Length',
    String(range ? range.end - range.start + 1 : record.size),
  );
  if (range) {
    setResponseStatus(event, 206);
    setHeader(
      event,
      'Content-Range',
      `bytes ${range.start}-${range.end}/${record.size}`,
    );
  }
  // Keep Drive files private. Stream bytes without buffering the whole PDF in a function.
  return sendStream(event, stream);
});
