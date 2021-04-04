import LZUTF8 from 'lzutf8';

const COMPRESS_ENCODING = 'Base64';

export function compress(s) {
    return s && LZUTF8.compress(s, {outputEncoding: COMPRESS_ENCODING});
}

export function decompress(s) {
    return s && LZUTF8.decompress(s, {inputEncoding: COMPRESS_ENCODING});
}