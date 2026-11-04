'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { api, ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    try { await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) }); router.replace('/dashboard'); router.refresh(); }
    catch (err) { setError(err instanceof ApiError ? err.message : 'Unable to sign in.'); }
    finally { setLoading(false); }
  }
  return <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_.95fr]">
    <section className="hidden bg-[var(--navy)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="flex items-center gap-3">
        <Image src="/doctor-tracker-logo.png" alt="" width={50} height={50} className="h-12 w-12 rounded-xl bg-white p-1 object-contain shadow-sm" priority />
        <span className="text-lg font-bold">Doctor Tracker</span>
      </div>
      <div className="max-w-xl">
        <div className="mb-8 flex h-52 items-center justify-center xl:h-60">
          <Image
            src="/doctor-tracker-hero.png"
            alt="Medical professionals providing patient care"
            width={1536}
            height={1024}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <p className="mb-5 text-sm font-bold uppercase tracking-[.2em] text-teal-300">Clinical administration</p>
        <h1 className="text-5xl font-bold leading-[1.12] tracking-tight">Clear oversight for every doctor and patient.</h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">A focused, secure workspace for maintaining care relationships and understanding patient activity.</p>
      </div>
      <p className="text-sm text-slate-400">Secure administrative access</p>
    </section>
    <section className="flex items-center justify-center bg-slate-50 px-5 py-12"><div className="w-full max-w-md"><div className="mb-9 lg:hidden"><div className="mb-5 flex items-center gap-3 text-[var(--navy)]"><Image src="/doctor-tracker-logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-xl border border-slate-200 bg-white p-1 object-contain shadow-sm" priority /><span className="text-lg font-bold">Doctor Tracker</span></div></div><div className="card p-6 sm:p-8"><div className="mb-7"><p className="text-sm font-bold text-teal-700">ADMIN PORTAL</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Welcome back</h2><p className="mt-2 text-sm text-slate-500">Sign in with your administrator credentials.</p></div><form onSubmit={submit} className="space-y-5"><div><label className="label" htmlFor="email">Email address</label><div className="relative"><Mail className="absolute left-3 top-3 text-slate-400" size={18} /><input className="input pl-10" id="email" name="email" type="email" autoComplete="email" required placeholder="admin@example.com" /></div></div><div><label className="label" htmlFor="password">Password</label><div className="relative"><LockKeyhole className="absolute left-3 top-3 text-slate-400" size={18} /><input className="input pl-10" id="password" name="password" type="password" autoComplete="current-password" required placeholder="Enter your password" /></div></div>{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}</button></form></div><p className="mt-5 text-center text-xs text-slate-500">Access is limited to authorized administrators.</p></div></section>
  </main>;
}
