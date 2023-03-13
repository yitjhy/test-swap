export type GetParamType<T> = T extends (...args: infer R) => any ? R : any
