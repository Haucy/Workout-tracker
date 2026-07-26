# WorkTrack

Theo dõi tập luyện, lịch tuần, muscle coverage, timer rest, AI lịch tập bằng Gemini.

## Setup

```bash
cp .env.example .env
# điền SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY
node generate-config.mjs
```

Mở `workout-tracker.html`, đăng nhập Google, dùng bình thường.

## Dev

- Backend dùng Supabase, script khởi tạo trong `setup.sql`
- Nếu đổi `.env`, chạy lại `node generate-config.mjs`
- Không commit `.env` và `config.js`
- File `config.local.js` ghi đè `config.js` khi chạy local (không commit)
