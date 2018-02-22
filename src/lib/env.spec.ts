import { expect } from 'chai';
import { MyError } from './error';

beforeEach(() => {
  delete require.cache[require.resolve('./env')];
});

describe('when NODE_ENV not set', () => {
  it('should throw error', () => {
    expect(() => require('./env')).to.throw(MyError);
  });
});

describe('when NODE_ENV not set', () => {


  it('should throw error', () => {
    expect(() => require('./env')).to.throw(MyError);
  });
});

describe('when NODE_ENV = development', () => {
  process.env.NODE_ENV = 'development';
  const env = require('./env');

  it('IN_DEV == true', () => {
    expect(env.IN_DEV).to.eq(true);
  });

  it('IN_TEST == false', () => {
    expect(env.IN_TEST).to.eq(false);
  });
});

