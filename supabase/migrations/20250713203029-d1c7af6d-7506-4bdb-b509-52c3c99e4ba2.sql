-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de perfis de usuário (conectada ao auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT DEFAULT '/src/assets/default-user-avatar.png',
  bio TEXT DEFAULT 'Olá! Sou um usuário do Chathy.',
  preferences JSONB DEFAULT '{"theme": "light", "language": "pt-BR"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de agentes
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id TEXT NOT NULL, -- ID customizado do agente
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  experience TEXT NOT NULL,
  approach TEXT NOT NULL,
  guidelines TEXT NOT NULL,
  persona_style TEXT NOT NULL,
  documentation TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Criar tabela de grupos
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  group_id TEXT NOT NULL, -- ID customizado do grupo
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  members TEXT[] NOT NULL, -- Array de IDs dos agentes
  is_default BOOLEAN DEFAULT false,
  created_by TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, group_id)
);

-- Criar tabela de mensagens de chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_id TEXT NOT NULL, -- ID da mensagem customizado
  agent_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'agent', 'psychologist')),
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de mensagens de grupo
CREATE TABLE public.group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_id TEXT NOT NULL, -- ID da mensagem customizado
  group_id TEXT NOT NULL,
  agent_id TEXT,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'agent', 'psychologist')),
  sender_name TEXT,
  sender_avatar TEXT,
  mentions TEXT[], -- IDs dos agentes mencionados
  is_response BOOLEAN DEFAULT false,
  responding_to TEXT, -- ID da mensagem que está respondendo
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de memória dos agentes
CREATE TABLE public.agent_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id TEXT NOT NULL,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  personal_notes TEXT DEFAULT '',
  preferences JSONB DEFAULT '{}'::jsonb,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- Criar tabela de salas virtuais
CREATE TABLE public.virtual_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  room_id TEXT NOT NULL, -- ID customizado da sala
  agent_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  environment TEXT NOT NULL,
  memories JSONB DEFAULT '{}'::jsonb,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, room_id)
);

-- Criar tabela de diretrizes
CREATE TABLE public.guidelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de documentos
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de compromissos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  agent_id TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de protocolos de consulta
CREATE TABLE public.consultation_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb,
  agent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de interações com agentes
CREATE TABLE public.agent_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de disclaimers diários
CREATE TABLE public.daily_disclaimers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  acknowledged BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Habilitar Row Level Security em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_disclaimers ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Criar políticas RLS para agents
CREATE POLICY "Users can view their own agents" 
ON public.agents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents" 
ON public.agents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
ON public.agents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
ON public.agents FOR DELETE 
USING (auth.uid() = user_id);

-- Criar políticas RLS para groups
CREATE POLICY "Users can view their own groups" 
ON public.groups FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own groups" 
ON public.groups FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own groups" 
ON public.groups FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own groups" 
ON public.groups FOR DELETE 
USING (auth.uid() = user_id);

-- Criar políticas RLS para chat_messages
CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Criar políticas RLS para group_messages
CREATE POLICY "Users can view their own group messages" 
ON public.group_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own group messages" 
ON public.group_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Criar políticas RLS para agent_memory
CREATE POLICY "Users can view their own agent memory" 
ON public.agent_memory FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agent memory" 
ON public.agent_memory FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent memory" 
ON public.agent_memory FOR UPDATE 
USING (auth.uid() = user_id);

-- Criar políticas RLS para virtual_rooms
CREATE POLICY "Users can view their own virtual rooms" 
ON public.virtual_rooms FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own virtual rooms" 
ON public.virtual_rooms FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own virtual rooms" 
ON public.virtual_rooms FOR UPDATE 
USING (auth.uid() = user_id);

-- Aplicar políticas similares para todas as outras tabelas
CREATE POLICY "Users can view their own guidelines" ON public.guidelines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own guidelines" ON public.guidelines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own guidelines" ON public.guidelines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own guidelines" ON public.guidelines FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own documents" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own appointments" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own consultation protocols" ON public.consultation_protocols FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own consultation protocols" ON public.consultation_protocols FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own consultation protocols" ON public.consultation_protocols FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own consultation protocols" ON public.consultation_protocols FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own agent interactions" ON public.agent_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own agent interactions" ON public.agent_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily disclaimers" ON public.daily_disclaimers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own daily disclaimers" ON public.daily_disclaimers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily disclaimers" ON public.daily_disclaimers FOR UPDATE USING (auth.uid() = user_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para updated_at em todas as tabelas relevantes
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_agents
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_groups
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_guidelines
  BEFORE UPDATE ON public.guidelines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_documents
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_appointments
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_consultation_protocols
  BEFORE UPDATE ON public.consultation_protocols
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Criar função para auto-criar perfil quando um usuário é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para auto-criar perfil
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();