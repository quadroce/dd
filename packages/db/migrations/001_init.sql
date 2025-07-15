-- Enable required extension for embeddings
create extension if not exists vector;

-- ENUM type for content formats
create type content_type as enum ('article', 'video', 'reddit_thread', 'social_post', 'news', 'podcast');

-- TABLE: sources (origin of content)
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null, -- e.g. 'youtube_api', 'rss', 'reddit_api'
  config_json jsonb,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TABLE: topics (taxonomy)
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  parent_category text,
  description text,
  embedding vector(1536), -- for semantic search
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TABLE: content (core items: articles, videos, etc.)
create table public.content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  content_type content_type not null,
  source_id uuid references public.sources(id) on delete set null,
  language text default 'en',
  raw_text text,
  thumbnail_url text,
  description text,
  embedding vector(1536),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TABLE: content_topics (link content to topics)
create table public.content_topics (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.content(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  relevance_score numeric default 1.0,
  created_at timestamptz default now(),
  unique(content_id, topic_id)
);

-- TABLE: user_preferences (topic selection)
create table public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  weight numeric default 1.0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, topic_id)
);

-- TABLE: user_profile_vectors (aggregated user embedding)
create table public.user_profile_vectors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_embedding vector(1536),
  topics_count integer default 0,
  last_updated timestamptz default now()
);

-- INDEXING
create index idx_content_type on public.content(content_type);
create index idx_content_published_at on public.content(published_at);
create index idx_topics_category on public.topics(category);
create index idx_topics_slug on public.topics(slug);
create index idx_user_preferences_user_id on public.user_preferences(user_id);
create index idx_content_topics_content_id on public.content_topics(content_id);
create index idx_content_topics_topic_id on public.content_topics(topic_id);

-- VECTOR INDEXES
create index on public.content using ivfflat (embedding vector_cosine_ops);
create index on public.user_profile_vectors using ivfflat (profile_embedding vector_cosine_ops);

-- RLS (Row Level Security) Enable + Policies

-- Topics (readable by all, write by authenticated)
alter table public.topics enable row level security;
create policy "Anyone can view topics" on public.topics for select using (true);
create policy "Authenticated users can write topics" on public.topics for insert to authenticated with check (true);
create policy "Authenticated users can update topics" on public.topics for update to authenticated using (true);

-- Content (public read, authenticated insert)
alter table public.content enable row level security;
create policy "Anyone can view content" on public.content for select using (true);
create policy "Authenticated can insert content" on public.content for insert to authenticated with check (true);

-- Content Topics (public read)
alter table public.content_topics enable row level security;
create policy "Anyone can view content_topics" on public.content_topics for select using (true);
create policy "Authenticated can manage content_topics" on public.content_topics for all to authenticated using (true);

-- User Preferences
alter table public.user_preferences enable row level security;
create policy "Users view their preferences" on public.user_preferences for select using (auth.uid() = user_id);
create policy "Users insert their preferences" on public.user_preferences for insert with check (auth.uid() = user_id);
create policy "Users update their preferences" on public.user_preferences for update using (auth.uid() = user_id);
create policy "Users delete their preferences" on public.user_preferences for delete using (auth.uid() = user_id);

-- Profile Vectors
alter table public.user_profile_vectors enable row level security;
create policy "Users view their profile vector" on public.user_profile_vectors for select using (auth.uid() = user_id);
create policy "Users insert their profile vector" on public.user_profile_vectors for insert with check (auth.uid() = user_id);
create policy "Users update their profile vector" on public.user_profile_vectors for update using (auth.uid() = user_id);

-- FUNCTION: update user_profile_vectors automatically
create or replace function update_user_profile_vector()
returns trigger as $$
begin
  insert into public.user_profile_vectors (user_id, topics_count, last_updated)
  values (
    coalesce(new.user_id, old.user_id),
    (select count(*) from public.user_preferences where user_id = coalesce(new.user_id, old.user_id)),
    now()
  )
  on conflict (user_id) do update
  set topics_count = excluded.topics_count,
      last_updated = excluded.last_updated;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- TRIGGER: call function when preferences change
create trigger on_user_preferences_change
after insert or update or delete on public.user_preferences
for each row execute function update_user_profile_vector();
