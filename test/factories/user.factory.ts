import { User } from '../../src/modules/users/entity/user.entity';
import { UserRole } from '../../src/common/constants/roles.constants';

let counter = 0;

export function buildUser(overrides?: Partial<User>): User {
  counter++;
  const user = new User();
  user.id =
    overrides?.id ??
    `00000000-0000-0000-0000-${String(counter).padStart(12, '0')}`;
  user.name = overrides?.name ?? `Test User ${counter}`;
  user.email = overrides?.email ?? `user-${counter}@test.com`;
  user.passwordHash = overrides?.passwordHash ?? '$2b$10$hashedpassword';
  user.isActive = overrides?.isActive ?? true;
  user.roles = overrides?.roles ?? (['member'] as UserRole[]);
  user.profileImage = overrides?.profileImage ?? null;
  user.createdAt = overrides?.createdAt ?? new Date();
  user.updatedAt = overrides?.updatedAt ?? new Date();
  user.termsAcceptedAt = overrides?.termsAcceptedAt ?? null;
  user.termsVersion = overrides?.termsVersion ?? null;
  return user;
}
