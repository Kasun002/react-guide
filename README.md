# React Interview Guide

A hands-on Next.js app covering nine senior-level React interview topics, each with a live interactive demo and inline explanations.

**Live site:** https://user-guide.vercel.app

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

The site deploys automatically to **Vercel** on every push to `main`.

### One-time Vercel setup

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import the `user-guide` repository
4. Leave all settings as default and click **Deploy**

Every subsequent push to `main` triggers a new deployment automatically. Vercel also creates preview deployments for pull requests.
