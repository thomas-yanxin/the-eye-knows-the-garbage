import * as React from 'react';
import { IntlShape, FormatPluralOptions } from '../types';
interface Props extends FormatPluralOptions {
    value: number;
    intl: IntlShape;
    other: React.ReactNode;
    zero?: React.ReactNode;
    one?: React.ReactNode;
    two?: React.ReactNode;
    few?: React.ReactNode;
    many?: React.ReactNode;
    children?(value: React.ReactNode): React.ReactElement | null;
}
declare const _default: React.ForwardRefExoticComponent<Pick<Props, "children" | "other" | "zero" | "one" | "two" | "few" | "many" | "format" | "localeMatcher" | "type" | "value"> & {
    forwardedRef?: ((instance: any) => void) | React.RefObject<any> | null | undefined;
} & React.RefAttributes<any>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
