import * as React from 'react';
import { RawValueType, FlattenOptionsType, Key } from '../interface/generator';
export default function useCacheOptions<OptionsType extends {
    value?: RawValueType;
    label?: React.ReactNode;
    key?: Key;
    disabled?: boolean;
}[]>(values: RawValueType[], options: FlattenOptionsType<OptionsType>): (vals: RawValueType[]) => FlattenOptionsType<OptionsType>;
