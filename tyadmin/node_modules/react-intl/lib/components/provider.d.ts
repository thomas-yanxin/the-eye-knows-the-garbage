import * as React from 'react';
import { DEFAULT_INTL_CONFIG } from '../utils';
import { IntlConfig, IntlShape, Omit, IntlCache } from '../types';
interface State {
    /**
     * Explicit intl cache to prevent memory leaks
     */
    cache: IntlCache;
    /**
     * Intl object we created
     */
    intl?: IntlShape;
    /**
     * list of memoized config we care about.
     * This is important since creating intl is
     * very expensive
     */
    prevConfig: OptionalIntlConfig;
}
export declare type OptionalIntlConfig = Omit<IntlConfig, keyof typeof DEFAULT_INTL_CONFIG> & Partial<typeof DEFAULT_INTL_CONFIG>;
/**
 * Create intl object
 * @param config intl config
 * @param cache cache for formatter instances to prevent memory leak
 */
export declare function createIntl(config: OptionalIntlConfig, cache?: IntlCache): IntlShape;
export default class IntlProvider extends React.PureComponent<OptionalIntlConfig, State> {
    static displayName: string;
    static defaultProps: Pick<IntlConfig, "formats" | "messages" | "timeZone" | "textComponent" | "defaultLocale" | "defaultFormats" | "onError">;
    private cache;
    state: State;
    static getDerivedStateFromProps(props: OptionalIntlConfig, { prevConfig, cache }: State): Partial<State> | null;
    render(): JSX.Element;
}
export {};
