'use client';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api/users';
import { realmApi } from '@/lib/api/realms';
import { PageHeader } from '@/components/shared/PageHeader';
import { UserTable } from '@/components/users/UserTable';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [realm, setRealm] = useState('master');

  const { data: realms } = useQuery({ queryKey: ['realms'], queryFn: realmApi.list });
  const { data, isLoading } = useQuery({
    queryKey: ['users', realm, search],
    queryFn: () => userApi.list(realm, { search, page: 0, size: 50 }),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="All users across realms" />

      <div className="flex flex-col md:flex-row gap-3">
        <select
          value={realm}
          onChange={e => setRealm(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400 bg-white"
        >
          {(realms ?? []).map(r => <option key={r.name} value={r.name}>{r.displayName || r.name}</option>)}
        </select>
        <div className="relative flex-1 md:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-400 w-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
          </div>
        </div>
      ) : (
        <UserTable users={data?.content ?? []} />
      )}
    </div>
  );
}
