'use client';
import { useEffect, useState } from 'react';
import { employeesAPI } from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, UserX, KeyRound, Users } from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'employee'
  });

  const fetchEmployees = async () => {
    try {
      const res = await employeesAPI.getAll();
      setEmployees(res.data.data.employees);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeesAPI.create(form);
      toast.success('Employee created!');
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'employee' });
      fetchEmployees();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleResetPassword = async (id: string, name: string) => {
    if (!confirm(`Reset password for ${name}?`)) return;
    try {
      const res = await employeesAPI.resetPassword(id);
      const newPass = res.data.data.newPassword;
      alert(`New password for ${name}: ${newPass}`);
    } catch {
      toast.error('Failed to reset password');
    }
  };

  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`Deactivate ${name}?`)) return;
    try {
      await employeesAPI.deactivate(id);
      toast.success('Employee deactivated!');
      fetchEmployees();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Employees</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : employees.length === 0 ? (
        <div className="text-center py-20">
          <Users className="mx-auto text-gray-700 mb-4" size={48} />
          <p className="text-gray-400">No employees yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {emp.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{emp.name}</p>
                  <p className="text-gray-400 text-sm">{emp.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  emp.isActive
                    ? 'bg-green-400/10 text-green-400'
                    : 'bg-red-400/10 text-red-400'
                }`}>
                  {emp.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleResetPassword(emp._id, emp.name)}
                  className="text-gray-400 hover:text-yellow-400 transition"
                  title="Reset Password"
                >
                  <KeyRound size={16} />
                </button>
                <button
                  onClick={() => handleDeactivate(emp._id, emp.name)}
                  className="text-gray-400 hover:text-red-400 transition"
                  title="Deactivate"
                >
                  <UserX size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-4">Add Employee</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <select
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}