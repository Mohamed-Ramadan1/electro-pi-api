# M2 — CORS `origin: true` Is Completely Open

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Security |
| File       | `src/core/bootstrap/app.bootstrap.ts:18` |

---

## What's Wrong

CORS is configured with `origin: true`, which means the `Access-Control-Allow-Origin` header is set to the **exact value of the request's `Origin` header**:

```typescript
app.enableCors({
  credentials: true,
  origin: true,   // ← reflects ANY origin
});
```

Combined with `credentials: true`, this means any website on the internet can make credentialed requests to the API, and the browser will include cookies (which contain the httpOnly JWT tokens).

---

## Why It Matters

A malicious website (`evil.com`) can make a fetch request to `your-api.com` with `credentials: 'include'`. The browser will happily send the auth cookies. The API will process the request as if it came from your legitimate frontend. This is a CSRF-like attack vector.

`sameSite: 'lax'` on the auth cookies provides partial protection (blocks cross-site POST), but `lax` still allows top-level navigations and some GET requests.

---

## Concrete Fix

Replace `origin: true` with a whitelist of known frontend origins:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-frontend-domain.com',
];

app.enableCors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});
```

Load the allowed origins from environment config in production.

---

## Verification

From `curl` with `Origin: https://evil.com` → response should NOT include `Access-Control-Allow-Origin: https://evil.com`.
