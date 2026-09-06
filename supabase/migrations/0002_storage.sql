-- AST Media — stockage des images de couverture
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

create policy "covers public read" on storage.objects for select
  using (bucket_id = 'covers');
create policy "covers admin insert" on storage.objects for insert
  with check (bucket_id = 'covers' and public.is_admin());
create policy "covers admin update" on storage.objects for update
  using (bucket_id = 'covers' and public.is_admin());
create policy "covers admin delete" on storage.objects for delete
  using (bucket_id = 'covers' and public.is_admin());
