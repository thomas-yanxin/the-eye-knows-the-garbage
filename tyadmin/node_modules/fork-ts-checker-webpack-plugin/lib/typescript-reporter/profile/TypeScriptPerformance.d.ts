import { Performance } from '../../profile/Performance';
interface TypeScriptPerformance {
    enable(): void;
    disable(): void;
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
}
declare function connectTypeScriptPerformance(performance: Performance): Performance;
export { TypeScriptPerformance, connectTypeScriptPerformance };
