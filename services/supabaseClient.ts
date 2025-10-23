import { createClient } from '@supabase/supabase-js';
import type { User } from '../types';

// Las credenciales de Supabase del usuario se han insertado aquí.
const supabaseUrl = process.env.SUPABASE_URL || 'https://pifdckopbvgxgavwftwk.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpZmRja29wYnZneGdhdndmdHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExOTMxMTQsImV4cCI6MjA3Njc2OTExNH0.Pbzd66MN1a1FXnOAKvTJZHhdAg4gTbFAX5RlCw5QM1E';

// La aplicación ahora se considera configurada.
export const isSupabaseConfigured = true;

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