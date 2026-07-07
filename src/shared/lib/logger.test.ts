import { logger } from './logger';

describe('logger', () => {
  it('exposes logging methods', () => {
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('warn');
    expect(logger).toHaveProperty('error');
    expect(logger).toHaveProperty('debug');
  });
});
