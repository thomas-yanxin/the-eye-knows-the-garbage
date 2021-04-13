import * as React from 'react';
import Cell from './Cell';
import Row from './Row';
export interface FooterProps<RecordType> {
    children: React.ReactNode;
}
declare function Footer<RecordType>({ children }: FooterProps<RecordType>): JSX.Element;
export default Footer;
export declare const FooterComponents: {
    Cell: typeof Cell;
    Row: typeof Row;
};
