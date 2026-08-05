# M1 — No Refresh Token Rotation or Revocation

| Field      | Value |
|------------|-------|
| Severity   | **Medium** |
| Category   | Security / Architecture |
| File       | `src/infrastructure/jwt/services/token.service.ts` |

---

## What's Wrong

Refresh tokens are stateless JWTs. Once issued, they cannot be invalidated server-side before their natural expiry:

```typescript
async issueRefreshToken(payload: JwtPayload): Promise<string> {
  return this.jwt.signAsync(
    { ...payload, jti: payload.jti ?? randomUUID(), type: JWT_REFRESH_TOKEN_TYPE },
    { audience: this.config.audience, expiresIn: this.config.refreshTtl,
      issuer: this.config.issuer, secret: this.config.refreshSecret },
  );
}
```

There is no:
- Token family tracking
- Rotation on use (issue new refresh token, invalidate old)
- Deny-list for revoked tokens
- Mechanism to "log out everywhere"

---

## Why It Matters

If a refresh token is leaked (XSS, man-in-the-middle, access log), the attacker has valid credentials until the token naturally expires (default: 7 days). The legitimate user cannot revoke it.

The `jti` (JWT ID) claim is generated but never stored or checked — it's included in the payload but has no server-side validation.

---

## Concrete Fix

For MVP, a minimal approach:
- Store the `jti` of the last issued refresh token in the user's record (or a separate `refresh_tokens` table).
- On refresh, validate the `jti` against the stored value. If it doesn't match, reject (token has been rotated).
- On each token refresh, issue a new `jti` and update the stored value.

For production, implement full refresh token rotation:
- Maintain a token family per session.
- On rotation, invalidate the entire family if a previously-used token is presented (replay detection).

---

## Verification

1. Issue a token pair.
2. Refresh the access token using the refresh token.
3. Try to use the OLD refresh token again → should be rejected.
