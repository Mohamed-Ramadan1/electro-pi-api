import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}

export {};
