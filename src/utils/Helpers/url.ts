export function toQueryString(obj: string | Record<string, any>) {
  if (typeof obj === "string") {
    return obj;
  }

  return obj ?
    Object.entries(obj).reduce(
      (queryString, [key, val], index) => {
        const symbol = queryString.length === 0 ? "?" : "&";
        queryString +=
          (typeof val === "string" || typeof val === "number") ? `${symbol}${key}=${val}` : "";
        return queryString;
      },
      ""
    ) :
    "";
}
