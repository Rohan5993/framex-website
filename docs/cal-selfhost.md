# Cal Self-Hosting (Docker) + FrameX Styling

This site already uses a branded in-page booking popup. To self-host Cal and keep this design, run Cal in Docker and point this site to your self-hosted booking URL.

## 1) Run Cal with Docker

Use the official Cal Docker setup:

1. Clone Cal:
   - `git clone https://github.com/calcom/cal.diy.git`
2. Enter directory:
   - `cd cal.diy`
3. Create env:
   - `cp .env.example .env`
4. Generate required secrets and paste into `.env`:
   - `openssl rand -base64 32` for `NEXTAUTH_SECRET`
   - `openssl rand -base64 24` for `CALENDSO_ENCRYPTION_KEY`
5. Start stack:
   - `docker compose up -d`

After setup, Cal is usually available at `http://localhost:3000`.

## 2) Point this website to self-hosted Cal

In this repo:

1. Copy env file:
   - `cp .env.example .env`
2. Set your hosted booking URL:
   - `VITE_CAL_BOOKING_URL=http://localhost:3000/<your-username>/<event-slug>`
3. Restart Vite:
   - `npm run dev`

All `Book a call` buttons now use that URL and open in the branded popup.

## 3) Premium look notes

- The popup shell (overlay, header, close button, spacing, shadows) is controlled in:
  - `src/hooks/useFxInteractions.js`
- The page inside the iframe is Cal-owned UI. Style that part via Cal theme/branding in your self-hosted Cal admin.
