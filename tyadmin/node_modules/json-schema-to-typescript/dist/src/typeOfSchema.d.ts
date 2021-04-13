import { JSONSchema, SCHEMA_TYPE } from './types/JSONSchema';
/**
 * Duck types a JSONSchema schema or property to determine which kind of AST node to parse it into.
 */
export declare function typeOfSchema(schema: JSONSchema): SCHEMA_TYPE;
