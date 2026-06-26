import { jsonquery } from "@jsonquerylang/jsonquery";

function query<T = unknown>(data: unknown, q: string): T {
  return jsonquery(data, q) as T;
}

export default query;
