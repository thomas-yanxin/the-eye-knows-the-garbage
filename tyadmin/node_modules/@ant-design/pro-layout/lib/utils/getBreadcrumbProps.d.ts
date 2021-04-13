import H from 'history';
import { BreadcrumbProps as AntdBreadcrumbProps } from 'antd/es/breadcrumb';
import { ProSettings } from '../defaultSettings';
import { MenuDataItem, MessageDescriptor } from '../typings';
export interface BreadcrumbProps {
    breadcrumbList?: {
        title: string;
        href: string;
    }[];
    home?: string;
    location?: H.Location | {
        pathname?: string;
    };
    menu?: ProSettings['menu'];
    breadcrumbMap?: Map<string, MenuDataItem>;
    formatMessage?: (message: MessageDescriptor) => string;
    breadcrumbRender?: (routers: AntdBreadcrumbProps['routes']) => AntdBreadcrumbProps['routes'];
    itemRender?: AntdBreadcrumbProps['itemRender'];
}
export declare const getBreadcrumb: (breadcrumbMap: Map<string, MenuDataItem>, url: string) => MenuDataItem;
export declare const getBreadcrumbFromProps: (props: BreadcrumbProps) => {
    location: BreadcrumbProps['location'];
    breadcrumbMap: BreadcrumbProps['breadcrumbMap'];
};
export declare type BreadcrumbListReturn = Pick<AntdBreadcrumbProps, Extract<keyof AntdBreadcrumbProps, 'routes' | 'itemRender'>>;
/**
 * 将参数转化为面包屑
 * Convert parameters into breadcrumbs
 */
export declare const genBreadcrumbProps: (props: BreadcrumbProps) => AntdBreadcrumbProps['routes'];
export declare const getBreadcrumbProps: (props: BreadcrumbProps) => BreadcrumbListReturn;
