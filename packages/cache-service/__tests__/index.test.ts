// packages/cache-service/__tests__/index.test.ts

import { cacheService } from '../index';

describe('Cache Service', () => {
  beforeEach(() => {
    cacheService.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should set and get a value', () => {
    cacheService.set('key', 'value', 60);
    expect(cacheService.get('key')).toBe('value');
  });

  it('should return null for non-existent key', () => {
    expect(cacheService.get('non-existent')).toBeNull();
  });

  it('should expire items after TTL', () => {
    cacheService.set('key', 'value', 60);
    jest.advanceTimersByTime(61 * 1000);
    expect(cacheService.get('key')).toBeNull();
  });

  it('should clear all items', () => {
    cacheService.set('key1', 'value1', 60);
    cacheService.set('key2', 'value2', 60);
    cacheService.clear();
    expect(cacheService.get('key1')).toBeNull();
    expect(cacheService.get('key2')).toBeNull();
  });
});
