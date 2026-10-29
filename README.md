# Tank Volume Calculator

Offline tank volume calculator (horizontal, vertical flat, vertical cone-bottom). One codebase, three ways to install:

- **Android (Chrome):** open the Pages link -> tap **Install on Android** (one tap), or use the Chrome menu -> Install app.
- **iPhone/iPad (Safari):** open the link -> tap **Install on iPhone / iPad** to see the Share -> Add to Home Screen steps.
- **Android APK:** GitHub **Releases** -> latest -> `tank-volume-calculator.apk` (built automatically by GitHub Actions).

The app detects the device/browser and shows the right instructions (including "open in Safari/Chrome" when opened from WhatsApp, Facebook, etc.).

## Files
`index.html` (app) - `sw.js` (offline) - `manifest.webmanifest` - icons - `capacitor.config.json` + `package.json` + `.github/workflows/build-apk.yml` (APK build)

## Updating
1. Edit files. Raise the version in TWO places: `CACHE_VERSION` in `sw.js` and `APP` in the update script in `index.html` (same number, e.g. `tank-calc-v10`).
2. Commit to `main`. GitHub Pages updates in ~1 min and Actions builds a new APK (Actions tab, ~5 min).
3. Web/PWA users: tap **Check for updates**. APK users: the same button links to the newest APK.

## Offline test
Open once online until the home screen says "Offline ready", then use airplane mode.
