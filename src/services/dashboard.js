import { requestJson } from './http.js';
import { invalidateFeatured } from './featured.js';

export function loadDashboard(token) {
  return requestJson('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } });
}

export async function updateDashboard(token, payload) {
  const result = await requestJson('/api/dashboard', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (payload.action === 'feature') invalidateFeatured();
  return result;
}
