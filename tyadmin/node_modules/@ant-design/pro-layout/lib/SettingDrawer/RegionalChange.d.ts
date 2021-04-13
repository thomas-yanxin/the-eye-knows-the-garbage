import React from 'react';
import { ProSettings } from '../defaultSettings';
declare const RegionalSetting: React.FC<{
    settings: Partial<ProSettings>;
    changeSetting: (key: string, value: any, hideLoading?: boolean) => void;
}>;
export default RegionalSetting;
