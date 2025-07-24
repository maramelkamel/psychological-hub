import { supabase } from './supabase';


export const getUserRole = async (userId) => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.log('No admin role found or failed to fetch:', error.message);
    return null;
  }

  return data.role;
};


