import { ReactNode, useState } from 'react';
import {
  Home,
  FileText,
  HelpCircle,
  BarChart3,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

export default function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  onBackToSite
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'properties', label: 'Proprietà', icon: Home },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'faqs', label: 'FAQ', icon: HelpCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar mobile */}
      <div className="lg:hidden sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logoalessio.png"
            alt="Ferrise Immobiliare"
            className="h-8 w-auto"
          />
          <div className="leading-tight">
            <h1 className="text-base font-bold text-blue-900">
              Ferriseimmobiliare.it
            </h1>
            <p className="text-xs text-gray-500">Pannello Admin</p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={sidebarOpen ? 'Chiudi menu' : 'Apri menu'}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={[
            'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-lg',
            'transform transition-transform duration-300 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0'
          ].join(' ')}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src="/logoalessio.png"
                alt="Ferrise Immobiliare"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-bold text-blue-900">
                  Ferriseimmobiliare.it
                </h1>
                <p className="text-sm text-gray-600">Pannello Amministrazione</p>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <button
                onClick={() => {
                  onBackToSite();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors px-2 py-2 rounded-lg hover:bg-gray-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Torna al sito
              </button>

              <button
                onClick={() => {
                  onLogout();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors px-2 py-2 rounded-lg hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </button>
            </div>
          </div>

          <nav className="py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={[
                    'w-full flex items-center px-6 py-3 text-left transition-colors',
                    active
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  ].join(' ')}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Contenitore fluido: niente max-width, riempie lo schermo */}
          <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
