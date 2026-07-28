/**
 * Represents the authenticated user attached to the request object
 * after successful JWT validation by Passport.
 *
 * This is the contract between the JWT strategy (writer) and
 * guards/controllers (readers). It contains only the fields
 * extracted from the JWT payload — NOT the full User entity.
 */
export interface AuthenticatedUser {
  /** The user's unique identifier (from JWT `sub` claim) */
  userId: string;

  /** Roles assigned to the user (from JWT `roles` claim) */
  roles: string[];
}
