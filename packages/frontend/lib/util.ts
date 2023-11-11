import qs from "query-string";

type TQueryObj = Record<string, any>;

export const queryWrapper =
  <T = TQueryObj>(url: string) =>
  (query?: T) =>
    query ? `${url}?${qs.stringify(query)}` : url;
