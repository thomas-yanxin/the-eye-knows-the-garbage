import { MenuDataItem } from './typings';
import { ProSettings } from './defaultSettings';
export declare const matchParamsPath: (pathname: string, breadcrumb?: {
    [path: string]: MenuDataItem;
} | undefined, breadcrumbMap?: Map<string, MenuDataItem> | undefined) => MenuDataItem;
export interface GetPageTitleProps {
    pathname?: string;
    breadcrumb?: {
        [path: string]: MenuDataItem;
    };
    breadcrumbMap?: Map<string, MenuDataItem>;
    menu?: ProSettings['menu'];
    title?: ProSettings['title'];
    pageName?: string;
    formatMessage?: (data: {
        id: any;
        defaultMessage?: string;
    }) => string;
}
declare const getPageTitle: (props: GetPageTitleProps, ignoreTile?: boolean | undefined) => string;
/**
 * 获取关于 pageTile 的所有信息方便包装
 * @param props
 * @param ignoreTile
 */
declare const getPageTitleInfo: (props: GetPageTitleProps, ignoreTile?: boolean | undefined) => {
    title: string;
    id: string;
    pageName: string;
};
export { getPageTitleInfo };
export default getPageTitle;
