import React, { CSSProperties } from 'react';
import { WithFalse } from './typings';
export interface FooterProps {
    links?: WithFalse<{
        key?: string;
        title: React.ReactNode;
        href: string;
        blankTarget?: boolean;
    }[]>;
    copyright?: WithFalse<String>;
    style?: CSSProperties;
    className?: string;
}
declare const FooterView: React.FC<FooterProps>;
export default FooterView;
