import * as React from "react";
interface ImageFile {
    url: string;
    [key: string]: any;
}
export interface ImagePickerPropTypes {
    style?: React.CSSProperties;
    files?: Array<ImageFile>;
    onChange?: (files: Array<ImageFile>, operationType: string, index?: number) => void;
    onImageClick?: (index?: number, files?: Array<ImageFile>) => void;
    onAddImageClick?: (e: React.MouseEvent) => void;
    onFail?: (msg: string) => void;
    selectable?: boolean;
    multiple?: boolean;
    accept?: string;
    length?: number | string;
    capture?: any;
    disableDelete?: boolean;
}
export {};
