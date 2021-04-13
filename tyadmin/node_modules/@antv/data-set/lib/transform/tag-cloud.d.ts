export interface Options {
    fields?: [string, string];
    font?(): string;
    fontSize?: number;
    rotate?: number;
    padding?: number;
    size?: [number, number];
    spiral?: 'archimedean' | 'archimedean' | 'rectangular';
    timeInterval?: number;
    imageMask?: HTMLImageElement;
}
