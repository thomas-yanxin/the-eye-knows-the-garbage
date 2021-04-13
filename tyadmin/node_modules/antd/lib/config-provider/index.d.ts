import * as React from 'react';
import { ValidateMessages } from 'rc-field-form/lib/interface';
import { RenderEmptyHandler } from './renderEmpty';
import { Locale } from '../locale-provider';
import { ConfigConsumer, ConfigContext, CSPConfig, ConfigConsumerProps } from './context';
import { SizeType } from './SizeContext';
export { RenderEmptyHandler, ConfigContext, ConfigConsumer, CSPConfig, ConfigConsumerProps };
export declare const configConsumerProps: string[];
export interface ConfigProviderProps {
    getTargetContainer?: () => HTMLElement;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    prefixCls?: string;
    children?: React.ReactNode;
    renderEmpty?: RenderEmptyHandler;
    csp?: CSPConfig;
    autoInsertSpaceInButton?: boolean;
    form?: {
        validateMessages?: ValidateMessages;
    };
    input?: {
        autoComplete?: string;
    };
    locale?: Locale;
    pageHeader?: {
        ghost: boolean;
    };
    componentSize?: SizeType;
    direction?: 'ltr' | 'rtl';
    space?: {
        size?: SizeType | number;
    };
    virtual?: boolean;
    dropdownMatchSelectWidth?: boolean;
}
declare const ConfigProvider: React.FC<ConfigProviderProps>;
export default ConfigProvider;
