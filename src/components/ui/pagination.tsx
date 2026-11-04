'use client';

import { useEffect } from 'react';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

type PageItem = number | 'ellipsis-left' | 'ellipsis-right';

function visiblePages(page: number, pages: number): PageItem[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, index) => index + 1);
  if (page <= 2) return [1, 2, 3, 'ellipsis-right', pages];
  if (page >= pages - 1) return [1, 'ellipsis-left', pages - 2, pages - 1, pages];
  return [1, 'ellipsis-left', page - 1, page, page + 1, 'ellipsis-right', pages];
}

export function Pagination({ page, pages, total, onPage, onPrefetch }: { page: number; pages: number; total: number; onPage: (page: number) => void; onPrefetch?: (page: number) => void }) {
  useEffect(() => {
    if (page < pages) onPrefetch?.(page + 1);
  }, [page, pages, onPrefetch]);

  const items = visiblePages(page, pages);
  return <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
    <span className="text-slate-500">{total} record{total === 1 ? '' : 's'} · Page {page} of {pages}</span>
    <nav className="flex flex-wrap items-center gap-2" aria-label="Pagination">
      <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:bg-slate-50 disabled:text-slate-300 disabled:shadow-none" onClick={() => onPage(1)} onMouseEnter={() => onPrefetch?.(1)} disabled={page <= 1} aria-label="First page"><ChevronFirst size={16} /></button>
      <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:bg-slate-50 disabled:text-slate-300 disabled:shadow-none" onClick={() => onPage(page - 1)} onMouseEnter={() => page > 1 && onPrefetch?.(page - 1)} disabled={page <= 1} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {items.map((item) => typeof item === 'number' ? <button key={item} className={`grid h-9 min-w-9 place-items-center rounded-full border px-2 font-medium shadow-sm transition ${item === page ? 'border-blue-500 bg-blue-500 text-white shadow-blue-200' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'}`} onClick={() => onPage(item)} onMouseEnter={() => onPrefetch?.(item)} onFocus={() => onPrefetch?.(item)} aria-current={item === page ? 'page' : undefined} aria-label={`Page ${item}`}>{item}</button> : <span key={item} className="grid h-9 w-6 place-items-center text-slate-400" aria-hidden="true">…</span>)}
      <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:bg-slate-50 disabled:text-slate-300 disabled:shadow-none" onClick={() => onPage(page + 1)} onMouseEnter={() => page < pages && onPrefetch?.(page + 1)} disabled={page >= pages} aria-label="Next page"><ChevronRight size={16} /></button>
      <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:bg-slate-50 disabled:text-slate-300 disabled:shadow-none" onClick={() => onPage(pages)} onMouseEnter={() => onPrefetch?.(pages)} disabled={page >= pages} aria-label="Last page"><ChevronLast size={16} /></button>
    </nav>
  </div>;
}
