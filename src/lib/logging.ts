import {
  Logger as WLogger,
  LoggerInstance,
  Transport,
  transports,
  GenericTransportOptions,
} from 'winston';
import { post } from 'request-promise';
import { utc } from 'moment';
import { is } from '.';

export const MAIN_LOGGER = new WLogger({
  level: 'silly',
  transports: [
    new transports.Console({
      label: 'main',
    }),
  ],
});

/**
 * Remote
 */
export const REM_LOGGER = new WLogger({
  level: 'silly',
  transports: [
    new transports.Console({
      label: 'remote',
    }),
  ],
});

export class Logger {

  private _main: LoggerInstance | null = null;

  private _rem: LoggerInstance | null = null;

  constructor(private label: string) {}

  get main() {
    if (!this._main) {
      this._main = new WLogger({
        // Zabezpeci, ze log metoda wrapper-a bude vzdy zavolana
        level: 'silly',
        transports: [
          new WrapperTransport(MAIN_LOGGER, this.label),
        ],
      });
    }

    return this._main;
  }

  /**
   * Remote
   */
  get rem() {
    if (!this._rem) {
      this._rem = new WLogger({
        // Zabezpeci, ze log metoda wrapper-a bude vzdy zavolana
        level: 'silly',
        transports: [
          new WrapperTransport(REM_LOGGER, this.label),
        ],
      });
    }

    return this._rem;
  }

}

class WrapperTransport extends Transport {

  constructor(private logger: LoggerInstance, private label: string) {
    super({
      name: 'wrapper',
      // Zabezpeci, ze log metoda bude vzdy zavolana
      level: 'silly',
    });
  }

  log(
    level: string,
    msg: string,
    meta: object,
    callback: (e: Error | null, ok?: boolean) => void,
  ) {
    this.logger.log(level, `[${this.label}] ${msg}`, meta);
    callback(null, true);
  }

}

/**
 * Remote
 */
export class RemTransport extends Transport {

  constructor(private opts: RemTransport.Opts) {
    super({
      name: 'remote',
      level: 'error',
      label: 'remote',
      ...opts,
    });
  }

  log(
    level: string,
    msg: string,
    meta: object,
    callback: (e: Error | null, ok?: boolean) => void,
  ) {
    post(this.opts.uri, {
      forever: this.opts.keepAlive || false,
      headers: this.opts.headers || {},
      json: true,
      body: is<RemTransport.Req['body']>({
        datetime: utc().format('YYYY-MM-DD HH:mm:ss'),
        level,
        msg,
        meta,
      }),
    }).then((r: RemTransport.Res['body']) => {
      callback(null, true);
    }).catch((e: Error) => {
      callback(e);
    });
  }

}

export namespace RemTransport {

  export interface Opts extends GenericTransportOptions {

    uri: string;

    /**
     * Default: false
     */
    keepAlive?: boolean;

    /**
     * Default: {}
     */
    headers?: {

      [header: string]: string;

    }

  }

  export interface Req {

    body: {

      datetime: string;

      level: string;

      msg: string;

      meta: AnyObj;

    }

  }

  export interface Res {

    body: {}

  }

}
