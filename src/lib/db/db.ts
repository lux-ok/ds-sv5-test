import { createClient } from '@supabase/supabase-js';

const dbUrl = import.meta.env.VITE_DB_URL;
const dbKey = import.meta.env.VITE_DB_ANON_KEY;
const dbClient = createClient(dbUrl, dbKey);

export const db = () => dbClient;
