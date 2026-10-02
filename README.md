# Photos · Micro Frontend remote

Unsplash photo browser (latest + search, pagination, keyboard-accessible lightbox) built as a webpack Module Federation remote for the [micro-frontend host](https://github.com/rk4rohankumar/micro-frontend-host). Runs standalone too.

CRA 5 + CRACO 7, React 19, Tailwind 3, axios, framer-motion.

## API and key

Data comes from the [Unsplash API](https://unsplash.com/documentation) (`https://api.unsplash.com`): `/photos` for the feed and `/search/photos` for queries, authenticated with `Authorization: Client-ID <key>`.

```bash
cp .env.example .env   # set REACT_APP_UNSPLASH_ACCESS_KEY
```

Get a key at <https://unsplash.com/developers>. Demo keys are limited to 50 requests/hour; the UI shows explicit states for a missing key, 401 and 403. `.env` is gitignored.

## Run / build

```bash
npm install
npm start            # http://localhost:3000 (CRA picks another port if busy)
npm run build        # production bundle in build/, remoteEntry.js at its root
```

## How the host consumes it

- Scope: `PhotosApp`, remote entry: `https://photos-child-app.vercel.app/remoteEntry.js`
- Exposed module: `./PhotosApp` → `src/App` (default export, a self-contained React component)
- The host injects `remoteEntry.js` at runtime, calls `container.init(__webpack_share_scopes__.default)` then `container.get('./PhotosApp')`.
- `output.publicPath` is `'auto'` in production, so chunks and CSS resolve relative to wherever `remoteEntry.js` was loaded from.

`src/index.js` is an async boundary (`import('./bootstrap')`) so webpack can negotiate shared modules before React is evaluated.

### Shared singletons

`react`, `react-dom`, `framer-motion` and `axios` are declared `singleton: true` with `requiredVersion` from `package.json`. The host must provide compatible versions (React 19); a mismatch is reported by webpack in the console rather than silently loading two Reacts.

## Deployment

Vercel: <https://photos-child-app.vercel.app/>
