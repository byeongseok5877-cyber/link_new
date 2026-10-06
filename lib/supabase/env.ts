// NEXT_PUBLIC_* 값은 빌드 시점에 인라인되므로 반드시 process.env.XXX 형태로 직접 참조해야 한다.
// 모듈 로드 시점이 아니라 호출 시점에 검사해서, 환경변수가 없어도 정적 페이지 빌드가 깨지지 않게 한다.
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수가 설정되지 않았습니다.'
    )
  }

  return { url, anonKey }
}
