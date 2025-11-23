# TinyLink – URL Shortener Application

TinyLink is a web application that allows users to create short links from long URLs.  
It also tracks how many times each short link has been clicked and when it was last accessed.

This project was built as part of a technical assignment.

---

## Live Deployment

Application URL: https://tinylink-vyb4.vercel.app/

---

## Technology Used

- Next.js for both frontend and backend routes
- Neon Postgres as the database
- Material UI (MUI) for UI components

---

## Features

- Create a short URL by providing a long target URL
- Optionally allow the user to provide a custom shortcode
- Each redirect increments a click counter
- Display total clicks and last accessed time
- Ability to delete a short link
- Separate statistics page for each short code

---

## Application Routes

| Path | Purpose | HTTP Method |
|------|---------|-------------|
| / | Dashboard: list, add, delete links | GET |
| /code/:code | Stats page for one link | GET |
| /:code | Redirect to target URL | GET |
| /healthz | Health check | GET |
| /api/links | Create a new link | POST |
| /api/links | List all links | GET |
| /api/links/:code | Get stats for one link | GET |
| /api/links/:code | Delete a link | DELETE |

---

## API Requirements

- The application returns HTTP 409 if a custom code already exists
- Redirect uses status code 302
- Deleted short codes return 404 on redirect

---

## Database Overview

Table contains at least:

- code: Unique shortcode (A–Z, a–z, 0–9, length 6–8)
- target_url: The original long URL
- clicks: Integer count of redirects
- created_at: Timestamp
- last_clicked_at: Timestamp

---

## Environment Variables

Create a .env file with the following keys:

