# Weather Station Admin

Client-side React admin panel (Vite + Material UI). Talks to the Go API; not served by Fiber in development.

## Develop

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. Vite proxies `/api` and `/health` to the Go server at `:8000`.

## Stack

- Vite + React + TypeScript
- React Router
- Material UI (solid black AppBar)
