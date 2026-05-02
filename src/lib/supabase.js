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
  'SSD',
  'Uncategorized'
]

export const ALL_CATEGORIES = ['All', ...CATEGORIES]

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

export async function fetchAdminProducts({ category = null, search = '', page = 0, limit = 30 }) {
  const offset = page * limit
  
  let query = supabase
    .from('Product_Catalog')
    .select('*', { count: 'exact', head: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.ilike('Product_name', `%${search}%`)
  }

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching admin products:', error)
    return { products: [], total: 0 }
  }

  let total = count || 0
  
  if (count === null || count === undefined || count < 1000) {
    if (data && data.length > 0) {
      const countQuery = supabase
        .from('Product_Catalog')
        .select('*', { count: 'exact', head: true })
      
      let filteredCountQuery = countQuery
      if (category && category !== 'All') {
        filteredCountQuery = filteredCountQuery.eq('category', category)
      }
      if (search) {
        filteredCountQuery = filteredCountQuery.ilike('Product_name', `%${search}%`)
      }
      
      const { count: exactCount } = await filteredCountQuery
      total = exactCount || data.length
    }
  }

  return { products: data || [], total }
}

export async function updateProductCategory(productId, newCategory) {
  const { data, error } = await supabase
    .from('Product_Catalog')
    .update({ category: newCategory })
    .eq('id', productId)
    .select()

  if (error) {
    console.error('Error updating product category:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export async function deleteProduct(productId) {
  const { data, error } = await supabase
    .from('Product_Catalog')
    .delete()
    .eq('id', productId)
    .select()

  if (error) {
    console.error('Error deleting product:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export async function getCategoryCounts() {
  const batchSize = 1000
  const counts = {}
  let allCount = 0
  let offset = 0
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase
      .from('Product_Catalog')
      .select('category')
      .range(offset, offset + batchSize - 1)

    if (error) {
      console.error('Error getting category counts:', error)
      return { counts: {}, allCount: 0 }
    }

    if (data && data.length > 0) {
      data.forEach(item => {
        const cat = item.category || 'Uncategorized'
        counts[cat] = (counts[cat] || 0) + 1
      })
      allCount += data.length
      offset += batchSize
      
      if (data.length < batchSize) {
        hasMore = false
      }
    } else {
      hasMore = false
    }
  }

  return { counts, allCount }
}