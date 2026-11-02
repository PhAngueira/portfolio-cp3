import { useCallback, useEffect, useState } from 'react';
import { getFeatured } from '../services/featured.js';

export function useFeatured() {
  const [featuredIds, setFeaturedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => {
    window.addEventListener('featured-updated', reload);
    return () => window.removeEventListener('featured-updated', reload);
  }, [reload]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getFeatured({ force: attempt > 0 })
      .then((data) => {
        if (active) setFeaturedIds(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  return { featuredIds, loading, error, reload };
}
