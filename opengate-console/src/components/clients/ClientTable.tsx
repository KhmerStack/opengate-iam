'use client';
import { OAuthClient } from '@/lib/types';
import { Badge } from '@/components/shared/Badge';
import { RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  clients: OAuthClient[];
  onDelete?: (id: string) => void;
  onRegenerate?: (clientId: string) => void;
}

export function ClientTable({ clients, onDelete, onRegenerate }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client ID</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Grant Types</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Scopes</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {clients.map(client => (
            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3">
                <p className="font-mono font-medium text-gray-900 text-xs">{client.clientId}</p>
                <p className="text-xs text-gray-400 mt-0.5">{client.id?.substring(0, 8)}...</p>
              </td>
              <td className="px-5 py-3 hidden md:table-cell">
                <div className="flex gap-1">
                  <Badge variant={client.publicClient ? 'orange' : 'gray'}>
                    {client.publicClient ? 'Public' : 'Confidential'}
                  </Badge>
                  {client.pkceRequired && <Badge variant="cyan">PKCE</Badge>}
                </div>
              </td>
              <td className="px-5 py-3 hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {client.grantTypes?.map(g => (
                    <Badge key={g} variant="gray">{g}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3 hidden lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {client.scopes?.map(s => (
                    <Badge key={s} variant="cyan">{s}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    className="p-1.5 text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors"
                    title="Regenerate secret"
                    onClick={() => onRegenerate?.(client.clientId)}
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete client"
                    onClick={() => onDelete?.(client.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">No clients registered</div>
      )}
    </div>
  );
}
