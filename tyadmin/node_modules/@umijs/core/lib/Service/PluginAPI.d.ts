import * as utils from '@umijs/utils';
import Logger from '../Logger/Logger';
import Service from './Service';
import { EnableBy } from './enums';
import { ICommand, IHook, IPlugin, IPluginConfig, IPreset } from './types';
import Html from '../Html/Html';
interface IOpts {
    id: string;
    key: string;
    service: Service;
}
export default class PluginAPI {
    id: string;
    key: string;
    service: Service;
    Html: typeof Html;
    utils: typeof utils;
    logger: Logger;
    constructor(opts: IOpts);
    describe({ id, key, config, enableBy, }?: {
        id?: string;
        key?: string;
        config?: IPluginConfig;
        enableBy?: EnableBy | (() => boolean);
    }): void;
    register(hook: IHook): void;
    registerCommand(command: ICommand): void;
    registerPresets(presets: (IPreset | string)[]): void;
    registerPlugins(plugins: (IPlugin | string)[]): void;
    registerMethod({ name, fn, exitsError, }: {
        name: string;
        fn?: Function;
        exitsError?: boolean;
    }): void;
    skipPlugins(pluginIds: string[]): void;
}
export {};
