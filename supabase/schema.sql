-- Create the projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by text not null,
  parents_names text not null,
  gender_preference text not null check (gender_preference in ('boy', 'girl', 'either'))
);

-- Create the suggestions table
create table public.suggestions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  gender text not null check (gender in ('boy', 'girl')),
  suggested_by text not null,
  likes integer default 0 not null,
  is_favorite boolean default false not null
);

-- Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.suggestions enable row level security;

-- Create policies that allow all operations for now
-- In a production environment, you'd want to restrict this based on user authentication
create policy "Enable all operations for projects"
  on public.projects
  for all
  using (true)
  with check (true);

create policy "Enable all operations for suggestions"
  on public.suggestions
  for all
  using (true)
  with check (true);

-- Create indexes for better performance
create index suggestions_project_id_idx on public.suggestions(project_id);
create index suggestions_created_at_idx on public.suggestions(created_at);
create index suggestions_likes_idx on public.suggestions(likes desc);
