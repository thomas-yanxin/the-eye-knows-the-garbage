declare type Timer = ReturnType<typeof setTimeout>;
export declare type CachedKeyType = string | number;
export declare type cachedData = {
    data: any;
    timer: Timer | undefined;
    startTime: number;
};
declare const setCache: (key: CachedKeyType, cacheTime: number, data: any) => void;
declare const getCache: (key: CachedKeyType) => {
    data: any;
    startTime: number | undefined;
};
export { getCache, setCache };
