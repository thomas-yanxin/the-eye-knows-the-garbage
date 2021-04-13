import React, { ReactNode } from 'react';
import './index.less';
import { RouteContextType } from '../index';
export interface FooterToolbarProps {
    extra?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    renderContent?: (props: FooterToolbarProps & RouteContextType & {
        leftWidth?: string;
    }, dom: JSX.Element) => ReactNode;
    prefixCls?: string;
}
declare const FooterToolbar: React.FC<FooterToolbarProps>;
export default FooterToolbar;
