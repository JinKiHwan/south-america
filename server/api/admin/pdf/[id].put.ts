import { PDF_CHUNK_BYTES } from '../../../../shared/newsletter';
import { getDatabase } from '../../../lib/firebase';
import { pdfUploadState, storePdfChunk } from '../../../lib/pdf-storage';
export default defineEventHandler(async (event) => {
  requireSameOrigin(event);
  const admin = await requireAdmin(event);
  if (getHeader(event, 'content-type') !== 'application/pdf')
    throw createError({
      statusCode: 415,
      statusMessage: 'PDF 파일만 업로드할 수 있습니다.',
    });
  return withPdfUpload(
    getRouterParam(event, 'id'),
    admin.username,
    async (record) => {
      const range = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(
        getHeader(event, 'content-range') || '',
      );
      const body = await readLimitedBody(event, PDF_CHUNK_BYTES);
      if (
        !range ||
        Number(range[3]) !== record.size ||
        Number(range[2]) !== Number(range[1]) + body.length - 1 ||
        !body.length ||
        Number(range[2]) >= record.size
      )
        throw createError({
          statusCode: 400,
          statusMessage: '전송할 파일 범위가 올바르지 않습니다.',
        });
      const state = await pdfUploadState(record);
      if (Number(range[1]) !== state.offset || state.state === 'complete')
        throw createError({
          statusCode: 409,
          statusMessage: '업로드 상태를 확인한 뒤 이어 올려주세요.',
        });
      if (
        state.offset === 0 &&
        !/^%PDF-\d\.\d/.test(body.subarray(0, 8).toString('ascii'))
      )
        throw createError({
          statusCode: 400,
          statusMessage: '올바른 PDF 파일이 아닙니다.',
        });
      if (
        Number(range[2]) + 1 < record.size &&
        body.length % (256 * 1024) !== 0
      )
        throw createError({
          statusCode: 400,
          statusMessage: '파일 조각 크기가 올바르지 않습니다.',
        });
      const next = {
        ...record,
        ...(await storePdfChunk({ ...record, ...state }, body)),
      };
      await getDatabase()
        .collection('newsletterUploads')
        .doc(record.id)
        .update({
          offset: next.offset,
          state: next.state,
          remoteId: next.remoteId,
        });
      return uploadDto(next);
    },
  );
});
