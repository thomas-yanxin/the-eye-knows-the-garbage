/**
 * Cannot do Math.log(x) / Math.log(10) bc if IEEE floating point issue
 * @param x number
 */
export function getMagnitude(x) {
    // Cannot count string length via Number.toString because it may use scientific notation
    // for very small or very large numbers.
    return Math.floor(Math.log(x) * Math.LOG10E);
}
// TODO: dedup with intl-pluralrules
// https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-torawfixed
export function toRawFixed(x, minFraction, maxFraction) {
    var f = maxFraction;
    var n;
    {
        var exactSolve = x * Math.pow(10, f);
        var roundDown = Math.floor(exactSolve);
        var roundUp = Math.ceil(exactSolve);
        n = exactSolve - roundDown < roundUp - exactSolve ? roundDown : roundUp;
    }
    var xFinal = n / Math.pow(10, f);
    // n is a positive integer, but it is possible to be greater than 1e21.
    // In such case we will go the slow path.
    // See also: https://tc39.es/ecma262/#sec-numeric-types-number-tostring
    var m;
    if (n < 1e21) {
        m = n.toString();
    }
    else {
        m = n.toString();
        var idx1 = m.indexOf('.');
        var idx2 = m.indexOf('e+');
        var exponent = parseInt(m.substring(idx2 + 2), 10);
        m =
            m.substring(0, idx1) +
                m.substring(idx1 + 1, idx2) +
                repeat('0', exponent - (idx2 - idx1 - 1));
    }
    var int;
    if (f !== 0) {
        var k = m.length;
        if (k <= f) {
            var z = repeat('0', f + 1 - k);
            m = z + m;
            k = f + 1;
        }
        var a = m.slice(0, k - f);
        var b = m.slice(k - f);
        m = a + "." + b;
        int = a.length;
    }
    else {
        int = m.length;
    }
    var cut = maxFraction - minFraction;
    while (cut > 0 && m[m.length - 1] === '0') {
        m = m.slice(0, -1);
        cut--;
    }
    if (m[m.length - 1] === '.') {
        m = m.slice(0, -1);
    }
    return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
}
// https://tc39.es/proposal-unified-intl-numberformat/section11/numberformat_proposed_out.html#sec-torawprecision
export function toRawPrecision(x, minPrecision, maxPrecision) {
    var p = maxPrecision;
    var m;
    var e;
    var xFinal;
    if (x === 0) {
        m = repeat('0', p);
        e = 0;
        xFinal = 0;
    }
    else {
        e = getMagnitude(x);
        var n = void 0;
        {
            var magnitude = e - p + 1;
            var exactSolve = 
            // Preserve floating point precision as much as possible with multiplication.
            magnitude < 0 ? x * Math.pow(10, -magnitude) : x / Math.pow(10, magnitude);
            var roundDown = Math.floor(exactSolve);
            var roundUp = Math.ceil(exactSolve);
            n = exactSolve - roundDown < roundUp - exactSolve ? roundDown : roundUp;
        }
        // See: https://tc39.es/ecma262/#sec-numeric-types-number-tostring
        // No need to worry about scientific notation because it only happens for values >= 1e21,
        // which has 22 significant digits. So it will at least be divided by 10 here to bring the
        // value back into non-scientific-notation range.
        m = n.toString();
        xFinal = n * Math.pow(10, (e - p + 1));
    }
    var int;
    if (e >= p - 1) {
        m = m + repeat('0', e - p + 1);
        int = e + 1;
    }
    else if (e >= 0) {
        m = m.slice(0, e + 1) + "." + m.slice(e + 1);
        int = e + 1;
    }
    else {
        m = "0." + repeat('0', -e - 1) + m;
        int = 1;
    }
    if (m.indexOf('.') >= 0 && maxPrecision > minPrecision) {
        var cut = maxPrecision - minPrecision;
        while (cut > 0 && m[m.length - 1] === '0') {
            m = m.slice(0, -1);
            cut--;
        }
        if (m[m.length - 1] === '.') {
            m = m.slice(0, -1);
        }
    }
    return { formattedString: m, roundedNumber: xFinal, integerDigitsCount: int };
}
export function repeat(s, times) {
    if (typeof s.repeat === 'function') {
        return s.repeat(times);
    }
    var arr = new Array(times);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = s;
    }
    return arr.join('');
}
//# sourceMappingURL=utils.js.map