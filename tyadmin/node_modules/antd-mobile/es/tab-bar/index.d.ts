import * as React from 'react';
import { TabBarItemProps, TabBarProps } from './PropsType';
export declare class Item extends React.Component<TabBarItemProps, any> {
    static defaultProps: TabBarItemProps;
    render(): JSX.Element;
}
export interface AntTabbarProps extends TabBarProps {
    prefixCls?: string;
    className?: string;
    hidden?: boolean;
    placeholder?: React.ReactNode;
    noRenderContent?: boolean;
    prerenderingSiblingsNumber?: number;
}
declare class AntTabBar extends React.Component<AntTabbarProps, any> {
    static defaultProps: AntTabbarProps;
    static Item: typeof Item;
    getTabs: () => TabBarItemProps[];
    renderTabBar: () => JSX.Element;
    render(): JSX.Element;
}
export default AntTabBar;
