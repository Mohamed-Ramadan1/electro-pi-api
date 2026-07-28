import { StringValue } from 'ms';

export type JwtInfrastructureConfig = {
  accessSecret: string;
  refreshSecret: string;
  accessTtl: StringValue | number;
  refreshTtl: StringValue | number;
  issuer: string;
  audience: string;
};
