import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { Store, ProductWithVariants, Order, User, Category } from '../types';

// --- Store Functions ---

export const getStores = async (): Promise<Store[]> => {
  if (!isSupabaseConfigured) return [];
  // Fetch stores and their related admin user's email
  const { data, error } = await supabase
    .from('stores')
    .select('*, users(email, role)');

  if (error) throw new Error(error.message);

  if (!data) return [];

  // Map the data to include adminEmail directly on the store object
  return data.map(store => {
    // Find the admin user from the nested users array
    const adminUser = Array.isArray(store.users) 
        ? store.users.find((u: any) => u.role === 'ADMIN') 
        : null;
        
    // Create a new object without the nested 'users' array
    const { users, ...storeData } = store;

    return {
      ...storeData,
      adminEmail: adminUser?.email,
    } as Store;
  });
};

export const getStoreById = async (id: string): Promise<Store | undefined> => {
  if (!isSupabaseConfigured) return undefined;
  const { data, error } = await supabase.from('stores').select('*').eq('id', id).single();
  if (error) {
      console.error('Error fetching store by ID:', error);
      return undefined;
  };
  return data || undefined;
};

// This function now securely invokes an edge function to create the store and admin user.
export const createStoreAndAdmin = async (
    storeData: Omit<Store, 'id' | 'createdAt' | 'theme' | 'adminEmail'>, 
    adminEmail: string, 
    adminPassword: string
): Promise<Store> => {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");

    // Invoke the edge function to handle creation securely
    const { data, error } = await supabase.functions.invoke('create-store-and-admin', {
        body: { storeData, adminEmail, adminPassword },
    });

    if (error) {
        // The edge function might return a structured error from its response body
        const errorMessage = data?.error || error.message;
        throw new Error(`${errorMessage}`);
    }

    return data;
};


export const updateStore = async (storeId: string, updates: Partial<Store>): Promise<Store> => {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.from('stores').update(updates).eq('id', storeId).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteStore = async (storeId: string): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  
  // Invoke the edge function to handle the deletion securely.
  const { error } = await supabase.functions.invoke('delete-admin-user', {
    body: { storeId },
  });

  if (error) {
      console.error('Error deleting store via function:', error);
      return false;
  }
  return true;
};

// --- Product, Variant & Category Functions ---

export const getProductsWithVariantsByStoreId = async (storeId: string): Promise<ProductWithVariants[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*), categories(*)')
    .eq('store_id', storeId)
    .eq('is_active', true);
    
  if (error) throw new Error(error.message);
  return (data as any) || [];
};

export const getCategoriesByStoreId = async (storeId: string): Promise<Category[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('categories').select('*').eq('store_id', storeId);
  if (error) throw new Error(error.message);
  return data || [];
};


// --- Order Functions ---

export const getOrdersByStoreId = async (storeId: string): Promise<Order[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('orders').select('*').eq('store_id', storeId);
  if (error) throw new Error(error.message);
  return data?.map(o => ({
    id: o.id,
    store_id: o.store_id,
    customerName: o.customer_name,
    date: o.date,
    total: o.total,
    status: o.status,
  })) || [];
};

// --- Authentication Functions ---

export const authenticateUser = async (email: string, password: string): Promise<User | undefined> => {
    if (!isSupabaseConfigured) return undefined;
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
        console.error("Authentication error:", authError?.message);
        return undefined;
    }

    const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*, store_id')
        .eq('id', authData.user.id)
        .single();

    if (profileError) {
        console.error("Error fetching user profile:", profileError.message);
        await supabase.auth.signOut();
        return undefined;
    }

    return {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      role: profileData.role,
      storeId: profileData.store_id
    } as User;
}

export const sendAdminPasswordReset = async (email: string): Promise<void> => {
  if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
  
  const redirectTo = window.location.origin;

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  
  if (error) {
    if (error.message.includes("For security purposes, you can only request this once every 60 seconds")) {
        throw new Error("Ya se ha enviado un correo de restablecimiento. Por favor, espere un minuto antes de intentarlo de nuevo.");
    }
    throw new Error(`Error al enviar el email: ${error.message}`);
  }
};