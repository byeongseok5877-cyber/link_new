import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fetchFolders, fetchLinks } from '@/lib/api'
import LinkBoard from '@/components/LinkBoard'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [folders, links] = await Promise.all([
    fetchFolders(supabase, user.id),
    fetchLinks(supabase, user.id),
  ])

  return <LinkBoard userId={user.id} initialFolders={folders} initialLinks={links} />
}
