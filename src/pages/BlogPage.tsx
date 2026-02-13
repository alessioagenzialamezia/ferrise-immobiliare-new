import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Search, Home as HomeIcon } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import AppLayout from '../components/AppLayout';

interface BlogPageProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <AppLayout onNavigate={onNavigate} showAdminButton={true}>
      {/* HERO */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Blog &amp; News</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Articoli, aggiornamenti e consigli sul mondo immobiliare.
            </p>

            {/* CTA mini */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onNavigate('sell')}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-white font-semibold hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Vendi immobile
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-blue-900 font-semibold hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Contattaci
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-10 md:py-12 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          {/* Search */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca negli articoli..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* No posts */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                {searchTerm ? 'Nessun articolo trovato' : 'Nessun articolo pubblicato'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Prova a modificare i termini di ricerca.' : 'Torna presto per leggere i nostri articoli.'}
              </p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featuredPost && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="h-72 lg:h-full">
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

                    <div className="p-7 md:p-10">
                      <div className="flex items-center text-blue-700 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{formatDate(featuredPost.published_at!)}</span>
                        <span className="mx-2 text-blue-300">|</span>
                        <User className="w-4 h-4 mr-2" />
                        <span className="text-sm">Alessio</span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 hover:text-blue-700 transition-colors">
                        <button onClick={() => onNavigate('blog-post', featuredPost.id)}>{featuredPost.title}</button>
                      </h2>

                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {getExcerpt(featuredPost.content || '', 220)}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => onNavigate('blog-post', featuredPost.id)}
                          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                        >
                          Leggi l&apos;articolo
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </button>

                        <button
                          onClick={() => onNavigate('sell')}
                          className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 text-blue-900 font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <HomeIcon className="w-5 h-5 mr-2" />
                          Vendi immobile
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Other posts */}
              {otherPosts.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 md:p-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Altri articoli</h2>
                    <p className="text-gray-600 mt-2">Approfondimenti utili e consigli pratici.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {otherPosts.map((post) => (
                      <article
                        key={post.id}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => onNavigate('blog-post', post.id)}
                      >
                        <div className="relative h-52">
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                        </div>

                        <div className="p-6">
                          <div className="flex items-center text-blue-700 mb-3">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-xs">{formatDate(post.published_at!)}</span>
                            <span className="mx-2 text-blue-200">|</span>
                            <User className="w-4 h-4 mr-2" />
                            <span className="text-xs">Alessio</span>
                          </div>

                          <h3 className="text-lg font-extrabold text-gray-900 mb-3 hover:text-blue-700 transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{getExcerpt(post.content || '')}</p>

                          <div className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-800 transition-colors">
                            Leggi di più
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* CTA bottom */}
          <section className="mt-10 md:mt-12 rounded-2xl bg-blue-900 text-white overflow-hidden">
            <div className="p-10 md:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Hai domande sul mercato immobiliare?</h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                Contatta i nostri esperti per una consulenza gratuita e personalizzata.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-yellow-500 text-blue-950 py-3 px-8 rounded-xl hover:bg-yellow-400 transition-all duration-300 hover:-translate-y-0.5 font-extrabold shadow-sm hover:shadow-md"
                >
                  Contattaci
                </button>

                <button
                  onClick={() => onNavigate('sell')}
                  className="bg-white/10 text-white hover:bg-white/15 py-3 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 font-extrabold shadow-sm hover:shadow-md inline-flex items-center justify-center"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Vuoi vendere con noi?
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </AppLayout>
  );
}
