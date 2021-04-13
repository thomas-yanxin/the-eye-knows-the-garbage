import * as React from 'react';
import { FormInstance } from 'rc-field-form';
import { FieldProps } from 'rc-field-form/lib/Field';
import { FormItemLabelProps } from './FormItemLabel';
import { FormItemInputProps } from './FormItemInput';
declare const ValidateStatuses: ["success", "warning", "error", "validating", ""];
export declare type ValidateStatus = typeof ValidateStatuses[number];
declare type RenderChildren = (form: FormInstance) => React.ReactNode;
declare type RcFieldProps = Omit<FieldProps, 'children'>;
declare type ChildrenType = RenderChildren | React.ReactNode;
export interface FormItemProps extends FormItemLabelProps, FormItemInputProps, RcFieldProps {
    prefixCls?: string;
    noStyle?: boolean;
    style?: React.CSSProperties;
    className?: string;
    children?: ChildrenType;
    id?: string;
    hasFeedback?: boolean;
    validateStatus?: ValidateStatus;
    required?: boolean;
    hidden?: boolean;
    /** Auto passed by List render props. User should not use this. */
    fieldKey?: React.Key | React.Key[];
}
declare function FormItem(props: FormItemProps): React.ReactElement;
export default FormItem;
