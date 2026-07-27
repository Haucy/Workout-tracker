# WorkTrack

Theo dõi tập luyện, lịch tuần, muscle coverage, timer rest, AI lịch tập bằng Gemini.

## Chạy local

```bash
cp .env.example .env
# điền SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY
node generate-config.mjs
```

Mở `workout-tracker.html` — app tự fallback sang `config.js` khi không truy cập được `/api/config`.

## Deploy lên Vercel

1. Push repo lên GitHub (đã có ở `Haucy/Workout-tracker`).
2. Vào https://vercel.com → **Add New Project** → import repo.
3. **Không cần đổi gì** trong Build Settings — Vercel auto-detect file tĩnh + folder `api/` làm serverless functions.
4. Vào **Settings → Environment Variables**, thêm 3 biến:
   - `SUPABASE_URL` — URL project Supabase (vd: `https://xxx.supabase.co`)
   - `SUPABASE_ANON_KEY` — anon key từ Supabase dashboard
   - `GEMINI_API_KEY` — Gemini API key dạng `AIza...` (lấy từ https://aistudio.google.com/app/apikey)
5. Bấm **Deploy**.
6. Sau khi deploy xong, vào **Supabase Dashboard → Authentication → URL Configuration**, thêm URL Vercel vào **Redirect URLs** (vd: `https://workout-tracker-xxx.vercel.app`).

### Cách lấy Gemini API key đúng dạng

Trên file local, bạn đang dùng key dạng `AQ....` — đó là **Application Default Credentials**, không gọi được qua REST từ browser. Cần lấy key dạng `AIza...`:

1. Vào https://aistudio.google.com/app/apikey
2. Bấm **Create API key**
3. Copy key `AIzaSy...` → paste vào Vercel env var `GEMINI_API_KEY`

## Cấu trúc

```
workout-tracker.html     # App chính (single-file HTML)
api/config.js            # Vercel serverless function: trả config từ env vars
setup.sql                # Tạo table app_data + RLS policy trong Supabase
generate-config.mjs      # Build config.js từ .env (cho local dev)
config.js.example        # Template config.js
.env.example             # Template .env
.git/hooks/pre-commit    # Chặn commit lộ API key (Supabase, Gemini, AWS, OpenAI, ...)
```

## Supabase setup

Chạy `setup.sql` trong Supabase SQL Editor 1 lần để tạo table `app_data` + RLS policy.

Trong Supabase Dashboard → **Authentication → Providers**, bật **Google**, điền OAuth Client ID/Secret từ Google Cloud Console.

Trong Supabase Dashboard → **Authentication → URL Configuration**, thêm URL app (Vercel URL + `http://localhost` cho dev) vào **Redirect URLs**.

## Bảo mật

- Repo public OK vì keys không commit. Hook `pre-commit` tự động chặn commit có pattern key.
- Trên Vercel, keys nằm trong Environment Variables (encrypted), app gọi qua `/api/config`.
- Trên local, keys nằm trong `config.js` (đã ignore) — chỉ máy bạn có.