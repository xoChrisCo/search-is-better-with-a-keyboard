# Chrome Search Keyboard

A tiny Chrome extension that makes Google and DuckDuckGo search results navigable from the keyboard. Press **Tab** on a search results page to jump straight to the first result, then **Tab / Shift+Tab** or **↓ / ↑** to move between results. No mouse needed.

- Manifest V3
- Zero dependencies, no build step, no background worker
- ~90 lines of vanilla JavaScript
- Only runs on `https://www.google.com/search*` and `https://duckduckgo.com/*`

## An open letter to Google

> Dear Google — why do I need to build this?
>
> Sincerely,
> Chris

(DuckDuckGo at least ships its own `j`/`k` keyboard navigation — this extension just makes Tab behave the same way on both engines.)

## Install

The extension isn't on the Chrome Web Store — install it locally in developer mode. Takes about 30 seconds.

### 1. Get the files

Either clone the repo:

```bash
git clone https://github.com/xoChrisCo/chrome-google-keyboard.git
```

…or click **Code → Download ZIP** on GitHub and unzip it somewhere you won't accidentally delete.

### 2. Load it into Chrome

1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** on (top-right corner).
3. Click **Load unpacked**.
4. Select the `chrome-google-keyboard` folder you just cloned/unzipped.

That's it — the extension is now active. You should see "Search Keyboard Nav" in your extensions list.

### 3. Try it

1. Go to [google.com](https://www.google.com) or [duckduckgo.com](https://duckduckgo.com) and search for anything.
2. Press **Tab**. Focus jumps to the first result.
3. Press **Tab** / **Shift+Tab** or **↓** / **↑** to move between results.
4. Press **Enter** to open the focused result.

## Keyboard shortcuts

| Key                          | Action                                                   |
| ---------------------------- | -------------------------------------------------------- |
| **Tab** (anywhere on page)   | Jump focus to the first search result                    |
| **Tab** (on a result)        | Move to the next result                                  |
| **Shift+Tab** (on a result)  | Move to the previous result                              |
| **↓** (on a result)          | Next result (page does not scroll)                       |
| **↑** (on a result)          | Previous result (page does not scroll)                   |

All other keys behave normally. The extension only acts when one of the keys above is pressed.

## How it works

A single content script (`content.js`) is injected into Google and DuckDuckGo search pages. It picks a result-link selector based on the hostname, listens for `keydown` events on the document, queries the selector to get the current list of result links, and moves focus accordingly. The results array is rebuilt on every keypress, so it stays correct even when the page re-renders (e.g. when you toggle a filter on Google or DuckDuckGo's infinite scroll loads more results).

## Updating it / fixing it when a search engine changes its DOM

Search engines change their result markup from time to time. If the extension stops working on one of them, the fix is almost always to update the selector map at the top of `content.js`:

```js
const ENGINES = {
  "www.google.com": { resultSelector: "#search a:has(h3)" },
  "duckduckgo.com": { resultSelector: 'a[data-testid="result-title-a"]' },
};
```

Open Chrome DevTools on a search results page, find an updated selector that matches each result anchor, and replace the string. Then reload the extension at `chrome://extensions`.

Adding another search engine is the same trick: add its hostname and result selector to `ENGINES`, and add a match pattern for it in `manifest.json`.

PRs welcome if you spot a selector breaking before I do.

## File layout

```
chrome-google-keyboard/
├── manifest.json   # Manifest V3 declaration
├── content.js      # The whole extension — keydown listener + focus logic
└── README.md
```

## Privacy

The extension does not collect, store, or transmit any data. It has no permissions beyond running a content script on `https://www.google.com/search*` and `https://duckduckgo.com/*`. No background worker, no remote requests, no telemetry.

## License

MIT
