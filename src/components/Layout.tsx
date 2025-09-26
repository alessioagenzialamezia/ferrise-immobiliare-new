import React, { ReactNode, useState } from 'react';
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

export default function Layout({ children, currentPage, onNavigate, onLogout, onBackToSite }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'properties', label: 'Proprietà', icon: Home },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'faqs', label: 'FAQ', icon: HelpCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-900">Ferriseimmobiliare.it</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none`}>
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-900">Ferriseimmobiliare.it</h1>
            <p className="text-sm text-gray-600 mt-1">Pannello Amministrazione</p>
            <div className="mt-3 space-y-1">
              <button
                onClick={onBackToSite}
                className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                Torna al sito
              </button>
              <button
                onClick={onLogout}
                className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Esci
              </button>
            </div>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}