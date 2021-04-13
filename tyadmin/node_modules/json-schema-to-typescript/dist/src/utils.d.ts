import { JSONSchema } from './types/JSONSchema';
export declare function Try<T>(fn: () => T, err: (e: Error) => any): T;
/**
 * Depth-first traversal
 */
export declare function dft<T, U>(object: {
    [k: string]: any;
}, cb: (value: U, key: string) => T): void;
export declare function mapDeep(object: object, fn: (value: object, key?: string) => object, key?: string): object;
export declare function traverse(schema: JSONSchema, callback: (schema: JSONSchema) => void): void;
/**
 * Eg. `foo/bar/baz.json` => `baz`
 */
export declare function justName(filename?: string): string;
/**
 * Avoid appending "js" to top-level unnamed schemas
 */
export declare function stripExtension(filename: string): string;
/**
 * Convert a string that might contain spaces or special characters to one that
 * can safely be used as a TypeScript interface or enum name.
 */
export declare function toSafeString(string: string): string;
export declare function generateName(from: string, usedNames: Set<string>): string;
export declare function error(...messages: any[]): void;
export declare function log(...messages: any[]): void;
/**
 * escape block comments in schema descriptions so that they don't unexpectedly close JSDoc comments in generated typescript interfaces
 */
export declare function escapeBlockComment(schema: JSONSchema): void;
export declare function pathTransform(o: string, i: string): string;
