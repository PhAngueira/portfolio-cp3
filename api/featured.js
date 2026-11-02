import { readFeaturedIds } from '../server/dashboard.js';
import { endpoint } from '../server/http.js';
import { getServerClient } from '../server/supabase.js';

export default endpoint(['GET'], async () => ({
  featuredIds: await readFeaturedIds(getServerClient()),
}));
