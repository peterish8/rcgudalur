import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching the actual database schema
export type BoardMember = {
  id: string // UUID
  name: string
  designation: string
  created_at: string
}

export type Event = {
  id: string // UUID
  title: string
  description: string | null
  event_date: string // date field
  image_url: string | null
  created_at: string
}

export type Gallery = {
  id: string // UUID
  title: string
  description: string | null
  image_url: string | null
  created_at: string
}

// Alias for backward compatibility
export type GalleryImage = Gallery

// Form types for creating/updating
export type GalleryInput = {
  title: string
  description: string
  image_url: string
}

export type EventInput = {
  title: string
  description: string
  event_date: string
  image_url: string
}

export type BoardMemberInput = {
  designation: string
  name: string
}
