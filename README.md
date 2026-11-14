# LUCKY SPIN ROYAL — GitHub Pages Edition

A standalone browser prototype for an original virtual-coin arcade. The featured playable machine is **Aztec Gold Riches**; the other seven game cards are previews.

## Features

- Royal/neon arcade lobby with eight themed game cards.
- Five reels × five rows with staggered reel animation.
- Virtual-coin balance, level, XP, spin and win statistics.
- Level-up coin rewards and daily quests.
- Free-spin feature, wild/scatter symbols, paytable and rules.
- Local browser save using `localStorage`.
- Player save export/import using JSON backup files.
- Responsive desktop/mobile layout.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `lucky-spin-royal`.
2. Upload **all files in this folder** to the repository root. Make sure `index.html` is at the root, not inside another nested folder.
3. Commit the files to the `main` branch.
4. Open **Settings → Pages** in the repository.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch **main** and folder **/(root)**, then Save.
7. Wait for GitHub Pages to publish and open the URL shown in Settings → Pages.

## Protecting player progress — important

GitHub stores and versions the **game source files**. It does **not** store each player's game progress. This edition saves progress in the browser's local storage on that device and browser. Clearing browser data, using another browser/device, or changing from a local `file://` copy to the GitHub Pages website can make the old save unavailable at the new location.

Before moving to GitHub Pages, open the current game and press **BACK UP** in the top bar. This downloads a JSON save file. Open the published GitHub Pages game and press **RESTORE**, then select that JSON file. Keep an extra copy somewhere private and safe. Do not upload player backup JSON files to a public GitHub repository. `.gitignore` excludes the standard backup filename patterns.

For automatic cross-device/cloud player accounts, a separate backend/database and authentication system will be needed. GitHub Pages alone cannot provide that.

## Current limitations

- Only Aztec Gold Riches is playable; the other seven machines are coming-soon previews.
- Player data is local to the browser unless manually exported/imported.
- Sound is lightweight browser-generated feedback, not a finished sound-production package.
- Game outcomes and virtual rewards are prototype values and have not been independently audited.
- Virtual coins have no cash value. No deposits, cash-out, or real-money wagering are implemented.
- This is a prototype, not a production-ready service. Test on desktop and mobile before sharing publicly.

## Local testing

You can open `index.html` directly in a modern browser. For a closer match to GitHub Pages, run a simple local static web server or use the published Pages URL.
