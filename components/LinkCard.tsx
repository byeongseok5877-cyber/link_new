import type { LinkItem } from '@/lib/types'
import { getDomain, normalizeUrl } from '@/lib/url'
import styles from './LinkCard.module.css'

type LinkCardProps = {
  link: LinkItem
  folderName?: string
  onEdit: () => void
  onDelete: () => void
}

export default function LinkCard({ link, folderName, onEdit, onDelete }: LinkCardProps) {
  const domain = getDomain(link.url)

  return (
    <div className={styles.card}>
      <a
        href={normalizeUrl(link.url)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <span className={styles.icon}>{domain.charAt(0).toUpperCase()}</span>
        <h3 className={styles.title}>{link.title}</h3>
        {link.description && <p className={styles.description}>{link.description}</p>}
        <div className={styles.bottom}>
          <span className={styles.domain}>{domain}</span>
          {folderName && <span className={styles.tag}>{folderName}</span>}
        </div>
      </a>
      <div className={styles.actions}>
        <button type="button" className={styles.action} onClick={onEdit} aria-label="링크 수정">
          ✎
        </button>
        <button
          type="button"
          className={`${styles.action} ${styles.danger}`}
          onClick={onDelete}
          aria-label="링크 삭제"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
