import * as React from 'react';
import { MenuItemProps as RcMenuItemProps } from 'rc-menu';
import { SiderContextProps } from '../layout/Sider';
export interface MenuItemProps extends Omit<RcMenuItemProps, 'title'> {
    icon?: React.ReactNode;
    danger?: boolean;
    title?: React.ReactNode;
}
export default class MenuItem extends React.Component<MenuItemProps> {
    static isMenuItem: boolean;
    private menuItem;
    onKeyDown: (e: React.MouseEvent<HTMLElement>) => void;
    saveMenuItem: (menuItem: this) => void;
    renderItemChildren(inlineCollapsed: boolean): {} | null | undefined;
    renderItem: ({ siderCollapsed }: SiderContextProps) => JSX.Element;
    render(): JSX.Element;
}
