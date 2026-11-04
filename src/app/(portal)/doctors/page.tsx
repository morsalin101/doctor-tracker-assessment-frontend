'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, FilterX, Plus, Search, Stethoscope } from 'lucide-react';
import { api, queryString } from '@/lib/api';
import type { ApiResponse, Doctor } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Modal } from '@/components/ui/modal';
import { DoctorForm } from '@/components/forms/doctor-form';
import { EmptyState, ErrorState, LoadingRows } from '@/components/ui/states';
import { Pagination } from '@/components/ui/pagination';

export default function DoctorsPage() {
  const router = useRouter(); const path = usePathname(); const params = useSearchParams(); const client = useQueryClient(); const [createOpen, setCreateOpen] = useState(false);
  const values = { page: params.get('page') ?? '1', limit: params.get('limit') ?? '10', search: params.get('search') ?? '', specialization: params.get('specialization') ?? '', hospital: params.get('hospital') ?? '', from: params.get('from') ?? '', to: params.get('to') ?? '' };
  const set = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); if (key !== 'page') next.set('page', '1'); router.replace(`${path}?${next}`); };
  const query = useQuery({ queryKey: ['doctors', values], queryFn: () => api<ApiResponse<Doctor[]>>(`/doctors?${queryString(values)}`) });
  const prefetchPage = (nextPage: number) => { const nextValues = { ...values, page: String(nextPage) }; void client.prefetchQuery({ queryKey: ['doctors', nextValues], queryFn: () => api<ApiResponse<Doctor[]>>(`/doctors?${queryString(nextValues)}`) }); };
  const options = useQuery({ queryKey: ['doctor-options'], queryFn: () => api<ApiResponse<{ specializations: string[]; hospitals: string[] }>>('/doctors/filter-options') });
  const clear = () => router.replace(path);
  return <><PageHeader eyebrow="Provider directory" title="Doctors" description="Search and manage doctors across your clinical network." action={<button className="btn btn-primary" onClick={() => setCreateOpen(true)}><Plus size={18} /> Add doctor</button>} />
    <div className="card mb-5 p-4"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_.8fr_.8fr_auto]"><div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input className="input pl-10" placeholder="Search name, email, or hospital" value={values.search} onChange={(e) => set('search', e.target.value)} /></div><select className="input" value={values.specialization} onChange={(e) => set('specialization', e.target.value)}><option value="">All specializations</option>{options.data?.data.specializations.map((v) => <option key={v}>{v}</option>)}</select><select className="input" value={values.hospital} onChange={(e) => set('hospital', e.target.value)}><option value="">All hospitals</option>{options.data?.data.hospitals.map((v) => <option key={v}>{v}</option>)}</select><input aria-label="From date" className="input" type="date" value={values.from} onChange={(e) => set('from', e.target.value)} /><input aria-label="To date" className="input" type="date" value={values.to} onChange={(e) => set('to', e.target.value)} /><button className="btn btn-secondary" onClick={clear} title="Clear filters"><FilterX size={17} /></button></div></div>
    <div className="card overflow-hidden">{query.isLoading ? <LoadingRows /> : query.isError ? <ErrorState retry={() => query.refetch()} /> : !query.data?.data.length ? <EmptyState title="No doctors found" text="Adjust your filters or add the first doctor to the directory." /> : <><div className="table-wrap hidden md:block"><table className="data-table"><thead><tr><th>Doctor</th><th>Specialization</th><th>Hospital</th><th>Phone</th><th className="w-20">Action</th></tr></thead><tbody>{query.data.data.map((doctor) => <tr key={doctor._id}><td><p className="font-semibold text-slate-900">{doctor.name}</p><p className="mt-1 text-xs text-slate-500">{doctor.email}</p></td><td><span className="badge">{doctor.specialization}</span></td><td className="text-sm text-slate-600">{doctor.hospital}</td><td className="text-sm text-slate-600">{doctor.phone}</td><td><Link className="inline-flex rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-700" href={`/doctors/${doctor._id}`} aria-label={`View ${doctor.name}`}><Eye size={18} /></Link></td></tr>)}</tbody></table></div><div className="divide-y divide-slate-100 md:hidden">{query.data.data.map((doctor) => <Link key={doctor._id} href={`/doctors/${doctor._id}`} className="flex gap-3 p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700"><Stethoscope size={19} /></span><div className="min-w-0"><p className="font-semibold text-slate-900">{doctor.name}</p><p className="mt-1 text-sm text-slate-500">{doctor.specialization} · {doctor.hospital}</p></div></Link>)}</div><Pagination page={query.data.meta!.page} pages={query.data.meta!.pages} total={query.data.meta!.total} onPage={(page) => set('page', String(page))} onPrefetch={prefetchPage} /></>}</div>
    <Modal open={createOpen} onOpenChange={setCreateOpen} title="Add doctor" description="Create a new provider record."><DoctorForm onDone={() => setCreateOpen(false)} /></Modal>
  </>;
}
