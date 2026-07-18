import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * - Permalink WordPress residui (?page_id= / ?attachment_id=) → /it senza query.
 * - Root `/` → /it (qui, non in next.config: altrimenti la query sopravvive al redirect).
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasWpQuery =
    searchParams.has("page_id") || searchParams.has("attachment_id");

  if (hasWpQuery) {
    const url = request.nextUrl.clone();
    url.pathname = "/it";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/it";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/it"],
};
