import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const CATEGORIES = [
  'CPU',
  'CPU Cooler',
  'GPU',
  'Motherboard',
  'PC Case',
  'PSU',
  'RAM',
  'SSD'
]

export async function fetchProductsByCategory(category, limit = 20) {
  console.log('Fetching category:', category)
  
  const { data, error } = await supabase
    .from('Product_Catalog')
    .select('*')
    .ilike('category', category)
    .limit(limit)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  console.log('Products found:', data?.length || 0)
  return data
}

export async function fetchFeaturedProducts(limit = 8) {
  const { data, error } = await supabase
    .from('Product_Catalog')
    .select('*')
    .order('Stars', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
  return data
}

export async function searchProducts(query, limit = 20) {
  const { data, error } = await supabase
    .from('Product_Catalog')
    .select('*')
    .ilike('Product_name', `%${query}%`)
    .limit(limit)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }
  return data
}