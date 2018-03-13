import { expect } from 'chai';
import { AjtiiError } from './error';
import * as env from './env';

function forgetModule() {
  delete require.cache[require.resolve('./env')];
}

function requireModule(env: string, srvEnv = 'development') {
  let oldSrvEnv = process.env.SRV_ENV;
  let oldEnv = process.env.NODE_ENV;
  process.env.SRV_ENV = srvEnv;
  process.env.NODE_ENV = env;
  forgetModule();
  let m = require('./env');
  process.env.SRV_ENV = oldSrvEnv;
  process.env.NODE_ENV = oldEnv;
  return m;
}

let c: () => void;

let e: typeof env;

describe('SRV_ENV and related constants', () => {
  describe('when SRV_ENV is not set', () => {
    before(() => {
      e = requireModule('development', '');
    });

    it('should set SRV_ENV to development', () => {
      expect(e.SRV_ENV).to.eq('development');
    });
  });

  describe('when SRV_ENV is set to invalid value', () => {
    before(() => {
      c = () => requireModule('development', 'wrong');
    });

    it('should throw an error', () => {
      expect(c).to.throw(TypeError, /^SRV_ENV.+one of these/);
    });
  });

  describe('when SRV_ENV = development', () => {
    before(() => {
      e = requireModule('development', 'development');
    });

    it('should IS_DEV_SRV = true', () => {
      expect(e.IS_DEV_SRV).to.eq(true);
    });

    it('should IS_DEV_BUT_NOT_TEST_SRV = true', () => {
      expect(e.IS_DEV_BUT_NOT_TEST_SRV).to.eq(true);
    });

    it('should IS_TEST_SRV = false', () => {
      expect(e.IS_TEST_SRV).to.eq(false);
    });

    it('should IS_PROD_SRV = false', () => {
      expect(e.IS_PROD_SRV).to.eq(false);
    });
  });

  describe('when SRV_ENV = testing', () => {
    before(() => {
      e = requireModule('development', 'testing');
    });

    it('should IS_DEV_SRV = true', () => {
      expect(e.IS_DEV_SRV).to.eq(true);
    });

    it('should IS_DEV_BUT_NOT_TEST_SRV = false', () => {
      expect(e.IS_DEV_BUT_NOT_TEST_SRV).to.eq(false);
    });

    it('should IS_TEST_SRV = true', () => {
      expect(e.IS_TEST_SRV).to.eq(true);
    });

    it('should IS_PROD_SRV = false', () => {
      expect(e.IS_PROD_SRV).to.eq(false);
    });
  });

  describe('when SRV_ENV = production', () => {
    before(() => {
      e = requireModule('development', 'production');
    });

    it('should IS_DEV_SRV = false', () => {
      expect(e.IS_DEV_SRV).to.eq(false);
    });

    it('should IS_DEV_BUT_NOT_TEST_SRV = false', () => {
      expect(e.IS_DEV_BUT_NOT_TEST_SRV).to.eq(false);
    });

    it('should IS_TEST_SRV = false', () => {
      expect(e.IS_TEST_SRV).to.eq(false);
    });

    it('should IS_PROD_SRV = true', () => {
      expect(e.IS_PROD_SRV).to.eq(true);
    });
  });
});

describe('ENV and related constants', () => {
  describe('when NODE_ENV is not set', () => {
    before(() => {
      c = () => requireModule('');
    });

    it('should throw an error', () => {
      expect(c).to.throw(TypeError, 'not set');
    });
  });

  describe('when NODE_ENV is set to invalid value', () => {
    before(() => {
      c = () => requireModule('wrong');
    });

    it('should throw an error', () => {
      expect(c).to.throw(TypeError, /^NODE_ENV.+one of these/);
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
});
