import { IParseOptions } from './parser';
import { Options, MessageFormatElement } from './types';
export * from './types';
export * from './parser';
export * from './skeleton';
export declare type ParseOptions = Options & IParseOptions;
export declare function parse(input: string, opts?: ParseOptions): MessageFormatElement[];
