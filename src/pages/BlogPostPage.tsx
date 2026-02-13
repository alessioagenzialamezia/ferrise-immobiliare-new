import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Facebook,
  Linkedin,
  Mail,
  Menu,
  X,
  Home as HomeIcon,
} from 'lucide-react';
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
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchRelatedPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPost = async () => {
    if (!postId) return;

    try {
      const sb = supabase;
      if (!sb) {
        console.warn('Supabase client not initialized');
        setPost(null);
        return;
      }

      const { data, error } = await sb
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .not('published_at', 'is', null)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const sb = supabase;
      if (!sb || !postId) {
        setRelatedPosts([]);
        return;
      }

      const { data, error } = await sb
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
      setRelatedPosts([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const shareUrl = useMemo(() => `${window.location.origin}#blog-post/${postId}`, [postId]);
  const shareTitle = useMemo(() => post?.title || '', [post]);

  const shareLinks = useMemo(
    () => ({
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + '\n\n' + shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    }),
    [shareTitle, shareUrl]
  );

  const openEmailShare = () => {
    const subject = `Ferrise Immobiliare - ${post?.title || 'Articolo'}`;
    const body = `Ciao!

  Ti condivido questo articolo dal sito Ferrise Immobiliare:

  ${shareUrl}

  Buona lettura!`;

    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const images = useMemo(() => (post?.images && post.images.length > 0 ? post.images : []), [post?.images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header minimale */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => onNavigate('blog')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Torna al blog"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={() => onNavigate('home')} className="flex items-center" aria-label="Vai alla home">
                  <img
                    src="/logoalessio.png"
                    alt="Ferrise Immobiliare"
                    className="h-10 w-auto hover:opacity-80 transition-opacity"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-lg w-full">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Articolo non trovato</h2>
            <p className="text-gray-600 mb-6">L’articolo potrebbe non essere più disponibile.</p>
            <button
              onClick={() => onNavigate('blog')}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Torna al Blog
            </button>
          </div>
        </div>

        <Footer onNavigate={onNavigate} showAdminButton={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate('blog')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Torna al blog"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => onNavigate('home')} className="flex items-center" aria-label="Vai alla home">
                <img
                  src="/logoalessio.png"
                  alt="Ferrise Immobiliare"
                  className="h-10 w-auto hover:opacity-80 transition-opacity"
                />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Apri menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-6">
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
                onClick={() => onNavigate('sell')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Vendi immobile
              </button>
              <button
                onClick={() => onNavigate('agency')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Agenzia
              </button>
              <button className="text-blue-600 px-3 py-2 text-sm font-medium">Blog</button>
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
                    onNavigate('sell');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Vendi immobile
                </button>

                <div className="h-px bg-gray-200 my-2" />

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
                  className="text-blue-600 px-3 py-2 text-base font-semibold text-left"
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

      {/* Article */}
      <main className="flex-1">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* MAIN */}
            <div className="lg:col-span-8">
              <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Hero */}
                {images.length > 0 ? (
                  <div className="relative">
                    <img src={images[0]} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{post.title}</h1>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90">
                        <span className="inline-flex items-center text-sm font-semibold">
                          <Calendar className="w-4 h-4 mr-2" />
                          <time dateTime={post.published_at || ''}>
                            {post.published_at ? formatDate(post.published_at) : 'Data non disponibile'}
                          </time>
                        </span>
                        <span className="inline-flex items-center text-sm font-semibold">
                          <User className="w-4 h-4 mr-2" />
                          Alessio
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-b border-gray-100">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                      <span className="inline-flex items-center text-sm font-semibold">
                        <Calendar className="w-4 h-4 mr-2" />
                        <time dateTime={post.published_at || ''}>
                          {post.published_at ? formatDate(post.published_at) : 'Data non disponibile'}
                        </time>
                      </span>
                      <span className="inline-flex items-center text-sm font-semibold">
                        <User className="w-4 h-4 mr-2" />
                        Alessio
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {post.content ? (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px] md:text-[16px]">
                      {post.content}
                    </div>
                  ) : (
                    <div className="text-gray-600">Contenuto non disponibile.</div>
                  )}

                  {/* Gallery extra */}
                  {images.length > 1 && (
                    <div className="mt-10">
                      <h3 className="text-lg font-extrabold text-gray-900 mb-4">Galleria</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {images.slice(1).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${post.title} - Immagine ${index + 2}`}
                            className="w-full h-64 object-cover rounded-2xl border border-gray-100"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share */}
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-extrabold text-gray-900 mb-4">Condividi</h3>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </a>
                      <a
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors text-sm"
                      >
                        <span className="mr-2">📱</span>
                        WhatsApp
                      </a>
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-800 text-white font-bold hover:bg-blue-900 transition-colors text-sm"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                      <button
                        type="button"
                        onClick={openEmailShare}
                        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Back */}
              <div className="mt-8">
                <button
                  onClick={() => onNavigate('blog')}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-extrabold hover:bg-blue-700 transition-colors"
                >
                  Torna al Blog
                </button>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-4">
              {/* CTA sidebar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-extrabold text-gray-900">Vuoi vendere casa?</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Richiedi una consulenza gratuita: valutazione, strategia e promozione dell’immobile.
                </p>

                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => onNavigate('sell')}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white font-extrabold hover:bg-blue-700 transition-colors"
                  >
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Vendi immobile
                  </button>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-blue-700 font-extrabold border border-blue-100 hover:bg-blue-50 transition-colors"
                  >
                    Contattaci
                  </button>
                </div>
              </div>

              {/* Related */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-4">Articoli correlati</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((rp) => {
                      const rpImages = rp.images && rp.images.length > 0 ? rp.images : [];
                      return (
                        <article
                          key={rp.id}
                          className="group cursor-pointer"
                          onClick={() => onNavigate('blog-post', rp.id)}
                        >
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                              {rpImages.length > 0 ? (
                                <img
                                  src={rpImages[0]}
                                  alt={rp.title}
                                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-extrabold">
                                  Blog
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h4 className="font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                                {rp.title}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500 mt-2 font-semibold">
                                <Calendar className="w-4 h-4 mr-1" />
                                {rp.published_at ? formatDate(rp.published_at) : '—'}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} showAdminButton={true} />
    </div>
  );
}
