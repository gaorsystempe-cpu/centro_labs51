import { createClient } from '@supabase/supabase-js';
import type { User } from '../types';

// IMPORTANT: Replace with your Supabase project URL and anon key
// In a real project, these would be in environment variables
const placeholderUrl = 'https://your-project-id.supabase.co';
const placeholderKey = 'YOUR_SUPABASE_ANON_KEY';

const supabaseUrl = process.env.SUPABASE_URL || placeholderUrl;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || placeholderKey;

export const isSupabaseConfigured = supabaseUrl !== placeholderUrl && supabaseAnonKey !== placeholderKey;

if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured. Please replace the placeholder values in services/supabaseClient.ts or set environment variables. The application will not work correctly.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This is a helper to get user profile data along with the auth user
export const getSupabaseUser = async (): Promise<User | null> => {
    if (!isSupabaseConfigured) return null;

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;

    // FIX: Query using 'id' which is the PK and FK to auth.users.id
    const { data: userProfile, error } = await supabase
        .from('users')
        .select('*, store_id')
        .eq('id', authUser.id)
        .single();
    
    if(error || !userProfile) {
        console.error("Could not fetch user profile:", error);
        return null;
    }

    // Adapt snake_case from DB to camelCase for the app
    return {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      storeId: userProfile.store_id
    };
}