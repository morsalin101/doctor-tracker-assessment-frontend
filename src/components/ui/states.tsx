import { Database, RefreshCw } from 'lucide-react';

export function LoadingRows() { return <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-12 w-full" />)}</div>; }
export function EmptyState({ title, text }: { title: string; text: string }) { return <div className="flex flex-col items-center px-6 py-14 text-center"><div className="mb-4 rounded-xl bg-slate-100 p-3 text-slate-500"><Database size={22} /></div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p></div>; }
export function ErrorState({ retry }: { retry: () => void }) { return <div className="p-8 text-center"><p className="text-sm text-red-700">We could not load this information.</p><button className="btn btn-secondary mt-4" onClick={retry}><RefreshCw size={16} /> Try again</button></div>; }
