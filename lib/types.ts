// Supabase 테이블 행 구조 (public.folders / public.links)
export type Folder = {
  id: string
  name: string
  created_at: string
}

export type LinkItem = {
  id: number
  url: string
  title: string
  description: string | null
  thumbnail_url: string | null
  folder_id: string | null
  created_at: string
}

export type LinkInput = {
  url: string
  title: string
  description: string | null
  folder_id: string | null
}
