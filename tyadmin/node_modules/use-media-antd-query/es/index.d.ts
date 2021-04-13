export declare const MediaQueryEnum: {
    xs: {
        maxWidth: number;
        matchMedia: string;
    };
    sm: {
        minWidth: number;
        maxWidth: number;
        matchMedia: string;
    };
    md: {
        minWidth: number;
        maxWidth: number;
        matchMedia: string;
    };
    lg: {
        minWidth: number;
        maxWidth: number;
        matchMedia: string;
    };
    xl: {
        minWidth: number;
        maxWidth: number;
        matchMedia: string;
    };
    xxl: {
        minWidth: number;
        matchMedia: string;
    };
};
export declare type MediaQueryKey = keyof typeof MediaQueryEnum;
/**
 * loop query screen className
 * Array.find will throw a error
 * `Rendered more hooks than during the previous render.`
 * So should use Array.forEach
 */
export declare const getScreenClassName: () => "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
declare const useMedia: () => "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export default useMedia;
