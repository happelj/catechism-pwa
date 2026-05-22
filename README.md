# Westminster Catechizer PWA

A progressive web app starter for practicing the Westminster Shorter Catechism on a phone, including iPhone home-screen installation support and an offline app shell.

## What is included

- A dependency-free web app that runs from static files
- A reveal-and-rate study flow with progress saved in `localStorage`
- A web app manifest and iPhone-oriented metadata
- A service worker that caches the app shell for offline use after the first load
- A small starter question set in `app.js`

## Run locally

Service workers require an HTTP origin. From the repository root, use any static file server, for example:

```powershell
npx serve .
```

Then open the local URL that the server prints.

## Install on iPhone

1. Deploy the site over HTTPS, for example with GitHub Pages.
2. Open the deployed site in Safari on the iPhone.
3. Use Share, then `Add to Home Screen`.

## Next steps

1. Replace the starter question set in `app.js` with the complete catechism data.
2. Replace the placeholder SVG icons in `assets/` with production PNG app icons, including a 180 x 180 Apple touch icon.
3. Add a deployment workflow or enable GitHub Pages for the repository.

