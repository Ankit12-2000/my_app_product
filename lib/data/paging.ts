import "server-only";

// Shared paging contract for every admin/vendor list screen. Lists used to
// select("*") every row with all of its joins and then filter in JS; anything
// past a few hundred rows made the panel crawl. Now the database does the
// filtering, sorting and slicing, and pages only ever hold PAGE_SIZE rows.

export const PAGE_SIZE = 20;

export interface Page<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/** Clamp an untrusted ?page= value to a positive integer. */
export function parsePage(value?: string | string[]): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Inclusive [from, to] range PostgREST wants for a given page. */
export function pageRange(page: number, pageSize = PAGE_SIZE): [number, number] {
  const from = (page - 1) * pageSize;
  return [from, from + pageSize - 1];
}

export function toPage<T>(
  rows: T[] | null,
  count: number | null,
  page: number,
  pageSize = PAGE_SIZE
): Page<T> {
  const total = count ?? 0;
  return {
    rows: rows ?? [],
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Escape a user search term for PostgREST's `or=(...)` filter syntax. Commas,
 * parens and quotes would otherwise break out of the filter expression, and
 * `%`, `_` or `*` would silently widen the pattern — PostgREST treats `*` as a
 * wildcard too, so a lone `*` would match every row.
 */
export function searchTerm(raw?: string | null): string | null {
  const q = (raw ?? "").trim();
  if (!q) return null;
  return (
    q
      .replace(/[%_\\]/g, "\\$&")
      .replace(/[(),."'*]/g, " ")
      .replace(/\s+/g, " ")
      .trim() || null
  );
}
