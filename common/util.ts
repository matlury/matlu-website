export type NonNullableFields<T> = {
    [P in keyof T]: NonNullable<T[P]>
}

export const notNullOrUndefined = <T>(o: T | null | undefined): o is T =>
    o !== null && o !== undefined

export const ascendingByString =
    <T>(value: (item: T) => string) =>
    (a: T, b: T) =>
        value(a).localeCompare(value(b))

export const formatTitle = (title: string) => `${title} | Matlu ry`
