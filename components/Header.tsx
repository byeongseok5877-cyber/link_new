import styles from './Header.module.css'

type HeaderProps = {
  onAddLink: () => void
  onAddFolder: () => void
  onLogout: () => void
}

export default function Header({ onAddLink, onAddFolder, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>링크</h1>
      <div className={styles.actions}>
        <button type="button" className={styles.secondary} onClick={onAddFolder}>
          폴더 추가
        </button>
        <button type="button" className={styles.primary} onClick={onAddLink}>
          + ADD LINK
        </button>
        <button type="button" className={styles.text} onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </header>
  )
}
