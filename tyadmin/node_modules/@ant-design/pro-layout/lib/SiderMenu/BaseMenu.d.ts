import './index.less';
import React from 'react';
import { MenuMode, MenuProps } from 'antd/es/menu';
import { MenuTheme } from 'antd/es/menu/MenuContext';
import { PureSettings } from '../defaultSettings';
import { MenuDataItem, MessageDescriptor, Route, RouterTypes, WithFalse } from '../typings';
export interface BaseMenuProps extends Partial<RouterTypes<Route>>, Omit<MenuProps, 'openKeys' | 'onOpenChange'>, Partial<PureSettings> {
    className?: string;
    collapsed?: boolean;
    splitMenus?: boolean;
    handleOpenChange?: (openKeys: string[]) => void;
    isMobile?: boolean;
    menuData?: MenuDataItem[];
    mode?: MenuMode;
    onCollapse?: (collapsed: boolean) => void;
    openKeys?: WithFalse<string[]> | undefined;
    /**
     * 要给菜单的props, 参考antd-menu的属性。https://ant.design/components/menu-cn/
     */
    menuProps?: MenuProps;
    style?: React.CSSProperties;
    theme?: MenuTheme;
    formatMessage?: (message: MessageDescriptor) => string;
    subMenuItemRender?: WithFalse<(item: MenuDataItem & {
        isUrl: boolean;
    }, defaultDom: React.ReactNode) => React.ReactNode>;
    menuItemRender?: WithFalse<(item: MenuDataItem & {
        isUrl: boolean;
    }, defaultDom: React.ReactNode) => React.ReactNode>;
    postMenuData?: (menusData?: MenuDataItem[]) => MenuDataItem[];
}
declare const BaseMenu: React.FC<BaseMenuProps>;
export default BaseMenu;
