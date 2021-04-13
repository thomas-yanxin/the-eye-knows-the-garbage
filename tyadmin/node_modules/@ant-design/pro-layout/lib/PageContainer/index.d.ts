import React, { ReactNode } from 'react';
import { TabsProps, TabPaneProps } from 'antd/es/tabs';
import { PageHeaderProps } from 'antd/es/page-header';
import './index.less';
export interface PageHeaderTabConfig {
    tabList?: (TabPaneProps & {
        key?: React.ReactText;
    })[];
    tabActiveKey?: TabsProps['activeKey'];
    onTabChange?: TabsProps['onChange'];
    tabBarExtraContent?: TabsProps['tabBarExtraContent'];
    tabProps?: TabsProps;
}
export interface PageContainerProps extends PageHeaderTabConfig, Omit<PageHeaderProps, 'title'> {
    title?: React.ReactNode | false;
    content?: React.ReactNode;
    extraContent?: React.ReactNode;
    prefixCls?: string;
    footer?: ReactNode[];
    ghost?: boolean;
    pageHeaderRender?: (props: PageContainerProps) => React.ReactNode;
}
declare const PageContainer: React.FC<PageContainerProps>;
export default PageContainer;
