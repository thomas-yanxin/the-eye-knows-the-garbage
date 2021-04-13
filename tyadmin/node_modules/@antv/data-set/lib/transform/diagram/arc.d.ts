export interface Options {
    y?: number;
    thickness?: number;
    weight?: boolean;
    marginRatio?: number;
    id?(node: any): any;
    source?(edge: any): any;
    target?(edge: any): any;
    sourceWeight?(edge: any): number;
    targetWeight?(edge: any): number;
    sortBy?: 'id' | 'weigth' | 'frequency' | null | ((a: any, b: any) => number);
}
