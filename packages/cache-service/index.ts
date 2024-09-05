// packages/cache-service/index.ts

interface CacheItem<T> {
  value: T;
  expiry: number;
}

class CacheService {
  private cache: { [key: string]: CacheItem<any> } = {};

  set<T>(key: string, value: T, ttl: number): void {
    const expiry = Date.now() + ttl * 1000;
    this.cache[key] = { value, expiry };
  }

  get<T>(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;
    if (Date.now() > item.expiry) {
      delete this.cache[key];
      return null;
    }
    return item.value;
  }

  clear(): void {
    this.cache = {};
  }
}

export const cacheService = new CacheService();
