import React from 'react';
import './index.less';
export interface DropdownProps {
    className?: string;
    style?: React.CSSProperties;
    menus?: {
        name: React.ReactNode;
        key: string;
    }[];
    onSelect?: (key: string) => void;
}
/**
 * 默认的 index 列容器，提供一个好看的 index
 * @param param0
 */
declare const DropdownButton: React.FC<DropdownProps>;
declare const TableDropdown: React.FC<DropdownProps> & {
    Button: typeof DropdownButton;
};
export default TableDropdown;
