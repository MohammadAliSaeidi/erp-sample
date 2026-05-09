type FilterType = "string" | "number" | "date" | "boolean";
type FilterableKeys<T> = Extract<keyof T, string>;
type FilterMap<T> = Partial<Record<FilterableKeys<T>, FilterType>>;

export function makeQueryParser<TDTO>() {
  return <TFilter extends FilterMap<TDTO>>(filters: TFilter) => {
    return (q: Record<string, unknown>) => ({
      pagination: {
        page: q.page ? Number(q.page) : 1,
        limit: q.limit ? Number(q.limit) : 20,
      },
      filter: Object.fromEntries(
        Object.entries(filters)
          .map(([key, type]) => {
            const value = pickFilter(q, key, type as FilterType);
            return value ? [key, value] : null;
          })
          .filter(Boolean) as [string, unknown][]
      ),
    });
  };
}


function pickFilter(q: Record<string, unknown>, key: string, type: FilterType) {
  switch (type) {
    case "string":
      return (
        (q[`${key}[eq]`] && { eq: String(q[`${key}[eq]`]) }) ||
        (q[`${key}[contains]`] && { contains: String(q[`${key}[contains]`]) }) ||
        (q[`${key}[startsWith]`] && { startsWith: String(q[`${key}[startsWith]`]) }) ||
        (q[`${key}[endsWith]`] && { endsWith: String(q[`${key}[endsWith]`]) }) ||
        undefined
      );
    case "number":
      if (q[`${key}[between][from]`] && q[`${key}[between][to]`]) {
        return { between: { from: Number(q[`${key}[between][from]`]), to: Number(q[`${key}[between][to]`]) } };
      }
      return (
        (q[`${key}[eq]`] && { eq: Number(q[`${key}[eq]`]) }) ||
        (q[`${key}[gt]`] && { gt: Number(q[`${key}[gt]`]) }) ||
        (q[`${key}[gte]`] && { gte: Number(q[`${key}[gte]`]) }) ||
        (q[`${key}[lt]`] && { lt: Number(q[`${key}[lt]`]) }) ||
        (q[`${key}[lte]`] && { lte: Number(q[`${key}[lte]`]) }) ||
        undefined
      );
    case "date":
      if (q[`${key}[between][from]`] && q[`${key}[between][to]`]) {
        return { between: { from: String(q[`${key}[between][from]`]), to: String(q[`${key}[between][to]`]) } };
      }
      return (
        (q[`${key}[eq]`] && { eq: String(q[`${key}[eq]`]) }) ||
        (q[`${key}[before]`] && { before: String(q[`${key}[before]`]) }) ||
        (q[`${key}[after]`] && { after: String(q[`${key}[after]`]) }) ||
        undefined
      );
    case "boolean":
      return q[`${key}[eq]`] !== undefined
        ? { eq: String(q[`${key}[eq]`]) === "true" }
        : undefined;
  }
}
