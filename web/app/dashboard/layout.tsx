'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Package,
  Users,
  History,
  LogOut,
  Camera
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

 useEffect(() => {
  const token = localStorage.getItem('accessToken');
  const userData = localStorage.getItem('userData');

  if (!token || !userData) {
    router.push('/login');
    return;
  }

  // Store mein set karo
  try {
    const user = JSON.parse(userData);
    useAuthStore.getState().setAuth(user, token);
  } catch {
    router.push('/login');
  }
}, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/employees', label: 'Employees', icon: Users },
    { href: '/dashboard/history', label: 'History', icon: History },
    { href: '/dashboard/recognize', label: 'Recognize', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">
            VisionTag<span className="text-blue-500">AI</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">Admin Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm font-medium ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-white text-sm font-medium">{user?.name}</p>
          <p className="text-gray-500 text-xs">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-gray-400 hover:text-red-400 transition text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}