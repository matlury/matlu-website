export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>
}

export const notNullOrUndefined = <T>(o: T | null | undefined): o is T =>
    o !== null && o !== undefined

export const ascendingByString =
    <T>(value: (item: T) => string) =>
    (a: T, b: T) =>
        value(a).localeCompare(value(b))

function omit<T extends object, K extends keyof T>(
    key: K
): (obj: T) => Omit<T, K>
function omit<T extends object, K extends keyof T>(key: K, obj: T): Omit<T, K>
function omit<T extends object, K extends keyof T>(
    key: K,
    obj?: T
): Omit<T, K> | ((obj: T) => Omit<T, K>) {
    if (typeof obj === 'undefined') {
        return (o: T) => {
            const shallowClone = { ...o }
            delete shallowClone[key]
            return shallowClone
        }
    }

    const shallowClone = { ...obj }
    delete shallowClone[key]
    return shallowClone
}

export { omit }

export const formatTitle = (title: string) => `${title} | Matlu ry`
