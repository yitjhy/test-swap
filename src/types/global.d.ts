type GetPromiseType<T> = T extends Promise<infer R> ? R : any
