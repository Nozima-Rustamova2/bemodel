# Model Agency Website

A two-part app:

- **backend/** — FastAPI + SQLite. Public API for the website, plus an authenticated
  admin API for managing models and uploading photos.
- **frontend/** — Next.js (App Router) + Tailwind. The public site (roster, model
  pages) and the `/admin` dashboard staff will use to add models and upload photos.

## Running locally with Docker (recommended)

```bash
docker compose up --build
```

- Site: http://localhost:3000
- API docs: http://localhost:8000/docs
- Admin panel: http://localhost:3000/admin/login

On first run, a default admin account is created automatically:

- Email: `admin@agency.com`
- Password: `changeme123`

**Change this password immediately** (via `/api/auth/change-password`, or just edit the
`FIRST_ADMIN_EMAIL` / `FIRST_ADMIN_PASSWORD` values before the first run) — it's only
meant to get you into the dashboard once.

Photos and the database persist in Docker volumes (`backend_data`, `backend_uploads`),
so they survive container restarts. To fully wipe and start over: `docker compose down -v`.

## Running without Docker (local dev)

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

**Frontend** (in a second terminal)
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## How photo uploads work

1. Staff log in at `/admin/login`.
2. They create a model profile (name, category, stats, bio) at `/admin/models/new`.
3. On the model's edit page, they drag and drop photos onto the upload zone (multiple
   at once). Photos are automatically resized/optimized on upload.
4. They can drag photos to reorder them, mark one as the "cover" (used as the
   thumbnail across the site), or delete any photo.
5. A model only appears on the public site once "Published" is checked.

## Deploying

- Set a real `SECRET_KEY` and a strong `FIRST_ADMIN_PASSWORD` via environment
  variables — don't leave the defaults in production.
- Update `CORS_ORIGINS` (backend) and `NEXT_PUBLIC_API_URL` (frontend build arg) to
  your real domains once deployed.
- The `backend_uploads` volume holds all uploaded photos — make sure whatever host
  you deploy to has persistent storage attached to it (or swap in S3/Cloudinary later
  if the photo library grows large).
