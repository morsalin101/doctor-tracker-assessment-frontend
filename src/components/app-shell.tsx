'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, LogOut, Menu, Stethoscope, Users, X } from 'lucide-react';
import { api } from '@/lib/api';

const items = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
];

export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  const path = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  const logout = async () => { await api('/auth/logout', { method: 'POST' }); router.replace('/login'); router.refresh(); };
  const sidebar = <div className="flex h-full flex-col bg-[var(--navy)] text-white">
    <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6"><Image src="/doctor-tracker-logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-xl bg-white p-1 object-contain shadow-sm" priority /><div><p className="font-bold">Doctor Tracker</p><p className="text-xs text-slate-400">Administration portal</p></div></div>
    <nav className="flex-1 space-y-1 px-3 py-5">{items.map(({ href, label, icon: Icon }) => { const active = path.startsWith(href); return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><Icon size={19} />{label}</Link>; })}</nav>
    <div className="border-t border-white/10 p-4"><p className="truncate px-2 text-xs text-slate-400">Signed in as</p><p className="truncate px-2 pb-3 pt-1 text-sm font-semibold">{email}</p><button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white" onClick={logout}><LogOut size={17} />Sign out</button></div>
  </div>;
  return <div className="min-h-screen"><aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
    {open && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close menu" className="absolute inset-0 bg-slate-950/45" onClick={() => setOpen(false)} /><aside className="relative h-full w-72 shadow-2xl">{sidebar}<button aria-label="Close menu" className="absolute right-3 top-5 rounded-lg p-2 text-slate-300" onClick={() => setOpen(false)}><X size={20} /></button></aside></div>}
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden"><button className="rounded-lg border border-slate-200 p-2 text-slate-700" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><Image src="/doctor-tracker-logo.png" alt="" width={34} height={34} className="ml-3 h-9 w-9 rounded-lg border border-slate-200 bg-white p-1 object-contain shadow-sm" /><span className="ml-2 font-bold text-slate-900">Doctor Tracker</span></header>
    <main className="min-h-screen lg:pl-64"><div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">{children}</div></main>
  </div>;
}
