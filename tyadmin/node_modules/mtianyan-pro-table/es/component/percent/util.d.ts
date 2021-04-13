/// <reference types="react" />
/** 获取展示符号 */
export declare function getSymbolByRealValue(realValue: number): "" | "+";
/** 获取颜色 */
export declare function getColorByRealValue(realValue: number /** ,color: string */): "#595959" | "#ff4d4f" | "#52c41a";
/** 获取到最后展示的数字 */
export declare function getRealTextWithPrecision(realValue: number, precision?: number): import("react").ReactText;
