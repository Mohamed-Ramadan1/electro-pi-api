import { DataSource } from 'typeorm';
import { UserRepository } from '../../../src/modules/users/repository/user.repo';
import { User } from '../../../src/modules/users/entity/user.entity';

describe('UserRepository (integration)', () => {
  let dataSource: DataSource;
  let repo: UserRepository;

  beforeAll(async () => {
    const { setupTestDatabase } = await import('../../helpers/test-database');
    dataSource = await setupTestDatabase();
    repo = new UserRepository(dataSource.getRepository(User));
  });

  afterAll(async () => {
    const { teardownTestDatabase } =
      await import('../../helpers/test-database');
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    const { clearTables } = await import('../../helpers/test-database');
    await clearTables();
  });

  describe('create', () => {
    it('should create a user with default values', async () => {
      const user = await repo.create({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: '$2b$10$hash',
      });

      expect(user.id).toBeDefined();
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.isActive).toBe(true);
      expect(user.roles).toEqual(['member']);
    });
  });

  describe('isExist', () => {
    it('should return true if email exists', async () => {
      await repo.create({
        name: 'Existing',
        email: 'exists@test.com',
        passwordHash: '$2b$10$hash',
      });

      const exists = await repo.isExist('exists@test.com');
      expect(exists).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      const exists = await repo.isExist('nobody@test.com');
      expect(exists).toBe(false);
    });
  });

  describe('findByEmailWithPassword', () => {
    it('should return user with passwordHash included', async () => {
      await repo.create({
        name: 'Pwd User',
        email: 'pwd@test.com',
        passwordHash: '$2b$10$secret',
      });

      const user = await repo.findByEmailWithPassword('pwd@test.com');

      expect(user).not.toBeNull();
      expect(user!.passwordHash).toBe('$2b$10$secret');
    });

    it('should return null for unknown email', async () => {
      const user = await repo.findByEmailWithPassword('unknown@test.com');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const created = await repo.create({
        name: 'ById',
        email: 'byid@test.com',
        passwordHash: '$2b$10$hash',
      });

      const found = await repo.findById(created.id);
      expect(found).not.toBeNull();
      expect(found!.name).toBe('ById');
    });
  });

  describe('findUsers', () => {
    it('should return all users', async () => {
      await repo.create({
        name: 'User One',
        email: 'one@test.com',
        passwordHash: '$2b$10$hash',
      });
      await repo.create({
        name: 'User Two',
        email: 'two@test.com',
        passwordHash: '$2b$10$hash',
      });

      const users = await repo.findUsers();
      expect(users).toHaveLength(2);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const created = await repo.create({
        name: 'DeleteMe',
        email: 'delete@test.com',
        passwordHash: '$2b$10$hash',
      });

      await repo.deleteUser(created.id);
      const found = await repo.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('activate / deactivate', () => {
    it('should toggle isActive flag', async () => {
      const user = await repo.create({
        name: 'Toggle',
        email: 'toggle@test.com',
        passwordHash: '$2b$10$hash',
      });

      await repo.deactivate(user.id);
      const deactivated = await repo.findById(user.id);
      expect(deactivated!.isActive).toBe(false);

      await repo.activate(user.id);
      const activated = await repo.findById(user.id);
      expect(activated!.isActive).toBe(true);
    });
  });

  describe('createWithRoles', () => {
    it('should create user with custom roles', async () => {
      const user = await repo.createWithRoles({
        name: 'Admin',
        email: 'admin@test.com',
        passwordHash: '$2b$10$hash',
        roles: ['admin', 'member'] as any,
      });

      expect(user.roles).toEqual(['admin', 'member']);
    });
  });
});
