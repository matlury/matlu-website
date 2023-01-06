export const notNull = <T extends unknown>(o: T | null): o is T => o !== null

export const ascendingBy =
    <T extends { [key in K]: number | bigint }, K extends keyof T>(key: K) =>
    (a: T, b: T) =>
        a[key] - b[key]

export const omit =
    <T extends object, K extends keyof T>(key: K) =>
    (obj: T): Omit<T, K> => {
        const shallowClone = { ...obj }
        delete shallowClone[key]
        return shallowClone
    }
