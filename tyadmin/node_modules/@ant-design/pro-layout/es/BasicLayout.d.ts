import './BasicLayout.less';
import React, { CSSProperties } from 'react';
import { BreadcrumbProps as AntdBreadcrumbProps } from 'antd/es/breadcrumb';
import { HeaderViewProps } from './Header';
import { MenuDataItem, MessageDescriptor, Route, RouterTypes, WithFalse } from './typings';
import { GetPageTitleProps } from './getPageTitle';
import { PureSettings } from './defaultSettings';
import { LocaleType } from './locales';
import { BaseMenuProps } from './SiderMenu/BaseMenu';
import { SiderMenuProps } from './SiderMenu/SiderMenu';
export declare type BasicLayoutProps = Partial<RouterTypes<Route>> & SiderMenuProps & HeaderViewProps & Partial<PureSettings> & {
    pure?: boolean;
    /**
     * logo url
     */
    logo?: React.ReactNode | WithFalse<() => React.ReactNode>;
    /**
     * 页面切换的时候触发
     */
    onPageChange?: (location?: RouterTypes<Route>['location']) => void;
    loading?: boolean;
    locale?: LocaleType;
    onCollapse?: (collapsed: boolean) => void;
    footerRender?: WithFalse<(props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode>;
    breadcrumbRender?: (routers: AntdBreadcrumbProps['routes']) => AntdBreadcrumbProps['routes'];
    menuItemRender?: BaseMenuProps['menuItemRender'];
    pageTitleRender?: WithFalse<(props: GetPageTitleProps, defaultPageTitle?: string, info?: {
        title: string;
        id: string;
        pageName: string;
    }) => string>;
    menuDataRender?: (menuData: MenuDataItem[]) => MenuDataItem[];
    itemRender?: AntdBreadcrumbProps['itemRender'];
    formatMessage?: (message: MessageDescriptor) => string;
    /**
     * 是否禁用移动端模式，有的管理系统不需要移动端模式，此属性设置为true即可
     */
    disableMobile?: boolean;
    contentStyle?: CSSProperties;
    isChildrenLayout?: boolean;
    className?: string;
    /**
     * 兼用 content的 margin
     */
    disableContentMargin?: boolean;
};
export declare type BasicLayoutContext = {
    [K in 'location']: BasicLayoutProps[K];
} & {
    breadcrumb: {
        [path: string]: MenuDataItem;
    };
};
/**
 * 🌃 Powerful and easy to use beautiful layout
 * 🏄‍ Support multiple topics and layout types
 * @param props
 */
declare const BasicLayout: React.FC<BasicLayoutProps>;
export default BasicLayout;
