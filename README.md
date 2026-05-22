# Westminster Catechizer PWA

React/Vite Progressive Web App for practicing the Westminster Shorter Catechism from a phone-first interface based on the Android Westminster Catechizer app.

## Features

- Scrollable 107-question catechism index with per-profile progress percentages
- First-letter answer practice flow with scoring, retry, next-question navigation, answer reveal, and KJV proof dialogs
- Local profile creation, switching, deletion, statistics, and progress reset
- Light and dark themes plus child mode for hiding outside links behind a PIN
- `localStorage` persistence for profiles, progress, study attempts, stats, and settings
- Installable offline PWA build using `vite-plugin-pwa`

## Architecture

- `src/screens`: route-level question list, question detail, profile, and statistics screens
- `src/components`: toolbar, drawer, dialogs, scripture proof dialog, and question index rail
- `src/state`: React context and local persistence for profiles, settings, progress, and session timing
- `src/data`: converted Westminster Shorter Catechism and KJV proof data
- `src/utils`: scoring and display helpers
- `scripts/convert-android-data.mjs`: converter used to regenerate web data from the Android Kotlin references

## Local development

Install dependencies once:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Open the local URL Vite prints. For a production-style PWA check, build and preview the generated app:

```powershell
npm run build
npm run preview
```

The preview server serves the generated manifest and service worker from `dist`.

## Regenerate catechism data

The committed TypeScript data has already been generated from the Android source. To regenerate it from the Kotlin references:

```powershell
node .\scripts\convert-android-data.mjs "<path-to-CatechismData.kt>" "<path-to-KjvVerseLookup.kt>"
```

## Install on iPhone

1. Deploy the app over HTTPS.
2. Open it in Safari on the iPhone.
3. Use Share, then Add to Home Screen.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Use the Vite defaults: build command `npm run build` and output directory `dist`.
3. Deploy the project.

`vercel.json` rewrites app routes back to `index.html`, so direct visits to profile, stats, and question routes still load the React app.
