import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Facebook, Linkedin, Mail, Menu, X } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import Footer from '../components/Footer';

interface BlogPostPageProps {
  postId: string | null;
  onNavigate: (view: string, id?: string) => void;
}

export default function BlogPostPage({ postId, onNavigate }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchRelatedPosts();
    }
  }, [postId]);

  const fetchPost = async () => {
    if (!postId) return;
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .not('published_at', 'is', null)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('published_at', 'is', null)
        .neq('id', postId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = post?.title || '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + '\n\n' + shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Articolo non trovato</h2>
          <button 
            onClick={() => onNavigate('blog')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Torna al Blog
          </button>
        </div>
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
                onClick={() => onNavigate('faq')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => onNavigate('agency')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Agenzia
              </button>
              <button 
                onClick={() => onNavigate('blog')}
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
            <div className="flex items-center space-x-4">
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
                <button 
                  onClick={() => onNavigate('blog')}
                  className="text-blue-600 px-3 py-2 text-sm font-medium"
                >
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
                  onClick={() => {
                    onNavigate('blog');
                    setMobileMenuOpen(false);
                  }}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {post.images && post.images.length > 0 && (
            <div className="relative">
              <img 
                src={post.images[0]} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center text-white/90">
                  <Calendar className="w-5 h-5 mr-2" />
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at!)}
                  </time>
                  <span className="mx-3">•</span>
                  <User className="w-5 h-5 mr-2" />
                  <span>Alessio</span>
                </div>
              </div>
            </div>
          )}
          
          {(!post.images || post.images.length === 0) && (
            <div className="p-8 border-b">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at!)}
                </time>
                <span className="mx-3">•</span>
                <User className="w-5 h-5 mr-2" />
                <span>Alessio</span>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
            {post.content && (
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              </div>
            )}

            {/* Additional Images */}
            {post.images && post.images.length > 1 && (
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.slice(1).map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${post.title} - Immagine ${index + 2}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Condividi questo articolo</h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </a>
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  <span className="mr-2">📱</span>
                  WhatsApp
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
                <a
                  href={shareLinks.email}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Articoli Correlati</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article 
                  key={relatedPost.id}
                  className="cursor-pointer group"
                  onClick={() => onNavigate('blog-post', relatedPost.id)}
                >
                  {relatedPost.images && relatedPost.images.length > 0 && (
                    <img 
                      src={relatedPost.images[0]} 
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <time dateTime={relatedPost.published_at}>
                      {formatDate(relatedPost.published_at!)}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="text-center mt-8">
          <button 
            onClick={() => onNavigate('blog')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Torna al Blog
          </button>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}