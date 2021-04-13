/// <reference types="react" />
import { FormInstance as RcFormInstance } from 'rc-field-form';
import { ScrollOptions, NamePath, InternalNamePath } from '../interface';
export interface FormInstance extends RcFormInstance {
    scrollToField: (name: NamePath, options?: ScrollOptions) => void;
    /** This is an internal usage. Do not use in your prod */
    __INTERNAL__: {
        /** No! Do not use this in your code! */
        name?: string;
        /** No! Do not use this in your code! */
        itemRef: (name: InternalNamePath) => (node: React.ReactElement) => void;
    };
    getFieldInstance: (name: NamePath) => any;
}
export default function useForm(form?: FormInstance): [FormInstance];
