-- AST Media — catégories initiales
insert into public.categories (name, slug, sort_order) values
  ('Société', 'societe', 1),
  ('Politique', 'politique', 2),
  ('Sport', 'sport', 3),
  ('Culture', 'culture', 4),
  ('Économie', 'economie', 5),
  ('Technologie', 'technologie', 6),
  ('Éducation', 'education', 7),
  ('Santé', 'sante', 8),
  ('International', 'international', 9)
on conflict (slug) do nothing;
