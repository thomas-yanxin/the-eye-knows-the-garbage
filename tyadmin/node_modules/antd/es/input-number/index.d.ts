import * as React from 'react';
import { Omit } from '../_util/type';
import { SizeType } from '../config-provider/SizeContext';
export declare type OmitAttrs = 'defaultValue' | 'onChange' | 'size';
export interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, OmitAttrs> {
    prefixCls?: string;
    min?: number;
    max?: number;
    value?: number;
    step?: number | string;
    defaultValue?: number;
    tabIndex?: number;
    onChange?: (value: number | string | undefined) => void;
    disabled?: boolean;
    size?: SizeType;
    formatter?: (value: number | string | undefined) => string;
    parser?: (displayValue: string | undefined) => number | string;
    decimalSeparator?: string;
    placeholder?: string;
    style?: React.CSSProperties;
    className?: string;
    name?: string;
    id?: string;
    precision?: number;
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
}
declare const InputNumber: React.ForwardRefExoticComponent<InputNumberProps & React.RefAttributes<unknown>>;
export default InputNumber;
