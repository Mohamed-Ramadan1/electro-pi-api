export const UserRoles = {
  MEMBER: 'member',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const DEFAULT_ROLE = UserRoles.MEMBER;
