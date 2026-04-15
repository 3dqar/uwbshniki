# Econ Empire

Ekonomikos simuliacijos žaidimas su Google Apps Script backend.

## Deployment (GitHub Pages)

1. Push this repository to GitHub.
2. Go to **Settings → Pages**, set source to `main` branch, root `/`.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## Backend setup

1. Open `assets/js/api.js`.
2. Replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your deployed Apps Script Web App URL.
3. In your Apps Script project: **Deploy → New deployment → Web app**  
   - Execute as: **Me**  
   - Who has access: **Anyone**

## Files

| File | Description |
|------|-------------|
| `index.html` | Landing page |
| `login.html` | Login / register |
| `app.html` | Main game dashboard |
| `profile.html` | Player profile |
| `admin.html` | Admin panel |
| `academy.html` | Academy / learning |
| `market.html` | Market / shop |
| `empire.html` | Empire overview |
| `leaderboard.html` | Leaderboard |
| `assets/js/api.js` | Backend API bridge |
| `assets/js/user.js` | Session management |
| `assets/js/ui.js` | UI helpers |
