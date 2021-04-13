"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * IE11-safe version of getCanonicalLocales since it's ES2016
 * @param locales locales
 */
function getCanonicalLocales(locales) {
    // IE11
    var getCanonicalLocales = Intl.getCanonicalLocales;
    if (typeof getCanonicalLocales === 'function') {
        return getCanonicalLocales(locales);
    }
    // NOTE: we must NOT call `supportedLocalesOf` of a formatjs polyfill, or their implementation
    // will even eventually call this method recursively. Here we use `Intl.DateTimeFormat` since it
    // is not polyfilled by `@formatjs`.
    // TODO: Fix TypeScript type def for this bc undefined is just fine
    return Intl.DateTimeFormat.supportedLocalesOf(locales);
}
exports.getCanonicalLocales = getCanonicalLocales;
//# sourceMappingURL=get-canonical-locales.js.map