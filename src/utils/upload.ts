export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/** Value for an <input type="file" accept> attribute. */
export const ACCEPT_ATTRIBUTE = [...ACCEPTED_EXTENSIONS, ...ACCEPTED_MIME_TYPES].join(',');

export type UploadValidation = { ok: true } | { ok: false; error: string };

/** Checks that a curriculum file is a PDF or DOCX no larger than 50 MB. */
export function validateCurriculumFile(file: Pick<File, 'name' | 'size' | 'type'>): UploadValidation {
  const name = file.name.toLowerCase();
  const hasAcceptedExtension = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const hasAcceptedType = file.type === '' || ACCEPTED_MIME_TYPES.includes(file.type);

  if (!hasAcceptedExtension || !hasAcceptedType) {
    return { ok: false, error: 'Please choose a PDF or DOCX file.' };
  }
  if (file.size === 0) {
    return { ok: false, error: 'That file is empty.' };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: 'That file is larger than 50 MB.' };
  }
  return { ok: true };
}
