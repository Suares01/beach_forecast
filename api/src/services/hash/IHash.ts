export interface IHash {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
