'use client';
import { PageHeader } from '@/components/shared/PageHeader';
import { CheckCircle } from 'lucide-react';

const services = [
  { name: 'Gateway', port: 8080 },
  { name: 'Auth Service', port: 8081 },
  { name: 'User Service', port: 8082 },
  { name: 'Realm Service', port: 8083 },
  { name: 'RBAC Service', port: 8084 },
  { name: 'Client Service', port: 8085 },
  { name: 'MFA Service', port: 8086 },
  { name: 'Session Service', port: 8087 },
  { name: 'Notification Service', port: 8088 },
  { name: 'Admin API', port: 8089 },
];

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Service Health" description="Status of all IAM microservices" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(s => (
          <div key={s.name} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-500">:{s.port}</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-green-600 text-sm font-medium">UP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
