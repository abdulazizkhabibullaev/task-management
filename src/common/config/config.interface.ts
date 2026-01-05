const KEYS = ['DB_URL', 'USER_URL', 'USER_PORT', 'JWT_SECRET', 'JWT_EXPIRES'] as const;

export type ConfigKeysUnion = (typeof KEYS)[number];

export interface IConfigService {
    get(key: ConfigKeysUnion): string;
}
