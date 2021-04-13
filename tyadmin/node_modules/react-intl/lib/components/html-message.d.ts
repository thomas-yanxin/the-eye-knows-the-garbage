import { PrimitiveType } from 'intl-messageformat';
import FormattedMessage from './message';
declare class FormattedHTMLMessage extends FormattedMessage<Record<string, PrimitiveType>> {
    static displayName: string;
    static defaultProps: {
        tagName: "span";
        values: {};
    };
    render(): JSX.Element;
}
export default FormattedHTMLMessage;
