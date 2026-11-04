'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';

const schema = z.object({ name: z.string().min(2, 'Enter the doctor’s name.'), specialization: z.string().min(2, 'Enter a specialization.'), hospital: z.string().min(2, 'Enter a hospital.'), phone: z.string().min(6, 'Enter a valid phone number.'), email: z.string().email('Enter a valid email.') });
type Values = z.infer<typeof schema>;

export function DoctorForm({ onDone }: { onDone: () => void }) {
  const client = useQueryClient(); const { register, handleSubmit, setError, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  const mutation = useMutation({ mutationFn: (values: Values) => api('/doctors', { method: 'POST', body: JSON.stringify(values) }), onSuccess: async () => { await client.invalidateQueries({ queryKey: ['doctors'] }); toast.success('Doctor added'); onDone(); }, onError: (error: ApiError) => { if (error.fields) Object.entries(error.fields).forEach(([key, value]) => setError(key as keyof Values, { message: value[0] })); else toast.error(error.message); } });
  const fields: { name: keyof Values; label: string; type?: string; placeholder: string }[] = [
    { name: 'name', label: 'Full name', placeholder: 'Dr. Ayesha Rahman' }, { name: 'specialization', label: 'Specialization', placeholder: 'Cardiology' }, { name: 'hospital', label: 'Hospital', placeholder: 'Dhaka Medical Centre' }, { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+880 1700 000000' }, { name: 'email', label: 'Email', type: 'email', placeholder: 'doctor@hospital.com' },
  ];
  return <form onSubmit={handleSubmit((v) => mutation.mutate(v))}><div className="grid gap-4 sm:grid-cols-2">{fields.map((field, index) => <div key={field.name} className={index === 0 || index === 2 ? 'sm:col-span-2' : ''}><label className="label" htmlFor={`doctor-${field.name}`}>{field.label}</label><input className="input" id={`doctor-${field.name}`} type={field.type} placeholder={field.placeholder} {...register(field.name)} />{errors[field.name] && <p className="field-error">{errors[field.name]?.message}</p>}</div>)}</div><div className="mt-6 flex justify-end gap-3"><button type="button" className="btn btn-secondary" onClick={onDone}>Cancel</button><button className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Adding…' : 'Add doctor'}</button></div></form>;
}
