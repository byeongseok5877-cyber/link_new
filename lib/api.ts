import type { SupabaseClient } from '@supabase/supabase-js'
import type { Folder, LinkInput, LinkItem } from './types'

// 모든 쿼리는 owner_id로 한 번 더 걸러서, RLS 정책과 별개로 본인 데이터만 다루도록 한다.

const FOLDER_COLUMNS = 'id, name, created_at'
const LINK_COLUMNS = 'id, url, title, description, thumbnail_url, folder_id, created_at'

export async function fetchFolders(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('folders')
    .select(FOLDER_COLUMNS)
    .eq('owner_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Folder[]
}

export async function fetchLinks(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('links')
    .select(LINK_COLUMNS)
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as LinkItem[]
}

export async function createFolder(supabase: SupabaseClient, userId: string, name: string) {
  const { data, error } = await supabase
    .from('folders')
    .insert({ name, owner_id: userId })
    .select(FOLDER_COLUMNS)
    .single()
  if (error) throw error
  return data as Folder
}

export async function renameFolder(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  name: string
) {
  const { data, error } = await supabase
    .from('folders')
    .update({ name })
    .eq('id', id)
    .eq('owner_id', userId)
    .select(FOLDER_COLUMNS)
    .single()
  if (error) throw error
  return data as Folder
}

export async function deleteFolder(supabase: SupabaseClient, userId: string, id: string) {
  // 폴더 안의 링크는 삭제하지 않고 '폴더 없음'으로 옮긴다 (FK 제약과 무관하게 동작).
  const { error: unlinkError } = await supabase
    .from('links')
    .update({ folder_id: null })
    .eq('folder_id', id)
    .eq('owner_id', userId)
  if (unlinkError) throw unlinkError

  const { error } = await supabase.from('folders').delete().eq('id', id).eq('owner_id', userId)
  if (error) throw error
}

export async function createLink(supabase: SupabaseClient, userId: string, input: LinkInput) {
  const { data, error } = await supabase
    .from('links')
    .insert({ ...input, owner_id: userId })
    .select(LINK_COLUMNS)
    .single()
  if (error) throw error
  return data as LinkItem
}

export async function updateLink(
  supabase: SupabaseClient,
  userId: string,
  id: number,
  input: LinkInput
) {
  const { data, error } = await supabase
    .from('links')
    .update(input)
    .eq('id', id)
    .eq('owner_id', userId)
    .select(LINK_COLUMNS)
    .single()
  if (error) throw error
  return data as LinkItem
}

export async function deleteLink(supabase: SupabaseClient, userId: string, id: number) {
  const { error } = await supabase.from('links').delete().eq('id', id).eq('owner_id', userId)
  if (error) throw error
}
