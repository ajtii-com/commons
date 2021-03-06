import jsStringify = require('javascript-stringify');

/**
 * Empty String
 */
export const ES = '';

/**
 * ```text
 * undefined   => "undefined"
 * null        => "null"
 * []          => "array([])"
 * "("         => "string('\(')"
 * ")"         => "string('\)')"
 * "()"        => "string('\(\)')"
 * <x>         => "<type of x>(<x with escaped parenthesis>)"
 * ```
 *
 * Before escaping parenthesis *javascript-stringify* is applied
 */
export function stringify(value: any): string {
  if (value === null) {
    return 'null';
  }

  let type: string = typeof value;

  if (type === 'undefined') {
    return 'undefined';
  }

  if (Array.isArray(value)) {
    type = 'array';
  }

  value = jsStringify(value).replace(/([()])/g, '\\$1');

  return `${type}(${value})`;
}

/**
 * $any as defined
 *
 * Excludes type undefined from type union of passed value,
 * otherwise throws an error
 *
 * ```ts
 * declare let a: number | null | undefined;
 * asDefined(a) as null;
 * ```
 */
export function asDefined<T>(any: T) {
  if (typeof any === 'undefined')
    throw new TypeError('Value must be defined');

  return any;
}

/**
 * $any as value
 *
 * Excludes types undefined and null from type union of passed value,
 * otherwise throws an error
 *
 * ```ts
 * declare let a: number | null | undefined;
 * asValue(a)!;
 * ```
 */
export function asValue<T>(any: T) {
  if (typeof any === 'undefined' || any === null)
    throw new TypeError('Value must be defined and not null');

  return any;
}

/**
 * $value is T
 *
 * Checks (at compile-time only) if passed value is T and returns
 * the value
 *
 * ```ts
 * is<keyof Fakturace_PolozkaFakturyPrijateAttrs>('_commission');
 * // is shortcut for
 * let dbColName: keyof Fakturace_PolozkaFakturyPrijateAttrs = '_commission';
 * dbColName;
 * ```
 */
export function is<T>(value: T) {
  return value;
}
