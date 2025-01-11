-- Initial table creation
do $$ 
begin
  if not exists (select 1 from pg_tables where tablename = 'projects') then
    create table public.projects (
      id uuid default gen_random_uuid() primary key,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      created_by text not null,
      parents_names text not null,
      gender_preference text not null
    );

    alter table public.projects 
    add constraint projects_gender_preference_check 
    check (gender_preference in ('boy', 'girl', 'either'));
  end if;

  if not exists (select 1 from pg_tables where tablename = 'suggestions') then
    create table public.suggestions (
      id uuid default gen_random_uuid() primary key,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      project_id uuid references public.projects(id) on delete cascade not null,
      name text not null,
      gender text not null,
      suggested_by text not null,
      likes integer default 0 not null,
      is_favorite boolean default false not null
    );

    alter table public.suggestions 
    add constraint suggestions_gender_check 
    check (gender in ('boy', 'girl'));

    alter table public.suggestions 
    add constraint suggestions_likes_check 
    check (likes >= 0);
  end if;
end $$;

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.suggestions enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Enable all operations for projects" on public.projects;
drop policy if exists "Enable all operations for suggestions" on public.suggestions;

-- Create new specific policies
do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Enable read access to all projects') then
    create policy "Enable read access to all projects"
      on public.projects for select
      using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Enable insert access to all projects') then
    create policy "Enable insert access to all projects"
      on public.projects for insert
      with check (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Enable read access to all suggestions') then
    create policy "Enable read access to all suggestions"
      on public.suggestions for select
      using (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Enable insert access to all suggestions') then
    create policy "Enable insert access to all suggestions"
      on public.suggestions for insert
      with check (true);
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Enable update access to all suggestions') then
    create policy "Enable update access to all suggestions"
      on public.suggestions for update
      using (true)
      with check (true);
  end if;
end $$;

-- Create indexes if they don't exist
do $$ 
begin
  if not exists (select 1 from pg_indexes where indexname = 'suggestions_project_id_idx') then
    create index suggestions_project_id_idx on public.suggestions(project_id);
  end if;

  if not exists (select 1 from pg_indexes where indexname = 'suggestions_created_at_idx') then
    create index suggestions_created_at_idx on public.suggestions(created_at desc);
  end if;

  if not exists (select 1 from pg_indexes where indexname = 'suggestions_likes_idx') then
    create index suggestions_likes_idx on public.suggestions(likes desc);
  end if;

  if not exists (select 1 from pg_indexes where indexname = 'suggestions_is_favorite_idx') then
    create index suggestions_is_favorite_idx on public.suggestions(is_favorite);
  end if;

  if not exists (select 1 from pg_indexes where indexname = 'suggestions_gender_idx') then
    create index suggestions_gender_idx on public.suggestions(gender);
  end if;

  if not exists (select 1 from pg_indexes where indexname = 'suggestions_project_filters_idx') then
    create index suggestions_project_filters_idx on public.suggestions(project_id, gender, is_favorite, likes);
  end if;
end $$;

-- Create or replace the increment_likes function
create or replace function increment_likes(suggestion_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  new_likes integer;
begin
  update public.suggestions
  set likes = likes + 1
  where id = suggestion_id
  returning likes into new_likes;
  
  return new_likes;
end;
$$;
