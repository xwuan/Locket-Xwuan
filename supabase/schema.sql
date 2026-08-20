-- =========================================================
-- SUPABASE DATABASE SCHEMA CHO LOCKET DIO
-- Hướng dẫn: Copy và dán toàn bộ đoạn mã này vào Supabase SQL Editor rồi bấm RUN.
-- =========================================================

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- UID người dùng
    email TEXT,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    badge TEXT DEFAULT 'member',
    streak INT DEFAULT 0,
    is_celebrity BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG BÀI ĐĂNG KHOẢNH KHẮC (MOMENTS)
CREATE TABLE IF NOT EXISTS public.moments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT,
    user_avatar TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image', -- 'image' | 'video'
    caption TEXT,
    overlay_id TEXT,
    icon TEXT,
    text_color TEXT,
    color_top TEXT,
    color_bottom TEXT,
    music_url TEXT,
    audience TEXT DEFAULT 'all', -- 'all' | 'selected'
    recipients JSONB DEFAULT '[]'::jsonb,
    date TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG THẢ CẢM XÚC / REACTION (MOMENT_REACTIONS)
CREATE TABLE IF NOT EXISTS public.moment_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    moment_id UUID REFERENCES public.moments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_name TEXT,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG BẠN BÈ (FRIENDS)
CREATE TABLE IF NOT EXISTS public.friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    friend_id TEXT NOT NULL,
    friend_username TEXT,
    friend_name TEXT,
    friend_avatar TEXT,
    status TEXT DEFAULT 'accepted', -- 'pending' | 'accepted' | 'blocked'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)
);

-- 5. BẢNG TIN NHẮN REALTIME (MESSAGES)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_name TEXT,
    recipient_id TEXT NOT NULL,
    message TEXT,
    media_url TEXT,
    media_type TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BẢNG ĐIỂM DANH & STREAK (ROLLCALLS)
CREATE TABLE IF NOT EXISTS public.rollcalls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    checkin_date DATE DEFAULT CURRENT_DATE NOT NULL,
    streak_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_daily_rollcall UNIQUE (user_id, checkin_date)
);

-- 7. BẢNG MẪU CAPTION TÙY CHỈNH (CUSTOM_CAPTIONS)
CREATE TABLE IF NOT EXISTS public.custom_captions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    caption TEXT,
    theme TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================
-- BẬT REALTIME CHO CÁC BẢNG CẦN ĐỒNG BỘ TỨC THÌ
-- =========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.moments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.moment_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.friends;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) - BẬT BẢO MẬT BẢNG
-- Cho phép đọc/ghi công khai hoặc theo policy
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rollcalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_captions ENABLE ROW LEVEL SECURITY;

-- Policies mẫu cho phép truy cập qua Anon Key (có thể tùy chỉnh theo Auth)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Moments viewable by everyone" ON public.moments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert moments" ON public.moments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete own moments" ON public.moments FOR DELETE USING (true);

CREATE POLICY "Reactions viewable by everyone" ON public.moment_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reactions" ON public.moment_reactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Friends viewable by user" ON public.friends FOR SELECT USING (true);
CREATE POLICY "Manage friends" ON public.friends FOR ALL USING (true);

CREATE POLICY "Messages viewable by participants" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Insert messages" ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Rollcalls viewable" ON public.rollcalls FOR ALL USING (true);
CREATE POLICY "Custom captions viewable" ON public.custom_captions FOR ALL USING (true);

-- =========================================================
-- STORAGE BUCKET CONFIGURATION (Cho ảnh & video)
-- Tạo bucket 'moments-media' với quyền public
-- =========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('moments-media', 'moments-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Media Access" ON storage.objects FOR SELECT USING (bucket_id = 'moments-media');
CREATE POLICY "Public Media Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'moments-media');
CREATE POLICY "Public Media Delete" ON storage.objects FOR DELETE USING (bucket_id = 'moments-media');
