import { pdfStorageProvider } from '../../../lib/pdf-storage';
import { PDF_CHUNK_BYTES, PDF_MAX_BYTES } from '../../../../shared/newsletter';
export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const provider = pdfStorageProvider();
  return {
    configured: Boolean(provider),
    provider,
    chunkBytes: PDF_CHUNK_BYTES,
    maxBytes: PDF_MAX_BYTES,
  };
});
