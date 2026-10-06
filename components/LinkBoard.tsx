'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import * as api from '@/lib/api'
import type { Folder, LinkInput, LinkItem } from '@/lib/types'
import Header from './Header'
import Sidebar from './Sidebar'
import LinkGrid from './LinkGrid'
import LinkFormModal from './LinkFormModal'
import FolderFormModal from './FolderFormModal'
import styles from './LinkBoard.module.css'

type ModalState =
  | { type: 'link'; link?: LinkItem }
  | { type: 'folder'; folder?: Folder }
  | null

type LinkBoardProps = {
  userId: string
  initialFolders: Folder[]
  initialLinks: LinkItem[]
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : '요청에 실패했습니다.'
}

export default function LinkBoard({ userId, initialFolders, initialLinks }: LinkBoardProps) {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [folders, setFolders] = useState(initialFolders)
  const [links, setLinks] = useState(initialLinks)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalState>(null)

  const visibleLinks =
    selectedFolderId === null ? links : links.filter((l) => l.folder_id === selectedFolderId)
  const selectedFolder = folders.find((f) => f.id === selectedFolderId)

  const saveFolder = async (name: string, folder?: Folder) => {
    if (folder) {
      const updated = await api.renameFolder(supabase, userId, folder.id, name)
      setFolders((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
    } else {
      const created = await api.createFolder(supabase, userId, name)
      setFolders((prev) => [...prev, created])
    }
  }

  const removeFolder = async (folder: Folder) => {
    if (!window.confirm(`'${folder.name}' 폴더를 삭제할까요?\n폴더 안의 링크는 삭제되지 않습니다.`)) return
    try {
      await api.deleteFolder(supabase, userId, folder.id)
      setFolders((prev) => prev.filter((f) => f.id !== folder.id))
      setLinks((prev) =>
        prev.map((l) => (l.folder_id === folder.id ? { ...l, folder_id: null } : l))
      )
      if (selectedFolderId === folder.id) setSelectedFolderId(null)
    } catch (err) {
      window.alert(errorMessage(err))
    }
  }

  const saveLink = async (input: LinkInput, link?: LinkItem) => {
    if (link) {
      const updated = await api.updateLink(supabase, userId, link.id, input)
      setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
    } else {
      const created = await api.createLink(supabase, userId, input)
      setLinks((prev) => [created, ...prev])
    }
  }

  const removeLink = async (link: LinkItem) => {
    if (!window.confirm(`'${link.title}' 링크를 삭제할까요?`)) return
    try {
      await api.deleteLink(supabase, userId, link.id)
      setLinks((prev) => prev.filter((l) => l.id !== link.id))
    } catch (err) {
      window.alert(errorMessage(err))
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <div className={styles.page}>
      <Header
        onAddLink={() => setModal({ type: 'link' })}
        onAddFolder={() => setModal({ type: 'folder' })}
        onLogout={logout}
      />
      <div className={styles.body}>
        <Sidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelect={setSelectedFolderId}
          onRename={(folder) => setModal({ type: 'folder', folder })}
          onDelete={removeFolder}
        />
        <LinkGrid
          title={selectedFolder?.name ?? 'ALL'}
          links={visibleLinks}
          folders={folders}
          onEdit={(link) => setModal({ type: 'link', link })}
          onDelete={removeLink}
        />
      </div>

      {modal?.type === 'link' && (
        <LinkFormModal
          link={modal.link}
          folders={folders}
          defaultFolderId={selectedFolderId}
          onSubmit={(input) => saveLink(input, modal.link)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'folder' && (
        <FolderFormModal
          initialName={modal.folder?.name}
          onSubmit={(name) => saveFolder(name, modal.folder)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
