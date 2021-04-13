import * as React from 'react';
import Dragger from './Dragger';
import { RcFile, UploadProps, UploadState, UploadFile, UploadLocale, UploadChangeParam, UploadType, UploadListType } from './interface';
import { T } from './utils';
import { ConfigConsumerProps } from '../config-provider';
export { UploadProps };
declare class Upload extends React.Component<UploadProps, UploadState> {
    static Dragger: typeof Dragger;
    static defaultProps: {
        type: UploadType;
        multiple: boolean;
        action: string;
        data: {};
        accept: string;
        beforeUpload: typeof T;
        showUploadList: boolean;
        listType: UploadListType;
        className: string;
        disabled: boolean;
        supportServerRender: boolean;
    };
    static getDerivedStateFromProps(nextProps: UploadProps): {
        fileList: UploadFile<any>[];
    } | null;
    recentUploadStatus: boolean | PromiseLike<any>;
    progressTimer: any;
    upload: any;
    constructor(props: UploadProps);
    componentWillUnmount(): void;
    saveUpload: (node: any) => void;
    onStart: (file: RcFile) => void;
    onSuccess: (response: any, file: UploadFile, xhr: any) => void;
    onProgress: (e: {
        percent: number;
    }, file: UploadFile) => void;
    onError: (error: Error, response: any, file: UploadFile) => void;
    handleRemove: (file: UploadFile) => void;
    onChange: (info: UploadChangeParam) => void;
    onFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    beforeUpload: (file: RcFile, fileList: RcFile[]) => boolean | PromiseLike<void>;
    clearProgressTimer(): void;
    renderUploadList: (locale: UploadLocale) => JSX.Element;
    renderUpload: ({ getPrefixCls, direction }: ConfigConsumerProps) => JSX.Element;
    render(): JSX.Element;
}
export default Upload;
