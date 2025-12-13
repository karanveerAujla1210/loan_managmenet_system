# Frontend (frontend-web)

This folder contains the React + Vite frontend for the Loan Management CRM.

Quick start (from repo root):

```bash
cd frontend-web
npm install
npm run dev
```

Run tests:

```bash
cd frontend-web
npm install
npm test
```

Notes:
- Environment variables: copy `.env.example` to `.env` and set `VITE_API_URL`.
- Uses `react-query` for data fetching, and `axios` configured in `src/services/api.js`.
- Mock fallbacks exist in `src/services/*` if backend is unavailable.

Security notes:

- Authentication: the app stores an access token for API calls in `localStorage` for the development flow. For production, prefer HttpOnly, Secure cookies with `SameSite` set and a server-side refresh token flow. The frontend supports an `/auth/refresh` call — ensure the backend sets a refresh cookie.
- Token refresh: `src/utils/axiosInstance.js` includes logic to queue requests while a refresh is in progress and retry them after a successful refresh. If refresh fails the user is redirected to `/login`.
- XSS: server-provided HTML must be sanitized before insertion into the DOM. A helper `src/lib/sanitize.js` is provided using `dompurify`.
- CSRF: when using cookies for auth ensure the backend issues CSRF tokens or uses same-site cookies. `axios` is configured with `withCredentials: true` where required.
- Input validation: Forms should validate input client-side and rely on server-side validation as the source of truth.

Refer to `frontend-web/UI_SPEC.md` for additional security and accessibility guidance.
