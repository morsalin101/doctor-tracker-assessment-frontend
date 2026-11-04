'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';

export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, busy }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; onConfirm: () => void; busy?: boolean }) {
  return <AlertDialog.Root open={open} onOpenChange={onOpenChange}><AlertDialog.Portal>
    <AlertDialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45" />
    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
      <AlertDialog.Title className="text-lg font-bold text-slate-900">{title}</AlertDialog.Title>
      <AlertDialog.Description className="mt-2 text-sm leading-6 text-slate-600">{description}</AlertDialog.Description>
      <div className="mt-6 flex justify-end gap-3"><AlertDialog.Cancel className="btn btn-secondary">Cancel</AlertDialog.Cancel><AlertDialog.Action className="btn btn-danger" onClick={onConfirm} disabled={busy}>{busy ? 'Deleting…' : 'Delete patient'}</AlertDialog.Action></div>
    </AlertDialog.Content>
  </AlertDialog.Portal></AlertDialog.Root>;
}
