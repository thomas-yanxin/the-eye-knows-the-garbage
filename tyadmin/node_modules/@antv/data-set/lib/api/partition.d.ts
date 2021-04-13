export interface PartitionApi {
    partition(group_by: string | string[] | ((item: any) => string), order_by?: string | string[] | ((item: any) => number)): any;
    group(group_by: string | string[] | ((item: any) => string), order_by?: string | string[] | ((item: any) => number)): any;
    groups(group_by: string | string[] | ((item: any) => string), order_by?: string | string[] | ((item: any) => number)): any;
}
