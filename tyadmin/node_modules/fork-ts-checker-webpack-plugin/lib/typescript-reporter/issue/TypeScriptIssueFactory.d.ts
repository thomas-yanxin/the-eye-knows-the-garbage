import * as ts from 'typescript';
import { Issue } from '../../issue';
declare function createIssuesFromTsDiagnostics(diagnostics: ts.Diagnostic[]): Issue[];
export { createIssuesFromTsDiagnostics };
