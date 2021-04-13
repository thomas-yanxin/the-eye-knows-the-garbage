import * as React from 'react';
import { FormatRelativeTimeOptions } from '../types';
import { Unit } from '@formatjs/intl-relativetimeformat';
export interface Props extends FormatRelativeTimeOptions {
    value?: number;
    unit?: Unit;
    updateIntervalInSeconds?: number;
    children?(value: string): React.ReactChild;
}
interface State {
    prevUnit?: Unit;
    prevValue?: number;
    currentValueInSeconds: number;
}
export declare class FormattedRelativeTime extends React.PureComponent<Props, State> {
    _updateTimer: any;
    static displayName: string;
    static defaultProps: Pick<Props, 'unit' | 'value'>;
    state: State;
    constructor(props: Props);
    scheduleNextUpdate({ updateIntervalInSeconds, unit }: Props, { currentValueInSeconds }: State): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null;
    render(): JSX.Element;
}
export default FormattedRelativeTime;
