import { MyError } from './error';
import { spy, SinonSpy } from 'sinon';
import { expect } from 'chai';
import * as lib from '.';

let s: SinonSpy;

describe('MyError', () => {
  let e: MyError;

  describe('constructor', () => {
    describe('when 1st arg is message', () => {
      describe('when no args passed', () => {
        before(() => {
          e = new MyError('something went wrong');
        });

        it('should set message', () => {
          expect(e.message).to.contain('went');
        });

        it('should not set cause', () => {
          expect(e.cause()).is.oneOf([ undefined, null ]);
        });
      });

      describe('when args passed', () => {
        before(() => {
          s = spy(lib, 'stringify');
          e = new MyError('something went wrong; %s; %s', 42, true);
        });

        it('should set message containing 1st arg', () => {
          expect(e.message).to.contain('42');
        });

        it('should set message containing 2nd arg', () => {
          expect(e.message).to.contain('true');
        });

        it('should call stringify twice', () => {
          expect(s.callCount).to.eq(2);
        });

        after(() => {
          s.restore();
        });
      });
    })

    describe('when 1st arg is cause (or hypotetically options)', () => {
      let c;

      before(() => {
        c = new MyError('cause');
        e = new MyError(c, 'something went wrong');
      });

      it('should set cause', () => {
        expect(e.cause()).is.not.oneOf([ undefined, null ]);
      });

      it('should set message', () => {
        expect(e.message).to.contain('went');
      });
    });
  });
});
