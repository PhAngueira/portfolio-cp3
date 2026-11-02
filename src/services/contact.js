import { requestJson } from './http.js';
import { normalizeContact } from '../../shared/contact.js';

export function sendContact(values, requestId) {
  return requestJson('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...normalizeContact(values), requestId }),
  });
}
