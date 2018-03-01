import { expect } from 'chai';
import { AjtiiError } from './error';
import * as env from './env';

function forgetModule() {
  delete require.cache[require.resolve('./env')];
}

function requireModule(env: string) {
  let oldEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = env;
  forgetModule();
  let m = require('./env');
  process.env.NODE_ENV = oldEnv;
  return m;
}

let c: () => void;

let e: typeof env;

describe('when NODE_ENV is not set', () => {
  before(() => {
    c = () => requireModule('');
  });

  it('should throw an error', () => {
    expect(c).to.throw(AjtiiError, 'not set');
  });
});

describe('when NODE_ENV is set to invalid value', () => {
  before(() => {
    c = () => requireModule('wrong');
  });

  it('should throw an error', () => {
    expect(c).to.throw(AjtiiError, 'one of these');
  });
});

describe('when NODE_ENV = development', () => {
  before(() => {
    e = requireModule('development');
  });

  it('should IN_DEV = true', () => {
    expect(e.IN_DEV).to.eq(true);
  });

  it('should IN_DEV_BUT_NOT_TEST = true', () => {
    expect(e.IN_DEV_BUT_NOT_TEST).to.eq(true);
  });

  it('should IN_TEST = false', () => {
    expect(e.IN_TEST).to.eq(false);
  });

  it('should IN_PROD = false', () => {
    expect(e.IN_PROD).to.eq(false);
  });
});

describe('when NODE_ENV = testing', () => {
  before(() => {
    e = requireModule('testing');
  });

  it('should IN_DEV = true', () => {
    expect(e.IN_DEV).to.eq(true);
  });

  it('should IN_DEV_BUT_NOT_TEST = false', () => {
    expect(e.IN_DEV_BUT_NOT_TEST).to.eq(false);
  });

  it('should IN_TEST = true', () => {
    expect(e.IN_TEST).to.eq(true);
  });

  it('should IN_PROD = false', () => {
    expect(e.IN_PROD).to.eq(false);
  });
});

describe('when NODE_ENV = production', () => {
  before(() => {
    e = requireModule('production');
  });

  it('should IN_DEV = false', () => {
    expect(e.IN_DEV).to.eq(false);
  });

  it('should IN_DEV_BUT_NOT_TEST = false', () => {
    expect(e.IN_DEV_BUT_NOT_TEST).to.eq(false);
  });

  it('should IN_TEST = false', () => {
    expect(e.IN_TEST).to.eq(false);
  });

  it('should IN_PROD = true', () => {
    expect(e.IN_PROD).to.eq(true);
  });
});
