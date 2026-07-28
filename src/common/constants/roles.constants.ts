export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const DEFAULT_ROLE = UserRole.USER;
