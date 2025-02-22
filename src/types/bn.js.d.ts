declare module 'bn.js' {
  export class BN {
    constructor(number: number | string | number[] | Uint8Array | Buffer | BN, base?: number | 'hex', endian?: string)
    toString(base?: number | 'hex', length?: number): string
    toNumber(): number
    toArray(endian?: string, length?: number): number[]
    toBuffer(endian?: string, length?: number): Buffer
    bitLength(): number
    zeroBits(): number
    byteLength(): number
    isNeg(): boolean
    isEven(): boolean
    isOdd(): boolean
    isZero(): boolean
    cmp(b: BN): number
    lt(b: BN): boolean
    lte(b: BN): boolean
    gt(b: BN): boolean
    gte(b: BN): boolean
    eq(b: BN): boolean
    isBN(b: any): b is BN
  }
  export default BN
}
