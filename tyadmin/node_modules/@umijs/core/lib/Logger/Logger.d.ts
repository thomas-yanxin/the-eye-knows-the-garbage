import Common from './Common';
export default class Logger extends Common {
    protected LOG: string;
    protected INFO: string;
    protected WARN: string;
    protected ERROR: string;
    protected PROFILE: string;
    private isUmiError;
    /**
     *
     * @param e only print UmiError
     * @param opts
     */
    private printUmiError;
    log(...args: any): void;
    /**
     * The {@link logger.info} function is an alias for {@link logger.log()}.
     * @param args
     */
    info(...args: any): void;
    error(...args: any): void;
    warn(...args: any): void;
    profile(id: string, message?: string): string;
}
