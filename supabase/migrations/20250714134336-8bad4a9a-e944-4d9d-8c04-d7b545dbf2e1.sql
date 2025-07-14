-- Criar o usuário admin padrão walter@ledmkt.com
-- Primeiro, inserir o usuário na tabela auth.users (simulando)
-- Como não podemos inserir diretamente em auth.users, vamos criar uma função que será executada manualmente

-- Inserir o perfil do usuário admin no profiles (será usado quando o usuário se cadastrar)
INSERT INTO public.profiles (user_id, name, email, avatar, bio, preferences)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- UUID fictício que será substituído pelo UUID real do Supabase
  'Walter Admin', 
  'walter@ledmkt.com',
  '/src/assets/default-user-avatar.png',
  'Administrador do sistema Chathy',
  '{"theme": "light", "language": "pt-BR", "role": "admin"}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  preferences = EXCLUDED.preferences;

-- Comentário: O usuário walter@ledmkt.com deve ser criado manualmente no Supabase Auth
-- com a senha 976431 e depois o UUID deve ser atualizado nesta tabela profiles