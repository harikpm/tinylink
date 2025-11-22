# TinyLink – URL Shortener

TinyLink is a lightweight web application similar to bit.ly.  
Users can shorten long URLs, track click statistics, and manage their links easily.

---

## 🚀 Live Demo
🔗 Deployed URL: *(Add your Vercel/Render deployment link here)*

---

## 🛠️ Tech Stack

- Next.js (frontend + backend routes)
- Neon Postgres (database)
- API REST endpoints
- Tailwind CSS (UI styling)

---

## ✨ Features

- Create short links with optional custom codes
- Automatic redirects with live click tracking
- Track:
  - Total Clicks
  - Last Clicked Time
- Delete links anytime
- Stats page for each short code
- Responsive and polished UI

---

## 📌 Required Routes

| Purpose | Path | Method |
|--------|------|--------|
| Dashboard | `/` | GET |
| Stats Page | `/code/:code` | GET |
| Redirect | `/:code` | GET |
| Health Check | `/healthz` | GET |
| Create Link | `/api/links` | POST |
| List All Links | `/api/links` | GET |
| Link Stats | `/api/links/:code` | GET |
| Delete Link | `/api/links/:code` | DELETE |

---

## 🧪 Health Check Example

```json
{ "ok": true, "version": "1.0" }
