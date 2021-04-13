import * as React from 'react';
export declare type InputEventHandler = (value?: string) => void;
export declare type InputKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.';
export interface InputItemPropsType {
    moneyKeyboardAlign?: string;
    moneyKeyboardWrapProps?: object;
    moneyKeyboardHeader?: React.ReactNode;
    type?: 'text' | 'bankCard' | 'phone' | 'password' | 'number' | 'digit' | 'money';
    editable?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    clear?: boolean;
    maxLength?: number;
    extra?: React.ReactNode;
    error?: boolean;
    labelNumber?: number;
    labelPosition?: 'left' | 'top';
    textAlign?: 'left' | 'center';
    updatePlaceholder?: boolean;
    locale?: object;
    onChange?: (value: string) => void;
    onFocus?: InputEventHandler;
    onBlur?: InputEventHandler;
    onVirtualKeyboardConfirm?: InputEventHandler;
    disabledKeys?: Array<InputKey> | null | undefined;
}
