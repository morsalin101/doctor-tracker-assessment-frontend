'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Building2, Mail, Phone, Plus, Stethoscope, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { api, queryString } from '@/lib/api';
import type { ApiResponse, Doctor, Patient } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { PatientForm } from '@/components/forms/patient-form';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState, ErrorState, LoadingRows } from '@/components/ui/states';
import { Pagination } from '@/components/ui/pagination';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>(); const client = useQueryClient(); const [page, setPage] = useState(1); const [addOpen, setAddOpen] = useState(false); const [deleting, setDeleting] = useState<Patient | null>(null);
  const doctor = useQuery({ queryKey: ['doctor', id], queryFn: () => api<ApiResponse<Doctor>>(`/doctors/${id}`) });
  const patients = useQuery({ queryKey: ['patients', id, page], queryFn: () => api<ApiResponse<Patient[]>>(`/patients?${queryString({ doctorId: id, page, limit: 10 })}`) });
  const prefetchPage = (nextPage: number) => { void client.prefetchQuery({ queryKey: ['patients', id, nextPage], queryFn: () => api<ApiResponse<Patient[]>>(`/patients?${queryString({ doctorId: id, page: nextPage, limit: 10 })}`) }); };
  const remove = useMutation({ mutationFn: (patientId: string) => api(`/patients/${patientId}`, { method: 'DELETE' }), onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: ['patients'] }), client.invalidateQueries({ queryKey: ['doctor'] }), client.invalidateQueries({ queryKey: ['dashboard'] })]); toast.success('Patient deleted'); setDeleting(null); }, onError: () => toast.error('Unable to delete patient.') });
  if (doctor.isLoading) return <div className="space-y-4"><div className="skeleton h-8 w-64" /><div className="skeleton h-56 w-full" /></div>;
  if (doctor.isError || !doctor.data) return <div className="card"><ErrorState retry={() => doctor.refetch()} /></div>;
  const info = doctor.data.data;
  return <><Link href="/doctors" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-700"><ArrowLeft size={17} /> Back to doctors</Link>
    <div className="card mb-6 overflow-hidden"><div className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-100 text-teal-800"><Stethoscope size={27} /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Doctor profile</p><h1 className="mt-1 text-2xl font-bold text-slate-950">{info.name}</h1><p className="mt-1 text-sm text-slate-500">{info.specialization}</p></div></div></div><div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4"><Info icon={<Building2 size={18} />} label="Hospital" value={info.hospital} /><Info icon={<Phone size={18} />} label="Phone" value={info.phone} /><Info icon={<Mail size={18} />} label="Email" value={info.email} /><Info icon={<Users size={18} />} label="Patients" value={String(info.patientCount ?? 0)} /></div></div>
    <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-950">Assigned patients</h2><p className="mt-1 text-sm text-slate-500">Patients currently under this doctor’s care.</p></div><button className="btn btn-primary" onClick={() => setAddOpen(true)}><Plus size={17} /> Add patient</button></div>
    <div className="card overflow-hidden">{patients.isLoading ? <LoadingRows /> : patients.isError ? <ErrorState retry={() => patients.refetch()} /> : !patients.data?.data.length ? <EmptyState title="No patients assigned" text="Add a patient to begin this doctor’s care list." /> : <><div className="table-wrap"><table className="data-table"><thead><tr><th>Patient</th><th>Condition</th><th>Contact</th><th>Added</th><th className="w-20">Action</th></tr></thead><tbody>{patients.data.data.map((patient) => <tr key={patient._id}><td><p className="font-semibold text-slate-900">{patient.fullName}</p><p className="mt-1 text-xs capitalize text-slate-500">{patient.gender.replaceAll('_', ' ')}</p></td><td><span className="badge">{patient.condition}</span></td><td><p className="text-sm text-slate-600">{patient.phone}</p><p className="mt-1 text-xs text-slate-500">{patient.email || 'No email'}</p></td><td className="text-sm text-slate-500">{new Date(patient.createdAt).toLocaleDateString()}</td><td><button className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700" onClick={() => setDeleting(patient)} aria-label={`Delete ${patient.fullName}`}><Trash2 size={17} /></button></td></tr>)}</tbody></table></div><Pagination page={patients.data.meta!.page} pages={patients.data.meta!.pages} total={patients.data.meta!.total} onPage={setPage} onPrefetch={prefetchPage} /></>}</div>
    <Modal open={addOpen} onOpenChange={setAddOpen} title="Add patient" description={`Assign a new patient to ${info.name}.`}><PatientForm doctorId={id} onDone={() => setAddOpen(false)} /></Modal><ConfirmDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)} title="Delete patient?" description={`${deleting?.fullName ?? 'This patient'} will be permanently removed. This action cannot be undone.`} onConfirm={() => deleting && remove.mutate(deleting._id)} busy={remove.isPending} />
  </>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex gap-3"><span className="mt-0.5 text-teal-700">{icon}</span><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div></div>; }
