'use client';
import { PageHeader } from '@/components/shared/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Admin console configuration" />

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Console Name</label>
              <input
                defaultValue="OpenGate Admin"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Base URL</label>
              <input
                defaultValue="http://localhost:8080"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Session</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto logout on idle</p>
                <p className="text-xs text-gray-500">Sign out after 30 minutes of inactivity</p>
              </div>
              <div className="w-10 h-5 bg-cyan-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Remember me</p>
                <p className="text-xs text-gray-500">Keep session for 7 days</p>
              </div>
              <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-gray-900 mb-1">About</h3>
          <p className="text-xs text-gray-500">OpenGate IAM Console v1.0.0</p>
          <p className="text-xs text-gray-400 mt-0.5">Built with Next.js 14 · Spring Boot 3.3 · Kafka · Redis</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="px-5 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: '#00B4D8' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
