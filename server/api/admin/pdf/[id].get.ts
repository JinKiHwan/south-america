import { getDatabase } from '../../../lib/firebase';
import { pdfUploadState } from '../../../lib/pdf-storage';
export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event);
  return withPdfUpload(
    getRouterParam(event, 'id'),
    admin.username,
    async (record) => {
      const next = { ...record, ...(await pdfUploadState(record)) };
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
