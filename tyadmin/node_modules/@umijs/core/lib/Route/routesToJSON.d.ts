import { IRoute } from './types';
interface IOpts {
    routes: IRoute[];
    config: any;
    cwd?: string;
}
export default function ({ routes, config, cwd }: IOpts): string;
export {};
