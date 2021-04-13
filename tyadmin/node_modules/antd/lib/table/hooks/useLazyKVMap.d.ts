import { Key, GetRowKey } from '../interface';
export default function useLazyKVMap<RecordType>(data: RecordType[], childrenColumnName: string, getRowKey: GetRowKey<RecordType>): ((key: Key) => RecordType)[];
