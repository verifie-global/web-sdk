var arrayBufferDataUri = function(raw) {
    "use strict";
    var base64 = '',
        encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        bytes = new Uint8Array(raw),
        byteLength = bytes.byteLength,
        byteRemainder = byteLength % 3,
        mainLength = byteLength - byteRemainder,
        a, b, c, d, chunk;
    for (var i = 0; i < mainLength; i = i + 3) {
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        a = (chunk & 16515072) >> 18;
        b = (chunk & 258048) >> 12;
        c = (chunk & 4032) >> 6;
        d = chunk & 63;
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    if (byteRemainder == 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2;
        b = (chunk & 3) << 4;
        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10;
        b = (chunk & 1008) >> 4;
        c = (chunk & 15) << 2;
        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }
    return base64;
};
var container = null,
    embeddata = null;
var iv = [];
var j = new jsImage();
var handleContainerSelect = function(evt) {
    "use strict";
    container = null;
    var files = evt.target.files;
    if (files[0] && files[0].type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                container = e.target.result;
            };
        })(files[0]);
        reader.readAsArrayBuffer(files[0]);
    } else {
        alert('Please select image!');
    }
};
var handleDataSelect = function(evt) {
    "use strict";
    embeddata = null;
    var files = evt.target.files;
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {
            embeddata = e.target.result;
        };
    })(files[0]);
    reader.readAsArrayBuffer(files[0]);
};
var doEmbed = function(imageData, secretData) {
    if (iv.length == 0) {
        var buffer = new ArrayBuffer(256);
        var int32View = new Int32Array(buffer);
        var Uint8View = new Uint8Array(buffer);
        var key_from_pass = sjcl.misc.pbkdf2("1234", "1234", 1000, 256 * 8);
        int32View.set(key_from_pass);
        for (var i = 0; i < 256; i++) {
            iv[i] = Uint8View[i];
        }
    }
    var time_start = new Date().getTime();
    try {
        j.parse(imageData);
    } catch (e) {
        alert(e);
        return false;
    }
    var duration = new Date().getTime() - time_start;
    j.f5embed(secretData, iv);
    var time_start = new Date().getTime();
    var pck = j.pack();
    var duration = new Date().getTime() - time_start;
    return arrayBufferDataUri(pck)
};
