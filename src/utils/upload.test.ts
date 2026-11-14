import { describe, expect, it } from 'vitest';
import { MAX_UPLOAD_BYTES, validateCurriculumFile } from './upload';

const PDF = 'application/pdf';
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

describe('validateCurriculumFile', () => {
  it('accepts PDF and DOCX files', () => {
    expect(validateCurriculumFile({ name: 'chapter.pdf', size: 1024, type: PDF })).toEqual({ ok: true });
    expect(validateCurriculumFile({ name: 'Chapter.DOCX', size: 1024, type: DOCX })).toEqual({ ok: true });
  });

  it('accepts files whose MIME type the browser could not determine', () => {
    expect(validateCurriculumFile({ name: 'chapter.pdf', size: 10, type: '' })).toEqual({ ok: true });
  });

  it('rejects other file types', () => {
    expect(validateCurriculumFile({ name: 'notes.txt', size: 10, type: 'text/plain' })).toMatchObject({
      ok: false,
    });
    expect(validateCurriculumFile({ name: 'fake.pdf', size: 10, type: 'image/png' })).toMatchObject({
      ok: false,
    });
  });

  it('rejects empty files', () => {
    expect(validateCurriculumFile({ name: 'a.pdf', size: 0, type: PDF })).toEqual({
      ok: false,
      error: 'That file is empty.',
    });
  });

  it('enforces the 50 MB limit', () => {
    expect(validateCurriculumFile({ name: 'a.pdf', size: MAX_UPLOAD_BYTES, type: PDF })).toEqual({
      ok: true,
    });
    expect(validateCurriculumFile({ name: 'a.pdf', size: MAX_UPLOAD_BYTES + 1, type: PDF })).toEqual({
      ok: false,
      error: 'That file is larger than 50 MB.',
    });
  });
});
