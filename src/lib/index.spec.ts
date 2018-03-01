import { expect } from 'chai';
import { stringify, asDefined, asValue } from '.';
import { AjtiiError } from './error';

describe('stringify', () => {
  let r: string;

  describe('when undefined passed', () => {
    before(() => r = stringify(undefined));

    it('should return "undefined"', () => {
      expect(r).to.eq('undefined');
    });
  });

  describe('when null passed', () => {
    before(() => r = stringify(null));

    it('should return "null"', () => {
      expect(r).to.eq('null');
    });
  });

  describe('when [] passed', () => {
    before(() => r = stringify([]));

    it(`should return "array([])"`, () => {
      expect(r).to.eq("array([])");
    });
  });

  describe('when "(" passed', () => {
    before(() => r = stringify("("));

    it(`should return "string('\\(')"`, () => {
      expect(r).to.eq("string('\\(')");
    });
  });

  describe('when ")" passed', () => {
    before(() => r = stringify(")"));

    it(`should return "string('\\)')"`, () => {
      expect(r).to.eq("string('\\)')");
    });
  });

  describe('when "()" passed', () => {
    before(() => r = stringify("()"));

    it(`should return "string('\\(\\)')"`, () => {
      expect(r).to.eq("string('\\(\\)')");
    });
  });

  describe(`when 42 passed`, () => {
    before(() => r = stringify(42));

    it(`should return "number(42)"`, () => {
      expect(r).to.eq('number(42)');
    });
  });
});

describe('asDefined', () => {
  describe('when undefined passed', () => {
    let c: () => void;

    before(() => (c = () => asDefined(undefined)));

    it('should throw an error', () => {
      expect(c).to.throw(AjtiiError, 'defined');
    });
  });

  describe('when defined passed', () => {
    let r: any;

    before(() => r = asDefined(0));

    it('should return passed', () => {
      expect(r).to.eq(0);
    });
  });
});

describe('asValue', () => {
  describe('when non-value undefined passed', () => {
    let c: () => void;

    before(() => (c = () => asValue(undefined)));

    it('should throw an error', () => {
      expect(c).to.throw(AjtiiError, 'null');
    });
  });

  describe('when non-value null passed', () => {
    let c: () => void;

    before(() => (c = () => asValue(null)));

    it('should throw an error', () => {
      expect(c).to.throw(AjtiiError, 'null');
    });
  });

  describe('when value passed', () => {
    let r: any;

    before(() => r = asValue(0));

    it('should return passed', () => {
      expect(r).to.eq(0);
    });
  });
});
