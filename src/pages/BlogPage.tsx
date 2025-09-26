import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, ArrowRight, Search, Menu, X } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import Footer from '../components/Footer';

interface BlogPageProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized');
        setPosts([]);
        return;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (!content) return '';
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  // Featured post is the first one
  const featuredPost = filteredPosts[0];
  // Other posts
  const otherPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => onNavigate('home')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => onNavigate('home')} className="flex items-center">
                <img 
                  src="/logoalessio.png" 
                  alt="Ferris Immobiliare" 
                  className="h-10 w-auto hover:opacity-80 transition-opacity"
                />
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => onNavigate('home')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('properties')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Proprietà
              </button>
              <button 
                onClick={() => onNavigate('agency')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Agenzia
              </button>
              <button className="text-blue-600 px-3 py-2 text-sm font-medium">
                Blog
              </button>
              <button 
                onClick={() => onNavigate('faq')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contatti
              </button>
            </nav>
          </div>
          
          {/* Mobile navigation menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    onNavigate('properties');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Proprietà
                </button>
                <button 
                  onClick={() => {
                    onNavigate('agency');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Agenzia
                </button>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-600 px-3 py-2 text-base font-medium text-left"
                >
                  Blog
                </button>
                <button 
                  onClick={() => {
                    onNavigate('faq');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => {
                    onNavigate('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Contatti
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog & News
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Articoli, aggiornamenti e consigli sul mondo immobiliare
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca negli articoli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* No Posts Message */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nessun articolo trovato' : 'Nessun articolo pubblicato'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Prova a modificare i termini di ricerca' : 'Torna presto per leggere i nostri articoli'}
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="py-12 bg-white rounded-xl shadow-lg mb-12">
                <div className="px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="h-96 rounded-lg overflow-hidden">
                      {featuredPost.images && featuredPost.images.length > 0 ? (
                        <img
                          src={featuredPost.images[0]}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-blue-400" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center text-blue-600 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{formatDate(featuredPost.published_at!)}</span>
                        <span className="mx-2">|</span>
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm">Alessio</span>
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer">
                        <button onClick={() => onNavigate('blog-post', featuredPost.id)}>
                          {featuredPost.title}
                        </button>
                      </h2>
                      
                      <p className="text-gray-600 mb-6">
                        {getExcerpt(featuredPost.content || '', 200)}
                      </p>
                      
                      <button 
                        onClick={() => onNavigate('blog-post', featuredPost.id)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                      >
                        Leggi l'Articolo
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Other Posts Grid */}
            {otherPosts.length > 0 && (
              <section className="py-12 bg-gray-50 rounded-xl">
                <div className="px-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                    Altri Articoli
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map((post) => (
                      <article 
                        key={post.id} 
                        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
                        onClick={() => onNavigate('blog-post', post.id)}
                      >
                        <div className="relative pb-[60%]">
                          {post.images && post.images.length > 0 ? (
                            <img
                              src={post.images[0]}
                              alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <Calendar className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center text-blue-600 mb-3">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span className="text-xs">{formatDate(post.published_at!)}</span>
                            <span className="mx-2">|</span>
                            <User className="w-4 h-4 mr-1" />
                            <span className="text-xs">Alessio</span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {getExcerpt(post.content || '')}
                          </p>
                          
                          <div className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
                            Leggi di più
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-blue-800 text-white rounded-xl mt-12">
          <div className="text-center max-w-3xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Hai domande sul mercato immobiliare?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contatta i nostri esperti per una consulenza gratuita e personalizzata.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-yellow-500 text-blue-900 py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
            >
              Contattaci
            </button>
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} showAdminButton={true} />
    </div>
  );
}