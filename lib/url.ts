// 'www.naver.com'처럼 프로토콜 없이 저장된 URL도 열 수 있도록 보정
export function normalizeUrl(url: string) {
  const trimmed = url.trim()
  return /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function getDomain(url: string) {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
