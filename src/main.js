import { createClient } from '@supabase/supabase-js';
import { AuthManager } from './utils/auth.js';
import { Router } from './utils/router.js';
import './styles/main.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const auth = new AuthManager(supabase);
export const router = new Router();

document.addEventListener('DOMContentLoaded', () => {
    auth.init();
    router.init();
});
