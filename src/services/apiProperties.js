import { supabase } from './supabase';

export const getProperties = async () => {
  const { data, error } = await supabase.from('properties').select('*');

  if (error) {
    console.error('Error fetching properties:', error);
    throw new Error('No Properties Found');
  }

  return data;
};

// Get one property by ID
export async function getPorpertyById(id) {
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching property:', error);
    throw new Error(error.message);
  }
  console.log('Raw response:', { data, error });
  return data;
}
