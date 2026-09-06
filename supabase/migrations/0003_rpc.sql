-- AST Media — fonctions RPC (compteurs, sans exposer d'UPDATE public)
create or replace function public.increment_article_view(p_slug text)
returns void language sql security definer as $$
  update public.articles set view_count = view_count + 1
  where slug = p_slug and status = 'published';
$$;
grant execute on function public.increment_article_view(text) to anon, authenticated;

create or replace function public.report_comment(p_comment_id uuid)
returns void language sql security definer as $$
  update public.comments set report_count = report_count + 1,
    status = case when report_count + 1 >= 3 then 'reported' else status end
  where id = p_comment_id;
$$;
grant execute on function public.report_comment(uuid) to anon, authenticated;
