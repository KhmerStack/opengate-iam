'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api/users';
import { PageHeader } from '@/components/shared/PageHeader';
import { UserTable } from '@/components/users/UserTable';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function RealmUsersPage({ params }: { params: { realmId: string } }) {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', params.realmId, search],
    queryFn: () => userApi.list(params.realmId, { search, page: 0, size: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description={`Manage users in realm: ${params.realmId}`}
        action={
          <Link
            href={`/realms/${params.realmId}/users/new`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: '#00B4D8' }}
          >
            <Plus size={16} /> New User
          </Link>
        }
      />

      {/* Search */}
      <div className="relative w-full md:w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-400 w-full"
        />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
          </div>
        </div>
      ) : (
        <>
          <UserTable
            users={data?.content ?? []}
            onDelete={id => deleteMutation.mutate(id)}
          />
          {data && (
            <p className="text-xs text-gray-400 text-right">
              {data.totalElements} total users · page {data.page + 1} of {data.totalPages}
            </p>
          )}
        </>
      )}
    </div>
  );
}
