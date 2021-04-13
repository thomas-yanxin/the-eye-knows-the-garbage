import React, { CSSProperties } from 'react';
import { SiderProps } from 'antd/es/layout/Sider';
import './index.less';
import { WithFalse } from '../typings';
import { BaseMenuProps } from './BaseMenu';
export declare const defaultRenderLogo: (logo: React.ReactNode) => React.ReactNode;
export declare const defaultRenderLogoAndTitle: (props: SiderMenuProps, renderKey?: string) => React.ReactNode;
export interface SiderMenuProps extends Pick<BaseMenuProps, Exclude<keyof BaseMenuProps, ['onCollapse']>> {
    logo?: React.ReactNode;
    siderWidth?: number;
    menuHeaderRender?: WithFalse<(logo: React.ReactNode, title: React.ReactNode, props?: SiderMenuProps) => React.ReactNode>;
    menuContentRender?: WithFalse<(props: SiderMenuProps, defaultDom: React.ReactNode) => React.ReactNode>;
    menuExtraRender?: WithFalse<(props: SiderMenuProps) => React.ReactNode>;
    collapsedButtonRender?: WithFalse<(collapsed?: boolean) => React.ReactNode>;
    breakpoint?: SiderProps['breakpoint'] | false;
    onMenuHeaderClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    hide?: boolean;
    className?: string;
    style?: CSSProperties;
    links?: React.ReactNode[];
    onOpenChange?: (openKeys: WithFalse<string[]>) => void;
}
export declare const defaultRenderCollapsedButton: (collapsed?: boolean | undefined) => JSX.Element;
declare const SiderMenu: React.FC<SiderMenuProps>;
export default SiderMenu;
