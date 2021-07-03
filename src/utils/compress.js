import LZUTF8 from 'lzutf8';
const COMPRESS_ENCODING = 'Base64';

export const compress = (s) => s && LZUTF8.compress(s, {outputEncoding: COMPRESS_ENCODING});
export const decompress = (s) => s && LZUTF8.decompress(s, {inputEncoding: COMPRESS_ENCODING});