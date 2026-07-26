declare module 'bcryptjs' {
  export function hash(data: string, salt: number | string): Promise<string>;
}
