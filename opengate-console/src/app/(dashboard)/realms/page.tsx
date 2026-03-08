'use client';
import { useQuery } from '@tanstack/react-query';
import { realmApi } from '@/lib/api/realms';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Plus, Globe } from 'lucide-react';

export default function RealmsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['realms'], queryFn: realmApi.list });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Realms"
        description="Manage your IAM realms (tenants)"
        action={
          <Link href="/realms/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ background: '#00B4D8' }}>
            <Plus size={16} /> New Realm
          </Link>
        }
      />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-28 bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data || []).map((realm: any) => (
            <Link key={realm.id} href={`/realms/${realm.name}`}
              className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-cyan-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#0D1B2A' }}>
                  <Globe size={18} color="#00B4D8" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{realm.name}</h3>
                  <p className="text-xs text-gray-500">{realm.displayName || realm.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${realm.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {realm.enabled ? 'Active' : 'Disabled'}
                </span>
                {realm.mfaRequired && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">MFA Required</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
