import { IRoute } from './types';
import { IConfig } from '..';
interface IOpts {
    root: string;
    relDir?: string;
    componentPrefix?: string;
    config: IConfig;
}
export default function getRoutes(opts: IOpts): IRoute[];
export {};
