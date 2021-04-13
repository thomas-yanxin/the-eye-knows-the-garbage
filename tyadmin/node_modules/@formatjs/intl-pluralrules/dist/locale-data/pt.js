/* @generated */
// prettier-ignore
if (Intl.PluralRules && typeof Intl.PluralRules.__addLocaleData === 'function') {
  Intl.PluralRules.__addLocaleData({"data":{"pt":{"categories":{"cardinal":["one","other"],"ordinal":["other"]},"fn":function(n, ord) {
  var s = String(n).split('.'), i = s[0];
  if (ord) return 'other';
  return (i == 0 || i == 1) ? 'one' : 'other';
}}},"aliases":{},"parentLocales":{"pt-AO":"pt-PT","pt-CH":"pt-PT","pt-CV":"pt-PT","pt-FR":"pt-PT","pt-GQ":"pt-PT","pt-GW":"pt-PT","pt-LU":"pt-PT","pt-MO":"pt-PT","pt-MZ":"pt-PT","pt-ST":"pt-PT","pt-TL":"pt-PT"},"availableLocales":["pt"]})
}
