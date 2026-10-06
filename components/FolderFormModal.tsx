'use client'

import { useState, type FormEvent } from 'react'
import Modal from './Modal'
import styles from './Form.module.css'

type FolderFormModalProps = {
  initialName?: string
  onSubmit: (name: string) => Promise<void>
  onClose: () => void
}

export default function FolderFormModal({ initialName, onSubmit, onClose }: FolderFormModalProps) {
  const [name, setName] = useState(initialName ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(trimmed)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      setSubmitting(false)
    }
  }

  return (
    <Modal title={initialName ? '폴더 이름 변경' : '폴더 추가'} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          폴더 이름
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            required
            autoFocus
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.buttons}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            취소
          </button>
          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? '저장 중…' : '저장'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
