import * as React from 'react';
import { ItemGroup, MenuProps as RcMenuProps } from 'rc-menu';
import SubMenu from './SubMenu';
import Item from './MenuItem';
import { MenuTheme } from './MenuContext';
export { MenuItemGroupProps } from 'rc-menu';
export declare type MenuMode = 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | 'inline';
export interface MenuProps extends RcMenuProps {
    theme?: MenuTheme;
    inlineIndent?: number;
    focusable?: boolean;
}
export default class Menu extends React.Component<MenuProps, {}> {
    static Divider: React.FC<import("rc-menu/lib/Divider").DividerProps>;
    static Item: typeof Item;
    static SubMenu: typeof SubMenu;
    static ItemGroup: typeof ItemGroup;
    render(): JSX.Element;
}
