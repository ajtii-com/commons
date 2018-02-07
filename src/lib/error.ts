import { VError, Options } from 'verror';

export class MyError extends VError {

  constructor(msg: string, ...args: any[]);
  constructor(cause: Error, msg: string, ...args: any[]);
  constructor(options: Options, msg: string, ...args: any[]);
  constructor(
    options: Options | string | Error,
    msg: any,
    ...args: any[]
  ) {
    if (typeof options === 'string' && arguments.length >= 2) {
      args.unshift(msg);
    }

    for (let i in args) {
      if (typeof args[i] === 'undefined') args[i] = '<undefined>';
      else if (args[i] === null) args[i] = '<null>';
      else if (args[i] === '') args[i] = '<empty string>';
      // Naozaj len retazce?
      else if (typeof args[i] === 'string' && (args[i].indexOf(' ') > -1
          || args[i].indexOf('\'') > -1)) {
        args[i] = args[i].replace(/'/g, '\\\'');
        args[i] = `'${args[i]}'`;
      }
    }

    if (typeof options !== 'string')
      super(options, msg, ...args);
    else
      super(options, ...args);
  }
  
};
