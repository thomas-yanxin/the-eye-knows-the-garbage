import './Header.less';
import React, { Component } from 'react';
import { GlobalHeaderProps } from './GlobalHeader';
import { PureSettings } from './defaultSettings';
import { WithFalse } from './typings';
export declare type HeaderViewProps = Partial<PureSettings> & GlobalHeaderProps & {
    isMobile?: boolean;
    collapsed?: boolean;
    logo?: React.ReactNode;
    headerRender?: WithFalse<(props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode>;
    headerTitleRender?: WithFalse<(props: HeaderViewProps, defaultDom: React.ReactNode) => React.ReactNode>;
    headerContentRender?: WithFalse<(props: HeaderViewProps) => React.ReactNode>;
    siderWidth?: number;
    hasSiderMenu?: boolean;
};
interface HeaderViewState {
    visible: boolean;
}
declare class HeaderView extends Component<HeaderViewProps, HeaderViewState> {
    renderContent: () => import("history").History.PoorMansUnknown;
    render(): React.ReactNode;
}
export default HeaderView;
