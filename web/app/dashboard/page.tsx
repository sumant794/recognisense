'use client';
import { useEffect, useState } from 'react';
import { recognitionAPI } from '@/services/api';
import { Package, Users, CheckCircle, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    recognitionAPI.getStats()
      .then(res => setStats(res.data.data.stats))
      .catch(console.error);
  }, []);

  const successCount = stats?.today?.find((s: any) => s._id === 'success')?.count || 0;
  const failedCount = stats?.today?.find((s: any) => s._id === 'failed')?.count || 0;

  const cards = [
    {
      title: 'Successful Scans Today',
      value: successCount,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      title: 'Failed Scans Today',
      value: failedCount,
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className={`${card.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={card.color} size={24} />
              </div>
              <p className="text-gray-400 text-sm">{card.title}</p>
              <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Welcome */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2">
          Welcome to RecogniSense
        </h3>
        <p className="text-gray-400 text-sm">
          AI-powered face and product recognition platform for your logistics operations.
        </p>
      </div>
    </div>
  );
}