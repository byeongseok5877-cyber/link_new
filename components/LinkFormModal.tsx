'use client'

import { useState, type FormEvent } from 'react'
import type { Folder, LinkInput, LinkItem } from '@/lib/types'
import { normalizeUrl } from '@/lib/url'
import Modal from './Modal'
import styles from './Form.module.css'

type LinkFormModalProps = {
  link?: LinkItem
  folders: Folder[]
  defaultFolderId: string | null
  onSubmit: (input: LinkInput) => Promise<void>
  onClose: () => void
}

export default function LinkFormModal({
  link,
  folders,
  defaultFolderId,
  onSubmit,
  onClose,
}: LinkFormModalProps) {
  const [url, setUrl] = useState(link?.url ?? '')
  const [title, setTitle] = useState(link?.title ?? '')
  const [description, setDescription] = useState(link?.description ?? '')
  const [folderId, setFolderId] = useState(link ? link.folder_id : defaultFolderId)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    const normalized = normalizeUrl(url)
    try {
      new URL(normalized)
    } catch {
      setError('올바른 URL을 입력해주세요.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        url: normalized,
        title: title.trim() || normalized,
        description: description.trim() || null,
        folder_id: folderId,
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      setSubmitting(false)
    }
  }

  return (
    <Modal title={link ? '링크 수정' : '링크 추가'} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          URL
          <input
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            autoFocus
          />
        </label>
        <label className={styles.field}>
          제목
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="비워두면 URL로 저장돼요"
            maxLength={100}
          />
        </label>
        <label className={styles.field}>
          설명
          <textarea
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
          />
        </label>
        <label className={styles.field}>
          폴더
          <select
            className={styles.input}
            value={folderId ?? ''}
            onChange={(e) => setFolderId(e.target.value || null)}
          >
            <option value="">폴더 없음</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
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
