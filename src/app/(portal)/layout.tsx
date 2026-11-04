import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const response = await fetch(`${process.env.API_SERVER_URL ?? 'http://localhost:5001'}/api/v1/auth/me`, {
    headers: { cookie: cookieStore.toString() }, cache: 'no-store',
  }).catch(() => null);
  if (!response?.ok) redirect('/login');
  const body = await response.json();
  return <AppShell email={body.data.email}>{children}</AppShell>;
}
