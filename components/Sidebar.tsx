import type { Folder } from '@/lib/types'
import styles from './Sidebar.module.css'

type SidebarProps = {
  folders: Folder[]
  selectedFolderId: string | null
  onSelect: (folderId: string | null) => void
  onRename: (folder: Folder) => void
  onDelete: (folder: Folder) => void
}

export default function Sidebar({
  folders,
  selectedFolderId,
  onSelect,
  onRename,
  onDelete,
}: SidebarProps) {
  const itemClass = (active: boolean) =>
    active ? `${styles.item} ${styles.active}` : styles.item

  return (
    <aside className={styles.sidebar}>
      <button
        type="button"
        className={itemClass(selectedFolderId === null)}
        onClick={() => onSelect(null)}
      >
        ALL
      </button>

      <p className={styles.label}>폴더</p>
      {folders.length === 0 && <p className={styles.empty}>폴더가 없습니다.</p>}
      <ul className={styles.list}>
        {folders.map((folder) => (
          <li key={folder.id} className={styles.row}>
            <button
              type="button"
              className={itemClass(selectedFolderId === folder.id)}
              onClick={() => onSelect(folder.id)}
            >
              📁 {folder.name}
            </button>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.action}
                onClick={() => onRename(folder)}
                aria-label={`${folder.name} 이름 변경`}
              >
                ✎
              </button>
              <button
                type="button"
                className={`${styles.action} ${styles.danger}`}
                onClick={() => onDelete(folder)}
                aria-label={`${folder.name} 삭제`}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
