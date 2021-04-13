import * as React from 'react';
import { DataNode, IconType, Key, FlattenNode, DataEntity, EventDataNode, NodeInstance, ScrollTo } from './interface';
import { NodeListRef } from './NodeList';
interface CheckInfo {
    event: 'check';
    node: EventDataNode;
    checked: boolean;
    nativeEvent: MouseEvent;
    checkedNodes: DataNode[];
    checkedNodesPositions?: {
        node: DataNode;
        pos: string;
    }[];
    halfCheckedKeys?: Key[];
}
export interface TreeProps {
    prefixCls: string;
    className?: string;
    style?: React.CSSProperties;
    focusable?: boolean;
    tabIndex?: number;
    children?: React.ReactNode;
    treeData?: DataNode[];
    showLine?: boolean;
    showIcon?: boolean;
    icon?: IconType;
    selectable?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    checkable?: boolean | React.ReactNode;
    checkStrictly?: boolean;
    draggable?: boolean;
    defaultExpandParent?: boolean;
    autoExpandParent?: boolean;
    defaultExpandAll?: boolean;
    defaultExpandedKeys?: Key[];
    expandedKeys?: Key[];
    defaultCheckedKeys?: Key[];
    checkedKeys?: Key[] | {
        checked: Key[];
        halfChecked: Key[];
    };
    defaultSelectedKeys?: Key[];
    selectedKeys?: Key[];
    titleRender?: (node: DataNode) => React.ReactNode;
    onFocus?: React.FocusEventHandler<HTMLDivElement>;
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
    onClick?: (e: React.MouseEvent, treeNode: EventDataNode) => void;
    onDoubleClick?: (e: React.MouseEvent, treeNode: EventDataNode) => void;
    onExpand?: (expandedKeys: Key[], info: {
        node: EventDataNode;
        expanded: boolean;
        nativeEvent: MouseEvent;
    }) => void;
    onCheck?: (checked: {
        checked: Key[];
        halfChecked: Key[];
    } | Key[], info: CheckInfo) => void;
    onSelect?: (selectedKeys: Key[], info: {
        event: 'select';
        selected: boolean;
        node: EventDataNode;
        selectedNodes: DataNode[];
        nativeEvent: MouseEvent;
    }) => void;
    onLoad?: (loadedKeys: Key[], info: {
        event: 'load';
        node: EventDataNode;
    }) => void;
    loadData?: (treeNode: EventDataNode) => Promise<void>;
    loadedKeys?: Key[];
    onMouseEnter?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
    }) => void;
    onMouseLeave?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
    }) => void;
    onRightClick?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
    }) => void;
    onDragStart?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
    }) => void;
    onDragEnter?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
        expandedKeys: Key[];
    }) => void;
    onDragOver?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
    }) => void;
    onDragLeave?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
    }) => void;
    onDragEnd?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
    }) => void;
    onDrop?: (info: {
        event: React.MouseEvent;
        node: EventDataNode;
        dragNode: EventDataNode;
        dragNodesKeys: Key[];
        dropPosition: number;
        dropToGap: boolean;
    }) => void;
    /**
     * Used for `rc-tree-select` only.
     * Do not use in your production code directly since this will be refactor.
     */
    onActiveChange?: (key: Key) => void;
    filterTreeNode?: (treeNode: EventDataNode) => boolean;
    motion?: any;
    switcherIcon?: IconType;
    height?: number;
    itemHeight?: number;
    virtual?: boolean;
}
interface TreeState {
    keyEntities: Record<Key, DataEntity>;
    selectedKeys: Key[];
    checkedKeys: Key[];
    halfCheckedKeys: Key[];
    loadedKeys: Key[];
    loadingKeys: Key[];
    expandedKeys: Key[];
    dragging: boolean;
    dragNodesKeys: Key[];
    dragOverNodeKey: Key;
    dropPosition: number;
    treeData: DataNode[];
    flattenNodes: FlattenNode[];
    focused: boolean;
    activeKey: Key;
    listChanging: boolean;
    prevProps: TreeProps;
}
declare class Tree extends React.Component<TreeProps, TreeState> {
    static defaultProps: {
        prefixCls: string;
        showLine: boolean;
        showIcon: boolean;
        selectable: boolean;
        multiple: boolean;
        checkable: boolean;
        disabled: boolean;
        checkStrictly: boolean;
        draggable: boolean;
        defaultExpandParent: boolean;
        autoExpandParent: boolean;
        defaultExpandAll: boolean;
        defaultExpandedKeys: any[];
        defaultCheckedKeys: any[];
        defaultSelectedKeys: any[];
    };
    static TreeNode: React.FC<import("./TreeNode").TreeNodeProps>;
    delayedDragEnterLogic: Record<Key, number>;
    state: TreeState;
    dragNode: NodeInstance;
    listRef: React.RefObject<NodeListRef>;
    static getDerivedStateFromProps(props: TreeProps, prevState: TreeState): Partial<TreeState>;
    onNodeDragStart: (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => void;
    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    onNodeDragEnter: (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => void;
    onNodeDragOver: (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => void;
    onNodeDragLeave: (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => void;
    onNodeDragEnd: (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => void;
    onNodeDrop: (event: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => void;
    cleanDragState: () => void;
    onNodeClick: (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => void;
    onNodeDoubleClick: (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => void;
    onNodeSelect: (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => void;
    onNodeCheck: (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode, checked: boolean) => void;
    onNodeLoad: (treeNode: EventDataNode) => Promise<unknown>;
    onNodeMouseEnter: (event: React.MouseEvent<HTMLDivElement>, node: EventDataNode) => void;
    onNodeMouseLeave: (event: React.MouseEvent<HTMLDivElement>, node: EventDataNode) => void;
    onNodeContextMenu: (event: React.MouseEvent<HTMLDivElement>, node: EventDataNode) => void;
    onFocus: React.FocusEventHandler<HTMLDivElement>;
    onBlur: React.FocusEventHandler<HTMLDivElement>;
    getTreeNodeRequiredProps: () => {
        expandedKeys: (string | number)[];
        selectedKeys: (string | number)[];
        loadedKeys: (string | number)[];
        loadingKeys: (string | number)[];
        checkedKeys: (string | number)[];
        halfCheckedKeys: (string | number)[];
        dragOverNodeKey: string | number;
        dropPosition: number;
        keyEntities: Record<string | number, DataEntity>;
    };
    /** Set uncontrolled `expandedKeys`. This will also auto update `flattenNodes`. */
    setExpandedKeys: (expandedKeys: Key[]) => void;
    onNodeExpand: (e: React.MouseEvent<HTMLDivElement>, treeNode: EventDataNode) => void;
    onListChangeStart: () => void;
    onListChangeEnd: () => void;
    onActiveChange: (newActiveKey: Key) => void;
    getActiveItem: () => FlattenNode;
    offsetActiveKey: (offset: number) => void;
    onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
    /**
     * Only update the value which is not in props
     */
    setUncontrolledState: (state: Partial<TreeState>, atomic?: boolean, forceState?: Partial<TreeState> | null) => void;
    scrollTo: ScrollTo;
    render(): JSX.Element;
}
export default Tree;
