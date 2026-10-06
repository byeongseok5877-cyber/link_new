-- 로그인한 사용자가 자기 데이터만 읽고 쓸 수 있도록 RLS 정책을 설정한다.
-- Supabase 대시보드 > SQL Editor에서 실행하세요.

alter table public.folders alter column owner_id set default auth.uid();
alter table public.links   alter column owner_id set default auth.uid();

alter table public.folders enable row level security;
alter table public.links   enable row level security;

-- 기존 정책 이름이 다르면 대시보드(Authentication > Policies)에서 먼저 정리하세요.
-- 특히 anon(비로그인)에게 SELECT를 허용하는 정책이 있으면 삭제해야 합니다.
drop policy if exists "folders_owner_all" on public.folders;
create policy "folders_owner_all" on public.folders
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "links_owner_all" on public.links;
create policy "links_owner_all" on public.links
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
