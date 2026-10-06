import type { Folder, LinkItem } from '@/lib/types'
import LinkCard from './LinkCard'
import styles from './LinkGrid.module.css'

type LinkGridProps = {
  title: string
  links: LinkItem[]
  folders: Folder[]
  onEdit: (link: LinkItem) => void
  onDelete: (link: LinkItem) => void
}

export default function LinkGrid({ title, links, folders, onEdit, onDelete }: LinkGridProps) {
  const folderNameById = new Map(folders.map((f) => [f.id, f.name]))

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        {title} <span className={styles.count}>{links.length}</span>
      </h2>

      {links.length === 0 ? (
        <p className={styles.empty}>등록된 링크가 없습니다.</p>
      ) : (
        <div className={styles.grid}>
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              folderName={link.folder_id ? folderNameById.get(link.folder_id) : undefined}
              onEdit={() => onEdit(link)}
              onDelete={() => onDelete(link)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
