export const teamRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type TeamRole = (typeof teamRoles)[keyof typeof teamRoles];

export const DEFAULT_TEAM_ROLE = teamRoles.MEMBER;
