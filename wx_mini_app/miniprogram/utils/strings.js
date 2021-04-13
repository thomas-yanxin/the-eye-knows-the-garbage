
var kEscapedMap = {
    '!': '%21',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A'
};

exports.normalize = function (string, encodingSlash) {
    var result = encodeURIComponent(string);
    result = result.replace(/[!'\(\)\*]/g, function ($1) {
        return kEscapedMap[$1];
    });

    if (encodingSlash === false) {
        result = result.replace(/%2F/gi, '/');
    }

    return result;
};

exports.trim = function (string) {
    return (string || '').replace(/^\s+|\s+$/g, '');
};

