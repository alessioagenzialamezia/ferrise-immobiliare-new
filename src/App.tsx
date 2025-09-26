import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import AgencyPage from './pages/AgencyPage';
import Properties from './components/Properties';
import BlogPosts from './components/BlogPosts';
import FAQs from './components/FAQs';
import Analytics from './components/Analytics';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'properties', 'property-detail', 'blog', 'blog-post', 'faq', 'contact', 'agency', 'admin'
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Controlla se c'è una sessione valida nel localStorage
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const { expiresAt } = JSON.parse(session);
        return new Date(expiresAt) > new Date();
      } catch {
        localStorage.removeItem('admin_session');
        return false;
      }
    }
    return false;
  });
  const [currentPage, setCurrentPage] = useState('properties');

  // Sistema di reindirizzamento per link condivisi
  useEffect(() => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Controlla tutti i possibili formati di link proprietà
    if (path.startsWith('/property/') || path.includes('property') || urlParams.has('property')) {
      console.log('🏠 Link proprietà rilevato, reindirizzo alla pagina proprietà');
      setCurrentView('properties');
      window.history.replaceState({}, '', '/');
    }
    // Controlla tutti i possibili formati di link blog
    else if (path.startsWith('/blog/')) {
      setCurrentView('blog');
      window.history.replaceState({}, '', '/');
    }
  }, []);
  
  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  const handleNavigation = (view: string, id?: string) => {
    setCurrentView(view);
    if (view === 'property-detail' && id) {
      setSelectedPropertyId(id);
    } else if (view === 'blog-post' && id) {
      setSelectedBlogPostId(id);
    }
  };

  // Render public pages
  if (currentView !== 'admin') {
    const renderPublicPage = () => {
      switch (currentView) {
        case 'home':
          return <HomePage onNavigate={handleNavigation} />;
        case 'properties':
          return <PropertiesPage onNavigate={handleNavigation} />;
        case 'property-detail':
          return <PropertyDetailPage propertyId={selectedPropertyId} onNavigate={handleNavigation} />;
        case 'blog':
          return <BlogPage onNavigate={handleNavigation} />;
        case 'blog-post':
          return <BlogPostPage postId={selectedBlogPostId} onNavigate={handleNavigation} />;
        case 'faq':
          return <FAQPage onNavigate={handleNavigation} />;
        case 'contact':
          return <ContactPage onNavigate={handleNavigation} />;
        case 'agency':
          return <AgencyPage onNavigate={handleNavigation} />;
        default:
          return <HomePage onNavigate={handleNavigation} />;
      }
    };

    return renderPublicPage();
  }

  // Se admin richiesto ma non autenticato, mostra login
  if (currentView === 'admin' && !isAuthenticated) {
    return <Login onLogin={handleLogin} onBackToHome={() => setCurrentView('home')} />;
  }

  // Se autenticato, mostra la dashboard admin
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'properties':
        return <Properties />;
      case 'blog':
        return <BlogPosts />;
      case 'faqs':
        return <FAQs />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Properties />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      onBackToSite={() => setCurrentView('home')}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;