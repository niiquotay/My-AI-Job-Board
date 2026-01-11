
import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: any = null;

if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn('Supabase URL or Anon Key is missing. Check your .env file. Using mock Supabase client.');

    // Create a safe mock that doesn't crash the app but logs errors
    supabaseInstance = {
        auth: {
            signInWithPassword: async () => ({ data: null, error: { message: 'Supabase keys missing' } }),
            signInWithOAuth: async () => ({ data: null, error: { message: 'Supabase keys missing' } }),
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signUp: async () => ({ data: null, error: { message: 'Supabase keys missing' } }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({ data: null, error: { message: 'Supabase keys missing' } }),
            }),
        }),
    };
}

export const supabase = supabaseInstance;
