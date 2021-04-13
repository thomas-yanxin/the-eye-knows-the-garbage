import * as React from 'react';
import { DisabledTimes, PanelMode, RangeValue, EventValue } from './interface';
import { PickerBaseProps, PickerDateProps, PickerTimeProps, PickerRefConfig } from './Picker';
import { SharedTimeProps } from './panels/TimePanel';
export declare type RangeType = 'start' | 'end';
export interface RangeInfo {
    range: RangeType;
}
export declare type RangeDateRender<DateType> = (currentDate: DateType, today: DateType, info: RangeInfo) => React.ReactNode;
export interface RangePickerSharedProps<DateType> {
    id?: string;
    value?: RangeValue<DateType>;
    defaultValue?: RangeValue<DateType>;
    defaultPickerValue?: [DateType, DateType];
    placeholder?: [string, string];
    disabled?: boolean | [boolean, boolean];
    disabledTime?: (date: EventValue<DateType>, type: RangeType) => DisabledTimes;
    ranges?: Record<string, Exclude<RangeValue<DateType>, null> | (() => Exclude<RangeValue<DateType>, null>)>;
    separator?: React.ReactNode;
    allowEmpty?: [boolean, boolean];
    mode?: [PanelMode, PanelMode];
    onChange?: (values: RangeValue<DateType>, formatString: [string, string]) => void;
    onCalendarChange?: (values: RangeValue<DateType>, formatString: [string, string], info: RangeInfo) => void;
    onPanelChange?: (values: RangeValue<DateType>, modes: [PanelMode, PanelMode]) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onOk?: (dates: RangeValue<DateType>) => void;
    direction?: 'ltr' | 'rtl';
    autoComplete?: string;
    /** @private Internal control of active picker. Do not use since it's private usage */
    activePickerIndex?: 0 | 1;
    dateRender?: RangeDateRender<DateType>;
    panelRender?: (originPanel: React.ReactNode) => React.ReactNode;
}
declare type OmitPickerProps<Props> = Omit<Props, 'value' | 'defaultValue' | 'defaultPickerValue' | 'placeholder' | 'disabled' | 'disabledTime' | 'showToday' | 'showTime' | 'mode' | 'onChange' | 'onSelect' | 'onPanelChange' | 'pickerValue' | 'onPickerValueChange' | 'onOk' | 'dateRender'>;
declare type RangeShowTimeObject<DateType> = Omit<SharedTimeProps<DateType>, 'defaultValue'> & {
    defaultValue?: DateType[];
};
export interface RangePickerBaseProps<DateType> extends RangePickerSharedProps<DateType>, OmitPickerProps<PickerBaseProps<DateType>> {
}
export interface RangePickerDateProps<DateType> extends RangePickerSharedProps<DateType>, OmitPickerProps<PickerDateProps<DateType>> {
    showTime?: boolean | RangeShowTimeObject<DateType>;
}
export interface RangePickerTimeProps<DateType> extends RangePickerSharedProps<DateType>, OmitPickerProps<PickerTimeProps<DateType>> {
    order?: boolean;
}
export declare type RangePickerProps<DateType> = RangePickerBaseProps<DateType> | RangePickerDateProps<DateType> | RangePickerTimeProps<DateType>;
declare class RangePicker<DateType> extends React.Component<RangePickerProps<DateType>> {
    pickerRef: React.RefObject<PickerRefConfig>;
    focus: () => void;
    blur: () => void;
    render(): JSX.Element;
}
export default RangePicker;
