export type Identity<T> = { [P in keyof T]: T[P] };
export type Replace<T, K extends keyof T, TReplace> = Identity<
  Pick<T, Exclude<keyof T, K>> & {
    [P in K]: TReplace;
  }
>;

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type SelectNonNullableFields<T, K extends keyof T> = T &
  NonNullableFields<Pick<T, K>>;

export type Rename<T, K extends keyof T, N extends string> = Pick<
  T,
  Exclude<keyof T, K>
> & { [P in N]: T[K] };

export type RenameByT<T, U> = {
  [K in keyof U as K extends keyof T ?
    T[K] extends string ?
      T[K]
    : never
  : K]: K extends keyof U ? U[K] : never;
};
