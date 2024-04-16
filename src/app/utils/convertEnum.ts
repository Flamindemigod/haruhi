// Convert Two Enum Mappings
// Enums Must have matching Keys.
// Any Key not matched. is undefined/

export default <
  S extends { [key: string]: any },
  M extends { [key: string]: any },
>(
  source: S,
  map: M,
  value: any
): any | undefined => {
  const result = Object.entries(source).find(([k, v], idx) => v == value);
  if (!result) {
    return undefined;
  }
  const mapping = Object.entries(map).find(([k, v], idx) => k == result[0]);
  if (!mapping) {
    return undefined;
  }
  return mapping[1] as any;
  // return map[source[value as keyof typeof source] as keyof typeof map]
};
