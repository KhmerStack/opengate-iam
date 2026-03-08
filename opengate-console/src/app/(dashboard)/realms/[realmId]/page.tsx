'use client';
import { useQuery } from '@tanstack/react-query';
import { realmApi } from '@/lib/api/realms';
import { PageHeader } from '@/components/shared/PageHeader';
import Link from 'next/link';
import { Users, AppWindow, Shield, Activity, Globe, Clock, Lock } from 'lucide-react';

export default function RealmDetailPage({ params }: { params: { realmId: string } }) {
  const { data: realm, isLoading } = useQuery({
    queryKey: ['realm', params.realmId],
    queryFn: () => realmApi.get(params.realmId),
  });

  const sections = [
    { label: 'Users',    icon: Users,    href: `/realms/${params.realmId}/users`,    description: 'Manage realm users',    color: '#00B4D8' },
    { label: 'Clients',  icon: AppWindow, href: `/realms/${params.realmId}/clients`,  description: 'OAuth2 client apps',    color: '#8b5cf6' },
    { label: 'Roles',    icon: Shield,    href: `/realms/${params.realmId}/roles`,    description: 'RBAC roles & policies', color: '#10b981' },
    { label: 'Sessions', icon: Activity,  href: `/realms/${params.realmId}/sessions`, description: 'Active sessions',       color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={isLoading ? 'Loading…' : (realm as any)?.displayName || params.realmId}
        description={`Realm: ${params.realmId}`}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-gray-100" />)}
        </div>
      ) : (
        <>
          {/* Realm info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Realm ID</p>
                <p className="text-sm font-mono font-medium text-gray-800">{params.realmId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Token TTL</p>
                <p className="text-sm font-medium text-gray-800">{(realm as any)?.tokenLifespanSeconds}s</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={15} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">MFA</p>
                <p className="text-sm font-medium text-gray-800">{(realm as any)?.mfaRequired ? 'Required' : 'Optional'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${(realm as any)?.enabled ? 'bg-green-400' : 'bg-gray-300'}`} />
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="text-sm font-medium text-gray-800">{(realm as any)?.enabled ? 'Active' : 'Disabled'}</p>
              </div>
            </div>
          </div>

          {/* Navigation cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sections.map(({ label, icon: Icon, href, description, color }) => (
              <Link key={label} href={href}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-cyan-400 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: color + '15' }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
