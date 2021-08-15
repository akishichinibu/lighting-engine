import crypto from 'crypto';

const charset = "0123456789abcdef";


export const calcHash = (s: string) => {
  const md5sum = crypto.createHash('md5');
  const hash = md5sum.update(s).digest("base64");
  return hash;
}


export function randomHex(size: number) {
  const result = new Array(size);
  for (let i = 0; i < size; i++) result[i] = charset[Math.round(Math.random() * 16)];
  return result.join('');
}
