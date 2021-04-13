import * as React from 'react';
import { InternalNamePath } from '../interface';
export default function useItemRef(): (name: InternalNamePath, children: any) => ((instance: any) => void) | React.RefObject<any> | null | undefined;
