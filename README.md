# Econ Empire

Ekonomikos simuliacijos žaidimas su Google Apps Script backend, paruoštas GitHub Pages hostingui.

## Kaip įkelti į GitHub Pages

1. Išarchyvuokite šį ZIP.
2. Įkelkite visą aplanko turinį į GitHub repo šaknį.
3. GitHub atsidarykite **Settings → Pages**.
4. Pasirinkite **Deploy from a branch** → `main` → `/root`.
5. Palaukite, kol svetainė bus publikuota.

## Backend nustatymas

1. Atidarykite `assets/js/api.js`.
2. Eilutėje `const API_URL = '...'` įrašykite savo **Google Apps Script Web App** `/exec` nuorodą.
3. Apps Script pusėje naudokite **Deploy → New deployment → Web app**.
4. Rekomenduojami nustatymai:
   - **Execute as:** Me
   - **Who has access:** Anyone

Svarbu: į `api.js` reikia dėti **Apps Script `/exec` URL**, o ne Google Sheets nuorodą.

## Jei matote HTTP 405

Dažniausios priežastys:
- įrašytas ne tas URL (ne `/exec`)
- Apps Script nedepployintas kaip Web App
- pakeitėte Apps Script kodą, bet nepadarėte naujo deploy
- naršyklėje atidarėte API URL ranka, nors scriptas laukia `POST`

## Failai

- `index.html` — landing
- `login.html` — prisijungimas / registracija
- `app.html` — pagrindinis dashboard
- `empire.html` — verslo progresas
- `market.html` — rinka ir mini žaidimai
- `academy.html` — akademija / klausimai
- `leaderboard.html` — reitingai
- `profile.html` — profilis
- `admin.html` — administravimas
- `assets/css/app.css` — dizaino sistema
- `assets/js/api.js` — API ryšys su Apps Script
- `assets/js/user.js` — sesija ir progresas
- `assets/js/ui.js` — UI helperiai
- `manifest.json` — PWA manifestas
- `service-worker.js` — offline cache
