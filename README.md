# Tank Volume Calculator (PWA)
Installable, fully offline tank volume calculator. Flat layout: every file sits in the repo root.

Files: index.html (app), sw.js (offline engine), manifest.webmanifest, icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png, .nojekyll

Updating: change files, then raise the version in TWO places: CACHE_VERSION in sw.js and APP in the update script in index.html (same number, e.g. tank-calc-v9). Upload, then tap "Check for updates" in the app.
Offline test: open the app once with internet until the home screen says "Offline ready", then switch on airplane mode and reopen.
