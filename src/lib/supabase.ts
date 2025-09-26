import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Storage functions
export const uploadImage = async (file: File, folder: string = 'properties') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (url: string) => {
  if (!url) return;
  
  // Extract file path from URL
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const folder = urlParts[urlParts.length - 2];
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
    .from('images')
    .remove([filePath]);

  if (error) console.error('Error deleting image:', error);
};

// Delete multiple images
export const deleteImages = async (urls: string[]) => {
  if (!urls || urls.length === 0) return;
  
  const filePaths = urls.map(url => {
    if (!url) return null;
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    return `${folder}/${fileName}`;
  }).filter(Boolean) as string[];

  if (filePaths.length === 0) return;

  const { error } = await supabase.storage
    .from('images')
    .remove(filePaths);

  if (error) console.error('Error deleting images:', error);
};

// Types
export interface Property {
  id?: string;
  title: string;
  description?: string;
  price?: number;
  listing_type?: 'vendita' | 'affitto';
  listing_type?: 'vendita' | 'affitto';
  city?: string;
  province?: string;
  property_type?: string;
  rooms?: number;
  bathrooms?: number;
  square_meters?: number;
  features?: string;
  energy_class?: string;
  images?: string[];
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  content?: string;
  images?: string[];
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export interface Analytics {
  id?: string;
  path: string;
  views?: number;
  timestamp?: string;
}