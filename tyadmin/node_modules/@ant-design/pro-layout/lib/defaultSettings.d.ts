import { MenuTheme } from 'antd/es/menu/MenuContext';
export declare type ContentWidth = 'Fluid' | 'Fixed';
export interface RenderSetting {
    headerRender?: false;
    footerRender?: false;
    menuRender?: false;
    menuHeaderRender?: false;
}
export interface PureSettings {
    /**
     * theme for nav menu
     */
    navTheme: MenuTheme | 'realDark' | undefined;
    /**
     * nav menu position: `side` or `top`
     */
    layout: 'side' | 'top' | 'mix';
    /**
     * layout of content: `Fluid` or `Fixed`, only works when layout is top
     */
    contentWidth: ContentWidth;
    /**
     * sticky header
     */
    fixedHeader: boolean;
    /**
     * sticky siderbar
     */
    fixSiderbar: boolean;
    menu: {
        locale?: boolean;
        defaultOpenAll?: boolean;
    };
    title: string;
    iconfontUrl: string;
    primaryColor: string;
    colorWeak?: boolean;
    splitMenus?: boolean;
}
export declare type ProSettings = PureSettings & RenderSetting;
declare const defaultSettings: ProSettings;
export default defaultSettings;
