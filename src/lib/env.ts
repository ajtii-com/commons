import { AjtiiError } from './error';

export type Env = 'development' | 'testing' | 'production';

/**
 * SRV_ENV
 *
 * Default: development
 */
export const SRV_ENV: Env = process.env.SRV_ENV as Env || 'development';

if (SRV_ENV !== 'development' && SRV_ENV !== 'testing'
    && SRV_ENV !== 'production')
  throw new TypeError(`SRV_ENV must be one of these: development, testing
      or production; ${SRV_ENV} given`);

console.info(`SRV_ENV = ${SRV_ENV}`);

/**
 * SRV_ENV = testing
 */
export const IS_TEST_SRV = SRV_ENV === 'testing';

/**
 * SRV_ENV = development
 */
export const IS_DEV_BUT_NOT_TEST_SRV = SRV_ENV === 'development';

/**
 * SRV_ENV = development or testing
 */
export const IS_DEV_SRV = IS_DEV_BUT_NOT_TEST_SRV || IS_TEST_SRV;

/**
 * SRV_ENV = production
 */
export const IS_PROD_SRV = SRV_ENV === 'production';

/**
 * NODE_ENV
 */
export const ENV = process.env.NODE_ENV as Env;

// Reason why an error is thrown when NODE_ENV is not set at all is
// that the other modules can use/depend on NODE_ENV too because
// it is well-known environment variable
if (!ENV)
  throw new TypeError("NODE_ENV is not set");

if (ENV !== 'development' && ENV !== 'testing' && ENV !== 'production')
  throw new TypeError(`NODE_ENV must be one of these: development, testing
      or production; ${ENV} given`);

console.info(`ENV = ${ENV}`);

/**
 * ENV = testing
 */
export const IN_TEST = ENV === 'testing';

/**
 * ENV = development
 */
export const IN_DEV_BUT_NOT_TEST = ENV === 'development';

/**
 * ENV = development or testing
 */
export const IN_DEV = IN_DEV_BUT_NOT_TEST || IN_TEST;

/**
 * ENV = production
 */
export const IN_PROD = ENV === 'production';
