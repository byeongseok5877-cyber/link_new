'use client'

import { createClient } from '@/lib/client'

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
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleKakaoLogin}
        className="rounded-lg bg-[#FEE500] px-6 py-3 font-semibold text-[#191919] hover:bg-[#FADA0A]"
      >
        💬 카카오로 시작하기
      </button>
    </div>
  )
}