import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Supabase client — uses modern publishable key (replaces legacy anon key)
// See: https://supabase.com/docs/guides/api/api-keys

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Helper functions for fetching data from Supabase

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}

export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('start_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
  return data
}

export async function getSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('order', { ascending: true })
  
  if (error) {
    console.error('Error fetching social links:', error)
    return []
  }
  return data
}

export async function getFeaturedContent() {
  const { data, error } = await supabase
    .from('featured_content')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching featured content:', error)
    return []
  }
  return data
}

export async function submitContactForm(formData: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({
      ...formData,
      created_at: new Date().toISOString(),
    } as any)
    .select()
  
  if (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }
  return data
}
