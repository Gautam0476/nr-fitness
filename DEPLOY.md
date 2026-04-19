## Deploy Setup

This project is split into:

- Frontend: `my-app` -> deploy to Vercel
- Backend: `backend` -> deploy to Render

### Render backend

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Required env vars:
  - `MONGO_URI`
  - `DB_NAME=myy_app`

You can also use the root-level `render.yaml`.

### Vercel frontend

- Root directory: `my-app`
- Framework preset: Create React App
- Build command: `npm run build`
- Output directory: `build`
- Required env var:
  - `REACT_APP_API_URL=https://your-render-backend-url.onrender.com`

`my-app/vercel.json` includes an SPA rewrite so frontend routes fall back to `index.html`.
