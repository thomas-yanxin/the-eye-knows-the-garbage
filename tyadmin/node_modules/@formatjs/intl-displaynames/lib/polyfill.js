import { DisplayNames } from '.';
if (!Intl.DisplayNames) {
    Object.defineProperty(Intl, 'DisplayNames', {
        value: DisplayNames,
        enumerable: false,
        writable: true,
        configurable: true,
    });
}
//# sourceMappingURL=polyfill.js.map