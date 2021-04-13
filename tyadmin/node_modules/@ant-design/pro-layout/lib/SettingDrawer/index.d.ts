import './index.less';
import React from 'react';
import { ProSettings } from '../defaultSettings';
declare type MergerSettingsType<T> = Partial<T> & {
    primaryColor?: string;
    colorWeak?: boolean;
};
export interface SettingItemProps {
    title: React.ReactNode;
    action: React.ReactElement;
    disabled?: boolean;
    disabledReason?: React.ReactNode;
}
export interface SettingDrawerProps {
    settings?: MergerSettingsType<ProSettings>;
    collapse?: boolean;
    getContainer?: any;
    publicPath?: string;
    hideLoading?: boolean;
    hideColors?: boolean;
    hideHintAlert?: boolean;
    prefixCls?: string;
    hideCopyButton?: boolean;
    onCollapseChange?: (collapse: boolean) => void;
    onSettingChange?: (settings: MergerSettingsType<ProSettings>) => void;
}
export interface SettingDrawerState extends MergerSettingsType<ProSettings> {
    collapse?: boolean;
    language?: string;
}
export declare const getFormatMessage: () => (data: {
    id: string;
    defaultMessage?: string;
}) => string;
/**
 * 可视化配置组件
 * @param props
 */
declare const SettingDrawer: React.FC<SettingDrawerProps>;
export default SettingDrawer;
