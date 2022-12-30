export const nonNull = <T>(item: T): item is NonNullable<T> => item != null;
