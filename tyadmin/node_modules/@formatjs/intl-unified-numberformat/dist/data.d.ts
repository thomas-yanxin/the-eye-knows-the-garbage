import { UnitData, CurrencyData, RawNumberData, DecimalFormatNum, NumberILD, InternalSlotToken, SignDisplayPattern, CurrencyPattern, NumberLocalePatternData, SignPattern, NotationPattern, CurrencySignPattern, CompactSignPattern } from '@formatjs/intl-utils';
export declare function extractILD(units: Record<string, UnitData>, currencies: Record<string, CurrencyData>, numbers: RawNumberData, numberingSystem: string): NumberILD;
export declare class Patterns implements NumberLocalePatternData {
    private units;
    private currencies;
    private numbers;
    private numberingSystem;
    private decimalPatterns?;
    private percentPatterns?;
    private unitPatterns?;
    private currencyPatterns?;
    private _unit?;
    private _currency?;
    private currencySign?;
    constructor(units: Record<string, UnitData>, currencies: Record<string, CurrencyData>, numbers: RawNumberData, numberingSystem: string, unit?: string, currency?: string, currencySign?: keyof CurrencySignPattern);
    get decimal(): DecimalPatterns;
    get percent(): PercentPatterns;
    get unit(): Record<string, UnitPatterns>;
    get currency(): Record<string, CurrencyPatterns>;
}
declare abstract class NotationPatterns implements CompactSignPattern {
    protected decimalNum?: DecimalFormatNum;
    protected notation?: 'compactShort' | 'compactLong';
    abstract produceCompactSignPattern(decimalNum: DecimalFormatNum): SignPattern;
    get compactShort(): Record<DecimalFormatNum, SignPattern>;
    get compactLong(): Record<DecimalFormatNum, SignPattern>;
    get '1000'(): SignPattern;
    get '10000'(): SignPattern;
    get '100000'(): SignPattern;
    get '1000000'(): SignPattern;
    get '10000000'(): SignPattern;
    get '100000000'(): SignPattern;
    get '1000000000'(): SignPattern;
    get '10000000000'(): SignPattern;
    get '100000000000'(): SignPattern;
    get '1000000000000'(): SignPattern;
    get '10000000000000'(): SignPattern;
    get '100000000000000'(): SignPattern;
}
declare class DecimalPatterns extends NotationPatterns implements SignDisplayPattern, NotationPattern {
    protected signPattern?: SignPattern;
    protected compactSignPattern?: CompactSignPattern;
    protected signDisplay?: keyof SignDisplayPattern;
    protected numbers: RawNumberData;
    protected numberingSystem: string;
    constructor(numbers: RawNumberData, numberingSystem: string);
    produceCompactSignPattern(decimalNum: DecimalFormatNum): SignPattern;
    get always(): NotationPattern;
    get auto(): NotationPattern;
    get never(): NotationPattern;
    get exceptZero(): NotationPattern;
    get standard(): SignPattern;
    get scientific(): SignPattern;
}
declare class PercentPatterns extends DecimalPatterns implements SignDisplayPattern, NotationPattern {
    private generateStandardOrScientificPattern;
    get standard(): SignPattern;
    get scientific(): SignPattern;
}
declare class UnitPatterns extends NotationPatterns implements SignDisplayPattern, NotationPattern {
    private pattern?;
    private signPattern?;
    private compactSignPattern?;
    private unit;
    private units;
    private numbers;
    private numberingSystem;
    private signDisplay?;
    constructor(units: Record<string, UnitData>, numbers: RawNumberData, numberingSystem: string, unit: string);
    private generateStandardOrScientificPattern;
    produceCompactSignPattern(decimalNum: DecimalFormatNum): SignPattern;
    get narrow(): this;
    get short(): this;
    get long(): this;
    get always(): NotationPattern;
    get auto(): NotationPattern;
    get never(): NotationPattern;
    get exceptZero(): NotationPattern;
    get standard(): SignPattern;
    get scientific(): SignPattern;
}
declare class CurrencyPatterns implements CurrencyPattern, CurrencySignPattern {
    private currency;
    private numbers;
    private numberingSystem;
    private currencies;
    private currencySign;
    private signDisplayPatterns?;
    private currencySlotToken?;
    private resolvedCurrency?;
    constructor(currencies: Record<string, CurrencyData>, numbers: RawNumberData, numberingSystem: string, currency: string, currencySign: keyof CurrencySignPattern);
    get code(): this;
    get symbol(): this;
    get narrowSymbol(): this;
    get name(): this;
    get accounting(): CurrencySignDisplayPatterns;
    get standard(): CurrencySignDisplayPatterns;
}
declare class CurrencySignDisplayPatterns extends NotationPatterns implements SignDisplayPattern, NotationPattern {
    private signDisplay?;
    private currencySign?;
    private currencySlotToken;
    private currency;
    private numbers;
    private numberingSystem;
    private signPattern?;
    private compactSignPattern?;
    constructor(resolvedCurrency: string, numbers: RawNumberData, numberingSystem: string, currencySign: keyof CurrencySignPattern, currencySlotToken: InternalSlotToken);
    get always(): NotationPattern;
    get auto(): NotationPattern;
    get never(): NotationPattern;
    get exceptZero(): NotationPattern;
    get standard(): SignPattern;
    get scientific(): SignPattern;
    produceCompactSignPattern(decimalNum: DecimalFormatNum): SignPattern;
}
export {};
//# sourceMappingURL=data.d.ts.map