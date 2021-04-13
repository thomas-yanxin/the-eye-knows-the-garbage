import { MenuDataItem, Route, MessageDescriptor } from '../typings';
declare const _default: (routes: Route[], menu?: {
    locale?: boolean | undefined;
} | undefined, formatMessage?: ((message: MessageDescriptor) => string) | undefined, menuDataRender?: ((menuData: MenuDataItem[]) => MenuDataItem[]) | undefined) => {
    breadcrumb: {
        [key: string]: MenuDataItem;
    };
    breadcrumbMap: Map<string, import("@umijs/route-utils").MenuDataItem>;
    menuData: import("@umijs/route-utils").MenuDataItem[];
};
export default _default;
