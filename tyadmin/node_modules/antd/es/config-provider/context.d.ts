import * as React from 'react';
import { RenderEmptyHandler } from './renderEmpty';
import { Locale } from '../locale-provider';
import { SizeType } from './SizeContext';
export interface CSPConfig {
    nonce?: string;
}
export interface ConfigConsumerProps {
    getTargetContainer?: () => HTMLElement;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    rootPrefixCls?: string;
    getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string;
    renderEmpty: RenderEmptyHandler;
    csp?: CSPConfig;
    autoInsertSpaceInButton?: boolean;
    input?: {
        autoComplete?: string;
    };
    locale?: Locale;
    pageHeader?: {
        ghost: boolean;
    };
    direction?: 'ltr' | 'rtl';
    space?: {
        size?: SizeType | number;
    };
    virtual?: boolean;
    dropdownMatchSelectWidth?: boolean;
}
export declare const ConfigContext: React.Context<ConfigConsumerProps>;
export declare const ConfigConsumer: React.Consumer<ConfigConsumerProps>;
declare type IReactComponent<P = any> = React.FC<P> | React.ComponentClass<P> | React.ClassicComponentClass<P>;
interface BasicExportProps {
    prefixCls?: string;
}
interface ConsumerConfig {
    prefixCls: string;
}
export declare function withConfigConsumer<ExportProps extends BasicExportProps>(config: ConsumerConfig): <ComponentDef>(Component: IReactComponent) => React.FC<ExportProps> & ComponentDef;
export {};
