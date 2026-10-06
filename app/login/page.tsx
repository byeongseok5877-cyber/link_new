'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleKakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        // 로그인 완료 후 돌려보낼 주소
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">링크 보관함</h1>
        <p className="text-sm text-gray-500 mb-8">
          나만의 소중한 링크들을 한곳에서 안전하게 관리하세요
        </p>

        {/* 카카오 로그인 버튼 */}
        <button
          onClick={handleKakaoLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3.5 px-4 font-semibold text-[#191919] hover:bg-[#FADA0A] transition shadow-sm cursor-pointer"
        >
          <span>💬</span> 카카오로 시작하기
        </button>
      </div>
    </div>
  )
}