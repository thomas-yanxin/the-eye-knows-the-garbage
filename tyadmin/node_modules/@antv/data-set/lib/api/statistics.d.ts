export interface StatisticsApi {
    max(column: string): number;
    mean(column: string): number;
    median(column: string): number;
    min(column: string): number;
    mode(column: string): number;
    product(column: string): number;
    standardDeviation(column: string): number;
    sum(column: string): number;
    sumSimple(column: string): number;
    variance(column: string): number;
    average(column: string): number;
    extent(column: string): number;
    range(column: string): [number, number];
    quantilesByFraction(column: string, fraction: number): number;
    quantiles(column: string, percents: number[]): number[];
    quantile(column: string, percent: number): number;
}
