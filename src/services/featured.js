import { requestJson } from './http.js';

let cached = null;
let expiresAt = 0;
let pending = null;

export function invalidateFeatured() {
  cached = null;
  expiresAt = 0;
  window.dispatchEvent(new Event('featured-updated'));
}

export function getFeatured({ force = false } = {}) {
  if (pending) return pending;
  if (!force && cached && Date.now() < expiresAt) return Promise.resolve(cached);
  pending = requestJson('/api/featured')
    .then((data) => {
      cached = data.featuredIds;
      expiresAt = Date.now() + 60000;
      return cached;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}
