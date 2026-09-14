import { FormEvent, useState } from 'react';
import { useAdminQuotas, useCreateQuota, useDeleteQuota, useSetQuotaActive, useUpdateQuota } from '../../../hooks/useQuotas';
import { Quota } from '../../../types';

export default function AdminQuotasPage() {
  const { data: quotas = [], isLoading } = useAdminQuotas();
  const createMutation = useCreateQuota();
  const updateMutation = useUpdateQuota();
  const activeMutation = useSetQuotaActive();
  const deleteMutation = useDeleteQuota();
  const [editingQuota, setEditingQuota] = useState<Quota | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const resetForm = () => {
    setEditingQuota(null);
    setName('');
    setAmount('');
  };

  const startEditing = (quota: Quota) => {
    setEditingQuota(quota);
    setName(quota.name);
    setAmount(quota.amount.toFixed(2).replace('.', ','));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(amount.replace(',', '.'));
    if (!name.trim() || !Number.isFinite(value) || value <= 0) return;
    const input = { name: name.trim(), amount: Number(value.toFixed(2)) };
    const options = { onSuccess: resetForm };
    if (editingQuota) updateMutation.mutate({ id: editingQuota.id, input }, options);
    else createMutation.mutate(input, options);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const remove = (quota: Quota) => {
    if (window.confirm(`Excluir a cota "${quota.name}"? Bolões antigos não serão alterados.`)) deleteMutation.mutate(quota.id);
  };

  return <div className="max-w-7xl mx-auto space-y-6">
    <div><h3 className="font-heading text-2xl font-black text-white">Catálogo de cotas</h3><p className="text-sm text-slate-400 mt-1">Gerencie opções usadas pelos novos bolões. Valores antigos permanecem congelados no bolão.</p></div>
    <form onSubmit={submit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-3">
      <label className="flex-1 text-xs text-slate-400">Nome<input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none" placeholder="Cota R$ 10" /></label>
      <label className="sm:w-40 text-xs text-slate-400">Valor (R$)<input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" required className="mt-1 w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none" placeholder="10,00" /></label>
      <div className="self-end flex gap-2">
        {editingQuota && <button type="button" onClick={resetForm} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 cursor-pointer">Cancelar</button>}
        <button type="submit" disabled={isSaving} className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">{editingQuota ? 'Salvar' : 'Adicionar'}</button>
      </div>
    </form>
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950"><table className="w-full text-left"><thead className="border-b border-slate-800 text-xs uppercase text-slate-500"><tr><th className="p-4">Nome</th><th className="p-4">Valor</th><th className="p-4">Status</th><th className="p-4 text-right">Ação</th></tr></thead><tbody className="divide-y divide-slate-800 text-sm">{isLoading ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">Carregando...</td></tr> : quotas.map((quota) => <tr key={quota.id}><td className="p-4 font-semibold text-white">{quota.name}</td><td className="p-4 text-emerald-400">R$ {quota.amount.toFixed(2).replace('.', ',')}</td><td className="p-4"><span className={quota.isActive ? 'text-emerald-400' : 'text-slate-500'}>{quota.isActive ? 'Ativa' : 'Inativa'}</span></td><td className="p-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => startEditing(quota)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-emerald-400 hover:text-white cursor-pointer">Editar</button><button type="button" onClick={() => activeMutation.mutate({ id: quota.id, isActive: !quota.isActive })} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-emerald-400 hover:text-white cursor-pointer">{quota.isActive ? 'Desativar' : 'Ativar'}</button><button type="button" onClick={() => remove(quota)} disabled={deleteMutation.isPending} className="rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Excluir</button></div></td></tr>)}</tbody></table></div>
  </div>;
}
