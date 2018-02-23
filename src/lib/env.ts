import { MyError } from './error';

export type Env = 'development' | 'testing' | 'production';

/**
 * NODE_ENV
 */
export const ENV = process.env.NODE_ENV as Env;

if (!ENV)
  throw new MyError("NODE_ENV is not set");

if (ENV !== 'development' && ENV !== 'testing' && ENV !== 'production')
  throw new MyError(`NODE_ENV must be one of these: development, testing
      or production; %s given`, ENV);

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
