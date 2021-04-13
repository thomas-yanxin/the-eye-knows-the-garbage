/// <reference types="hapi__joi" />
import { JSONSchema4 } from 'json-schema';
import { Schema } from '@hapi/joi';
import { Options } from '../';
export declare type Parser<T = Schema> = (schema: T, options?: Options) => JSONSchema4;
declare const transformer: Parser;
export default transformer;
