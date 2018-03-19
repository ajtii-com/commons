import '../spec';
import { expect } from 'chai';
import { Logger, MAIN_LOGGER, REM_LOGGER, RemTransport } from './logging';
import { Logger as WLogger } from 'winston';
import * as logging from './logging';
import { spy, SinonSpy } from 'sinon';
import * as nock from 'nock';
import { Scope, restore, cleanAll, activate } from 'nock';
import { RequestError } from 'request-promise/errors';
import { is } from '.';

describe('MAIN_LOGGER', () => {
  it('should have a logger instance set', () => {
    expect(MAIN_LOGGER).to.be.an.instanceOf(WLogger);
  });
});

describe('REM_LOGGER', () => {
  it('should have a logger instance set', () => {
    expect(REM_LOGGER).to.be.an.instanceOf(WLogger);
  });
});

describe('Logger', () => {
  let logger: Logger;

  before(() => {
    logger = new Logger('awesome-module');
  });

  describe('main', () => {
    it('should have a logger instance set', () => {
      expect(logger.main).to.be.an.instanceOf(WLogger);
    });

    describe('when call some logging method', () => {
      let mainLoggerSpy: SinonSpy;

      before(() => {
        mainLoggerSpy = spy(MAIN_LOGGER, 'log');
        logger.main.silly('awesome message', 1, 'a', { x: 10 });
      });

      after(() => {
        mainLoggerSpy.restore();
      });

      it('should be logged by main logger', () => {
        expect(mainLoggerSpy.calledWith(
          'silly',
          '[awesome-module] awesome message 1 a',
          { x: 10 },
        )).to.be.true;
      });
    });
  });

  describe('rem', () => {
    it('should have a logger instance set', () => {
      expect(logger.rem).to.be.an.instanceOf(WLogger);
    });

    describe('when call some logging method', () => {
      let remLoggerSpy: SinonSpy;

      before(() => {
        remLoggerSpy = spy(REM_LOGGER, 'log');
        logger.rem.silly('awesome message', 1, 'a', { x: 10 });
      });

      after(() => {
        remLoggerSpy.restore();
      });

      it('should be logged by remote logger', () => {
        expect(remLoggerSpy.calledWith(
          'silly',
          '[awesome-module] awesome message 1 a',
          { x: 10 },
        )).to.be.true;
      });
    });
  });
});

describe('RemTransport', () => {
  let rt: RemTransport;

  before(() => {
    rt = new RemTransport({
      uri: 'http://test/log',
      keepAlive: true,
      headers: {
        xmpl: 'example',
      },
    });
  });

  describe('log', () => {
    describe('when server is up', () => {
      let cbSpy: SinonSpy;

      before((done) => {
        nock('http://test', {
          reqheaders: {
            xmpl: 'example',
          },
        }).post('/log', {
          datetime: /^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/,
          level: 'silly',
          msg: 'awesome message',
          meta: { x: 10 },
        }).reply(200, is<RemTransport.Res['body']>({}));

        cbSpy = spy(() => done());

        rt.log('silly', 'awesome message', { x: 10 }, cbSpy);
      });

      it('should call back without error', () => {
        expect(cbSpy.args[0]).to.deep.equal([ null, true ]);
      });
    });

    describe('when server is down', () => {
      let cbSpy: SinonSpy;

      before((done) => {
        nock('http://test').post('/log').replyWithError('any');

        cbSpy = spy(() => done());

        rt.log('silly', 'awesome message', { x: 42 }, cbSpy);
      });

      it('should call back with error', () => {
        expect(cbSpy.args[0][0]).to.be.an.instanceOf(RequestError);
      });
    });
  });
});
