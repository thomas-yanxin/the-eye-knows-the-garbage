/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
import * as React from 'react';
import { Context } from './injectIntl';
import { invariantIntlContext } from '../utils';
import { invariant } from '@formatjs/intl-utils';
const MINUTE = 60;
const HOUR = 60 * 60;
const DAY = 60 * 60 * 24;
function selectUnit(seconds) {
    const absValue = Math.abs(seconds);
    if (absValue < MINUTE) {
        return 'second';
    }
    if (absValue < HOUR) {
        return 'minute';
    }
    if (absValue < DAY) {
        return 'hour';
    }
    return 'day';
}
function getDurationInSeconds(unit) {
    switch (unit) {
        case 'second':
            return 1;
        case 'minute':
            return MINUTE;
        case 'hour':
            return HOUR;
        default:
            return DAY;
    }
}
function valueToSeconds(value, unit) {
    if (!value) {
        return 0;
    }
    switch (unit) {
        case 'second':
            return value;
        case 'minute':
            return value * MINUTE;
        default:
            return value * HOUR;
    }
}
const INCREMENTABLE_UNITS = ['second', 'minute', 'hour'];
function canIncrement(unit = 'second') {
    return INCREMENTABLE_UNITS.includes(unit);
}
export class FormattedRelativeTime extends React.PureComponent {
    constructor(props) {
        super(props);
        // Public for testing
        this._updateTimer = null;
        this.state = {
            prevUnit: this.props.unit,
            prevValue: this.props.value,
            currentValueInSeconds: canIncrement(this.props.unit)
                ? valueToSeconds(this.props.value, this.props.unit)
                : 0,
        };
        invariant(!props.updateIntervalInSeconds ||
            !!(props.updateIntervalInSeconds && canIncrement(props.unit)), 'Cannot schedule update with unit longer than hour');
    }
    scheduleNextUpdate({ updateIntervalInSeconds, unit }, { currentValueInSeconds }) {
        clearTimeout(this._updateTimer);
        this._updateTimer = null;
        // If there's no interval and we cannot increment this unit, do nothing
        if (!updateIntervalInSeconds || !canIncrement(unit)) {
            return;
        }
        // Figure out the next interesting time
        const nextValueInSeconds = currentValueInSeconds - updateIntervalInSeconds;
        const nextUnit = selectUnit(nextValueInSeconds);
        // We've reached the max auto incrementable unit, don't schedule another update
        if (nextUnit === 'day') {
            return;
        }
        const unitDuration = getDurationInSeconds(nextUnit);
        const remainder = nextValueInSeconds % unitDuration;
        const prevInterestingValueInSeconds = nextValueInSeconds - remainder;
        const nextInterestingValueInSeconds = prevInterestingValueInSeconds >= currentValueInSeconds
            ? prevInterestingValueInSeconds - unitDuration
            : prevInterestingValueInSeconds;
        const delayInSeconds = Math.abs(nextInterestingValueInSeconds - currentValueInSeconds);
        this._updateTimer = setTimeout(() => this.setState({
            currentValueInSeconds: nextInterestingValueInSeconds,
        }), delayInSeconds * 1e3);
    }
    componentDidMount() {
        this.scheduleNextUpdate(this.props, this.state);
    }
    componentDidUpdate() {
        this.scheduleNextUpdate(this.props, this.state);
    }
    componentWillUnmount() {
        clearTimeout(this._updateTimer);
        this._updateTimer = null;
    }
    static getDerivedStateFromProps(props, state) {
        if (props.unit !== state.prevUnit || props.value !== state.prevValue) {
            return {
                prevValue: props.value,
                prevUnit: props.unit,
                currentValueInSeconds: canIncrement(props.unit)
                    ? valueToSeconds(props.value, props.unit)
                    : 0,
            };
        }
        return null;
    }
    render() {
        return (React.createElement(Context.Consumer, null, (intl) => {
            invariantIntlContext(intl);
            const { formatRelativeTime, textComponent: Text } = intl;
            const { children, value, unit, updateIntervalInSeconds } = this.props;
            const { currentValueInSeconds } = this.state;
            let currentValue = value || 0;
            let currentUnit = unit;
            if (canIncrement(unit) &&
                typeof currentValueInSeconds === 'number' &&
                updateIntervalInSeconds) {
                currentUnit = selectUnit(currentValueInSeconds);
                const unitDuration = getDurationInSeconds(currentUnit);
                currentValue = Math.round(currentValueInSeconds / unitDuration);
            }
            const formattedRelativeTime = formatRelativeTime(currentValue, currentUnit, Object.assign({}, this.props));
            if (typeof children === 'function') {
                return children(formattedRelativeTime);
            }
            if (Text) {
                return React.createElement(Text, null, formattedRelativeTime);
            }
            return formattedRelativeTime;
        }));
    }
}
FormattedRelativeTime.displayName = 'FormattedRelativeTime';
FormattedRelativeTime.defaultProps = {
    value: 0,
    unit: 'second',
};
export default FormattedRelativeTime;
