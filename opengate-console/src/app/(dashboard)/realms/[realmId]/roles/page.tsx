'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleApi } from '@/lib/api/roles';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';
import { Plus, Trash2, Shield } from 'lucide-react';
import Link from 'next/link';

export default function RealmRolesPage({ params }: { params: { realmId: string } }) {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['roles', params.realmId],
    queryFn: () => roleApi.list(params.realmId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roleApi.delete(params.realmId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description={`Permission roles in realm: ${params.realmId}`}
        action={
          <Link href={`/realms/${params.realmId}/roles/new`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: '#00B4D8' }}>
            <Plus size={16} /> New Role
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-gray-200 h-24 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data ?? []).map(role => (
            <div key={role.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: '#0D1B2A' }}>
                  <Shield size={16} color="#00B4D8" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{role.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{role.description || 'No description'}</p>
                  <div className="mt-2">
                    {role.composite && <Badge variant="orange">Composite</Badge>}
                  </div>
                </div>
              </div>
              <button
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                onClick={() => deleteMutation.mutate(role.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {(data ?? []).length === 0 && (
            <div className="col-span-2 py-12 text-center text-gray-400 text-sm">No roles defined</div>
          )}
        </div>
      )}
    </div>
  );
}
