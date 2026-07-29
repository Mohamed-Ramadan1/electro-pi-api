export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export function createMock<T extends object>(
  overrides?: DeepPartial<T>,
): jest.Mocked<T> {
  const handler: ProxyHandler<object> = {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      if (typeof prop === 'string' && prop !== 'then') {
        if (!(prop in target)) {
          (target as any)[prop] = jest.fn();
        }
      }
      return Reflect.get(target, prop, receiver);
    },
  };

  const mock = new Proxy({ ...overrides }, handler) as jest.Mocked<T>;

  if (typeof (mock as any).save === 'undefined') {
    (mock as any).save = jest.fn();
  }

  return mock;
}
