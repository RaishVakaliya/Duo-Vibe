create index if not exists idx_profiles_invite_code
  on public.profiles (invite_code);

create index if not exists idx_profiles_partner_id
  on public.profiles (partner_id);

create index if not exists idx_couples_user1_id_status
  on public.couples (user1_id, status);

create index if not exists idx_couples_user2_id_status
  on public.couples (user2_id, status);

create index if not exists idx_couples_user1_user2
  on public.couples (user1_id, user2_id);
 
create index if not exists idx_quiz_sessions_reviewer_status_created
  on public.quiz_sessions (reviewer_id, status, created_at desc);

create index if not exists idx_quiz_sessions_answerer_status_created
  on public.quiz_sessions (answerer_id, status, created_at desc);

create index if not exists idx_quiz_answers_session_id
  on public.quiz_answers (session_id);

create index if not exists idx_chat_messages_couple_key_read_at
  on public.chat_messages (couple_key, read_at)
  where read_at is null;

create index if not exists idx_chat_messages_sender_id
  on public.chat_messages (sender_id);

create index if not exists idx_memories_couple_key_dates
  on public.memories (couple_key, memory_date desc, created_at desc);

create index if not exists idx_memory_reactions_memory_id
  on public.memory_reactions (memory_id);

create index if not exists idx_ccp_user_a_id
  on public.couple_challenge_progress (user_a_id);

create index if not exists idx_ccp_user_b_id
  on public.couple_challenge_progress (user_b_id);

create index if not exists idx_secret_crush_sender_id
  on public.secret_crush_messages (sender_id);

create index if not exists idx_spark_answers_user_id
  on public.spark_answers (user_id);

create index if not exists idx_spark_answers_spark_id
  on public.spark_answers (spark_id);