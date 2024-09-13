export * from './geometry';
export * from './object';
export * from './projection';

export type * from './projection';

/**
 * @param str
 */
export function cleanString(str: string): string {
  return str
    .trim() // Remove whitespace at the start and end
    .replace(/^['"]|['"]$/g, '') // Remove single or double quotes from start and end
    .replace(/\s+/g, ' '); // Replace multiple spaces with a single space
}