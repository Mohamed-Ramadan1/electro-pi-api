import { JwtTokenType } from './jwt-token-type.type';

export type JwtPayload = {
  sub: string;
  type?: JwtTokenType;
  jti?: string;
  roles?: string[];
};

export type VerifiedJwtPayload = JwtPayload & {
  type: JwtTokenType;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
};
