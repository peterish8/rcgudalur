import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Event = {
  id: number
  title: string
  date: string
  description: string
  image_url: string | null
  created_at: string
}

export type BoardMember = {
  id: number
  name: string
  position: string
  year: string
  image_url: string | null
  created_at: string
}

export type GalleryImage = {
  id: number
  image_url: string
  caption: string | null
  created_at: string
}

export type About = {
  id: number
  welcome_title: string
  about_text: string
  created_at: string
}

export type ContactSubmission = {
  name: string
  email?: string
  phone?: string
  message: string
}
