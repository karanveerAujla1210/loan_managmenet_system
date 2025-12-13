import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty) => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['b','i','em','strong','a','p','ul','ol','li','br'], ALLOWED_ATTR: ['href','rel','target'] });
};

export default sanitizeHtml;
