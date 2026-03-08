'use client';
import { User } from '@/lib/types';
import { Badge } from '@/components/shared/Badge';
import { MoreVertical, Trash2, KeyRound } from 'lucide-react';
import { useState } from 'react';

interface Props {
  users: User[];
  onDelete?: (id: string) => void;
  onResetPassword?: (id: string) => void;
}

export function UserTable({ users, onDelete, onResetPassword }: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: '#0D1B2A' }}>
                    {(user.firstName?.[0] ?? user.username[0]).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-600">{user.email}</td>
              <td className="px-5 py-3 hidden md:table-cell">
                <div className="flex gap-1.5 flex-wrap">
                  <Badge variant={user.enabled ? 'green' : 'red'}>{user.enabled ? 'Active' : 'Disabled'}</Badge>
                  {user.emailVerified && <Badge variant="cyan">Verified</Badge>}
                </div>
              </td>
              <td className="px-5 py-3 text-gray-400 text-xs hidden lg:table-cell">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-3 relative">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                  onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
                {menuOpen === user.id && (
                  <div className="absolute right-4 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[160px]">
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                      onClick={() => { onResetPassword?.(user.id); setMenuOpen(null); }}
                    >
                      <KeyRound size={14} /> Reset Password
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      onClick={() => { onDelete?.(user.id); setMenuOpen(null); }}
                    >
                      <Trash2 size={14} /> Delete User
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="py-12 text-center text-gray-400 text-sm">No users found</div>
      )}
    </div>
  );
}
