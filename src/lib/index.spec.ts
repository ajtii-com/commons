import { expect } from 'chai';
import { stringify } from '.';

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

    it(`should return "array()"`, () => {
      expect(r).to.eq("array()");
    });
  });

  describe('when "(" passed', () => {
    before(() => r = stringify("("));

    it(`should return "string(\\()"`, () => {
      expect(r).to.eq("string(\\()");
    });
  });

  describe('when ")" passed', () => {
    before(() => r = stringify(")"));

    it(`should return "string(\\))"`, () => {
      expect(r).to.eq("string(\\))");
    });
  });

  describe('when "()" passed', () => {
    before(() => r = stringify("()"));

    it(`should return "string(\\(\\))"`, () => {
      expect(r).to.eq("string(\\(\\))");
    });
  });

  describe(`when 42 passed`, () => {
    before(() => r = stringify(42));

    it(`should return "number(42)"`, () => {
      expect(r).to.eq('number(42)');
    });
  });
});
