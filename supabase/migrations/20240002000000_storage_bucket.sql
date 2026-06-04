-- ============================================================
-- Bucket Supabase Storage pour les documents générés
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'generated-documents',
  'generated-documents',
  false,
  52428800, -- 50 MB max par fichier
  array[
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/zip'
  ]
)
on conflict (id) do nothing;

-- Politique : un utilisateur accède uniquement à son propre dossier
create policy "Lecture des documents générés — propriétaire uniquement"
  on storage.objects for select
  using (
    bucket_id = 'generated-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

create policy "Écriture des documents générés — propriétaire uniquement"
  on storage.objects for insert
  with check (
    bucket_id = 'generated-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

create policy "Mise à jour des documents générés — propriétaire uniquement"
  on storage.objects for update
  using (
    bucket_id = 'generated-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

create policy "Suppression des documents générés — propriétaire uniquement"
  on storage.objects for delete
  using (
    bucket_id = 'generated-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );
