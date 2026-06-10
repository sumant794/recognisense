'use client';
import { useEffect, useState } from 'react';
import { recognitionAPI } from '@/services/api';
import { CheckCircle, XCircle } from 'lucide-react';

export default function HistoryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recognitionAPI.getAll()
      .then(res => setRecords(res.data.data.records))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Recognition History</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-400">No records yet</p>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div
              key={r._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {r.status === 'success' ? (
                  <CheckCircle className="text-green-400" size={20} />
                ) : (
                  <XCircle className="text-red-400" size={20} />
                )}
                <div>
                  <p className="text-white font-medium">
                    {r.product?.name || 'Unknown Product'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Scanned by: {r.scannedBy?.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-400 text-sm">
                  {Math.round(r.confidence * 100)}% confidence
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}