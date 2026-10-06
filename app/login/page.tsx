'use client'

import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function LoginPage() {
  const handleKakaoLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.logo}>링크</h1>
      <button onClick={handleKakaoLogin} className={styles.kakao}>
        💬 카카오로 시작하기
      </button>
    </div>
  )
}
