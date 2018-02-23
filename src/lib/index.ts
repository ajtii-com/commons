/**
 * Empty String
 */
export const ES = '';

/**
 * ```text
 * undefined   => "undefined"
 * null        => "null"
 * []          => "array()"
 * "("         => "string(\()"
 * ")"         => "string(\))"
 * "()"        => "string(\(\))"
 * <x>         => "<type of x>(<x with escaped parenthesis>)"
 * ```
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

  value = value.toString().replace(/([()])/g, '\\$1');

  return `${type}(${value})`;
}
