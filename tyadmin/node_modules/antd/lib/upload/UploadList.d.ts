import * as React from 'react';
import { UploadListProps, UploadFile, UploadListType } from './interface';
import { previewImage } from './utils';
import { ConfigConsumerProps } from '../config-provider';
export default class UploadList extends React.Component<UploadListProps, any> {
    static defaultProps: {
        listType: UploadListType;
        progress: {
            strokeWidth: number;
            showInfo: boolean;
        };
        showRemoveIcon: boolean;
        showDownloadIcon: boolean;
        showPreviewIcon: boolean;
        previewFile: typeof previewImage;
        isImageUrl: (file: UploadFile<any>) => boolean;
    };
    componentDidUpdate(): void;
    handlePreview: (file: UploadFile, e: React.SyntheticEvent<HTMLElement>) => void;
    handleDownload: (file: UploadFile) => void;
    handleClose: (file: UploadFile) => void;
    handleIconRender: (file: UploadFile) => {} | null | undefined;
    handleActionIconRender: (customIcon: React.ReactNode, callback: () => void, prefixCls: string, title?: string | undefined) => JSX.Element;
    renderUploadList: ({ getPrefixCls, direction }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
