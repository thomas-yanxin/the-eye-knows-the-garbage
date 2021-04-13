import { View } from '../view';
export interface Options {
    width?: number;
    height?: number;
}
declare function HexJSONConnector(data: any[], options: Options, dataView: View): any;
export default HexJSONConnector;
