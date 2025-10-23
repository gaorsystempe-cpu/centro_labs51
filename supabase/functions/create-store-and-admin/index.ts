// FIX: Using a specific, versioned URL for Deno types from esm.sh resolves issues with the type checker not finding the definition file and recognizing Deno globals.
/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { storeData, adminEmail, adminPassword } = await req.json();
    
    if (!storeData || !adminEmail || !adminPassword) {
      throw new Error('Faltan datos de la tienda, email o contraseña del administrador.');
    }

    // 1. Create the Auth User using the admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm the email so the admin can log in immediately
    });

    if (authError || !authData.user) {
      throw new Error(`Error creando el usuario administrador: ${authError?.message}`);
    }
    const adminUserId = authData.user.id;

    // 2. Create the Store
    const defaultTheme = {
      primaryColor: '#6366F1',
      secondaryColor: '#6B7280',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      font: 'Inter, sans-serif'
    };
    
    const storePayload = {
      ...storeData,
      theme: defaultTheme,
    };
    
    const { data: newStore, error: storeError } = await supabaseAdmin.from('stores').insert(storePayload).select().single();

    if (storeError || !newStore) {
      // Cleanup: delete the auth user we just created
      await supabaseAdmin.auth.admin.deleteUser(adminUserId);
      throw new Error(`Error creando la tienda: ${storeError?.message}`);
    }

    // 3. Create the User Profile and link it to the store
    const userProfile = {
      id: adminUserId,
      name: storeData.owner, // Use owner name for the user profile
      email: adminEmail,
      role: 'ADMIN',
      store_id: newStore.id,
    };

    const { error: profileError } = await supabaseAdmin.from('users').insert(userProfile);

    if (profileError) {
      // Cleanup: delete auth user and the store
      await supabaseAdmin.auth.admin.deleteUser(adminUserId);
      await supabaseAdmin.from('stores').delete().eq('id', newStore.id);
      throw new Error(`Error creando el perfil del usuario: ${profileError.message}`);
    }
    
    return new Response(JSON.stringify(newStore), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});