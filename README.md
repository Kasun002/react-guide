# React Interview Guide

A hands-on Next.js app covering nine senior-level React interview topics, each with a live interactive demo and inline explanations.

**Live site:** https://kasun002.github.io/user-guide

---

## Examples

| # | Topic | Key Concepts |
|---|-------|-------------|
| 1 | Large Data Table | `useDeferredValue`, `useMemo`, search / sort / pagination |
| 2 | Custom `useFetch` Hook | `AbortController`, `useReducer`, cache, race conditions |
| 3 | Compound Tabs | `createContext`, no prop drilling, ARIA, keyboard nav |
| 4 | Countdown + Typewriter | `useRef`, stale closures, `useEffect` cleanup |
| 5 | Recursive File Tree | Clean recursion, per-node state, `React.memo`, stable keys |
| 6 | Data Polling | `setInterval`, visibility pause, silent refresh, cleanup |
| 7 | Todo + `useCallback` | `memo` combo, stable refs, when NOT to use it |
| 8 | Redux Toolkit Cart | `createSlice`, Immer mutations, `useSelector`, `useDispatch` |
| 9 | Context API Cart | `useReducer`, split-context pattern, custom hooks vs Redux |

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Redux Toolkit** (Example 8)

---

## Deployment

The site deploys automatically to **GitHub Pages** on every push to `main` via the workflow at `.github/workflows/deploy.yml`.

The workflow:
1. Installs dependencies with `npm ci`
2. Runs `npm run build` with `NEXT_PUBLIC_BASE_PATH=/user-guide` — Next.js emits a fully static site to `out/`
3. Adds `.nojekyll` so GitHub Pages serves the `_next/` assets correctly
4. Uploads and deploys the `out/` directory

### One-time GitHub setup

1. Go to **Settings → Pages** in the repository
2. Set **Source** to `GitHub Actions`
3. Push to `main` — the workflow handles the rest

### Local static build

```bash
npm run build   # generates out/
npx serve out   # preview at http://localhost:3000
```
