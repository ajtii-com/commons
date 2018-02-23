import { VError, Options } from 'verror';
import { stringify } from '.';

export class MyError extends VError {

  constructor(msg: string, ...args: any[]);
  constructor(options: Options, msg: string, ...args: any[]);
  constructor(cause: Error, msg: string, ...args: any[]);
  constructor(
    options: Options | string | Error,
    msg: any,
    ...args: any[]
  ) {
    if (typeof options === 'string' && arguments.length >= 2) {
      args.unshift(msg);
    }

    for (let i in args) {
      args[i] = stringify(args[i]);
    }

    if (typeof options !== 'string')
      super(options, msg, ...args);
    else
      super(options, ...args);
  }

}
