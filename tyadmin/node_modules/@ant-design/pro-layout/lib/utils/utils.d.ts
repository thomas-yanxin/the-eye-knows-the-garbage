/// <reference types="react" />
import { MenuDataItem } from '../typings';
export declare const isUrl: (path: string) => boolean;
export declare const isBrowser: () => boolean;
export declare function guid(): string;
export declare const getKeyByPath: (item: MenuDataItem) => string;
export declare const getOpenKeysFromMenuData: (menuData?: MenuDataItem[] | undefined) => string[] | undefined;
export declare function useDeepCompareEffect(effect: React.EffectCallback, dependencies?: Object): void;
/**
 * #1890ff -> daybreak
 * @param val
 */
export declare function genThemeToString(val?: string): string;
/**
 * daybreak-> #1890ff
 * @param val
 */
export declare function genStringToTheme(val?: string): string;
export declare const usePrevious: <T>(state: T) => T | undefined;
export declare function debounce(func: Function, wait: number, immediate?: boolean): any;
