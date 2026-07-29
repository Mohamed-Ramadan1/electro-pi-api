export const projectStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export type ProjectStatus = (typeof projectStatus)[keyof typeof projectStatus];

export const DEFAULT_PROJECT_STATUS = projectStatus.OPEN;
