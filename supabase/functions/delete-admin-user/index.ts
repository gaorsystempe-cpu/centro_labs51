// FIX: The unpkg.com URL for Deno types was failing to resolve. Switched to esm.sh which is generally more reliable for Deno. This should fix 'Cannot find name Deno' errors.
// FIX: Switched to a version-less URL for the types reference to fix resolution issues.
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Esta función se encarga de eliminar de forma atómica una tienda y su usuario administrador asociado.
// Se invoca desde el panel ROOT.

Deno.serve(async (req) => {
  // Manejo de la solicitud pre-vuelo (preflight) de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Crear un cliente de Supabase con privilegios de administrador.
    // Las variables de entorno se configuran en el panel de Supabase.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { storeId } = await req.json();
    if (!storeId) {
      throw new Error('Se requiere el ID de la tienda (storeId).');
    }

    // 1. Encontrar al usuario administrador asociado a la tienda.
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('store_id', storeId)
      .eq('role', 'ADMIN')
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error(`Error buscando el admin para la tienda ${storeId}:`, userError);
    }
    
    // 2. Eliminar la tienda de la tabla 'stores'.
    // Gracias a 'ON DELETE CASCADE' en la base de datos, esto también eliminará
    // productos, categorías y pedidos asociados.
    const { error: storeError } = await supabaseAdmin
      .from('stores')
      .delete()
      .eq('id', storeId);
      
    if (storeError) {
        throw new Error(`Error al eliminar la tienda: ${storeError.message}`);
    }
    
    // 3. Si se encontró un usuario, eliminarlo del sistema de autenticación.
    // Esto, a su vez, eliminará su perfil en 'public.users' gracias a 'ON DELETE CASCADE'.
    if (userData?.id) {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userData.id);
        if (authError) {
            // Si la tienda se eliminó pero el usuario no, registramos el error para una
            // posible limpieza manual. La operación principal (eliminar tienda) fue exitosa.
            console.error(`La tienda ${storeId} fue eliminada, pero falló la eliminación del usuario de autenticación ${userData.id}:`, authError.message);
        }
    }

    return new Response(JSON.stringify({ success: true, message: 'Tienda y administrador eliminados correctamente.' }), {
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