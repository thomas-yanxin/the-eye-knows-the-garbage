import { Backend, DragDropManager, Unsubscribe } from 'dnd-core';
import { HTML5BackendContext } from './types';
declare global {
    interface Window {
        __isReactDndBackendSetUp: boolean | undefined;
    }
}
export declare class HTML5BackendImpl implements Backend {
    private options;
    private actions;
    private monitor;
    private registry;
    private enterLeaveCounter;
    private sourcePreviewNodes;
    private sourcePreviewNodeOptions;
    private sourceNodes;
    private sourceNodeOptions;
    private dragStartSourceIds;
    private dropTargetIds;
    private dragEnterTargetIds;
    private currentNativeSource;
    private currentNativeHandle;
    private currentDragSourceNode;
    private altKeyPressed;
    private mouseMoveTimeoutTimer;
    private asyncEndDragFrameId;
    private dragOverTargetIds;
    constructor(manager: DragDropManager, globalContext?: HTML5BackendContext);
    /**
     * Generate profiling statistics for the HTML5Backend.
     */
    profile(): Record<string, number>;
    get window(): Window | undefined;
    get document(): Document | undefined;
    setup(): void;
    teardown(): void;
    connectDragPreview(sourceId: string, node: Element, options: any): Unsubscribe;
    connectDragSource(sourceId: string, node: Element, options: any): Unsubscribe;
    connectDropTarget(targetId: string, node: HTMLElement): Unsubscribe;
    private addEventListeners;
    private removeEventListeners;
    private getCurrentSourceNodeOptions;
    private getCurrentDropEffect;
    private getCurrentSourcePreviewNodeOptions;
    private getSourceClientOffset;
    private isDraggingNativeItem;
    private beginDragNativeItem;
    private endDragNativeItem;
    private isNodeInDocument;
    private endDragIfSourceWasRemovedFromDOM;
    private setCurrentDragSourceNode;
    private clearCurrentDragSourceNode;
    handleTopDragStartCapture: () => void;
    handleDragStart(e: DragEvent, sourceId: string): void;
    handleTopDragStart: (e: DragEvent) => void;
    handleTopDragEndCapture: () => void;
    handleTopDragEnterCapture: (e: DragEvent) => void;
    handleDragEnter(e: DragEvent, targetId: string): void;
    handleTopDragEnter: (e: DragEvent) => void;
    handleTopDragOverCapture: () => void;
    handleDragOver(e: DragEvent, targetId: string): void;
    handleTopDragOver: (e: DragEvent) => void;
    handleTopDragLeaveCapture: (e: DragEvent) => void;
    handleTopDropCapture: (e: DragEvent) => void;
    handleDrop(e: DragEvent, targetId: string): void;
    handleTopDrop: (e: DragEvent) => void;
    handleSelectStart: (e: DragEvent) => void;
}
