import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Home as HomeIcon } from 'lucide-react';
import { supabase, FAQ } from '../lib/supabase';
import AppLayout from '../components/AppLayout';

interface FAQPageProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function FAQPage({ onNavigate }: FAQPageProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqs, setOpenFaqs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized');
        setFaqs([]);
        return;
      }

      const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });

      if (error) throw error;

      const faqsData = data || [];
      setFaqs(faqsData);

      // Open first FAQ by default if exists
      if (faqsData.length > 0 && faqsData[0].id) {
        setOpenFaqs(new Set([faqsData[0].id]));
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (searchQuery === '') return true;
    const searchLower = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(searchLower) || faq.answer.toLowerCase().includes(searchLower);
  });

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
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Domande Frequenti</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Risposte alle domande più comuni sul mercato immobiliare e sui nostri servizi.
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

      {/* FAQ SECTION */}
      <section className="py-10 md:py-12 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca nelle FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-w-5xl mx-auto">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => {
                  const id = faq.id || '';
                  const isOpen = id ? openFaqs.has(id) : false;

                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => id && toggleFaq(id)}
                        className="w-full flex items-start justify-between gap-4 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                        aria-expanded={isOpen}
                      >
                        <h3 className="text-lg font-extrabold text-gray-900 leading-snug">{faq.question}</h3>

                        <span className="mt-0.5 flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-blue-700" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-blue-700" />
                          )}
                        </span>
                      </button>

                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isOpen ? 'max-h-[520px]' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-6 text-gray-700 border-t border-gray-100">
                          <div className="pt-4 whitespace-pre-line leading-relaxed">{faq.answer}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">
                  {searchQuery ? 'Nessun risultato trovato' : 'Nessuna FAQ disponibile'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? 'La tua ricerca non ha prodotto risultati. Prova con termini diversi.'
                    : 'Al momento non ci sono FAQ pubblicate. Torna presto per trovare risposte alle domande più comuni.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-extrabold hover:bg-blue-700 transition-colors"
                  >
                    Mostra tutte le FAQ
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STILL HAVE QUESTIONS */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5">Hai ancora domande?</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Non hai trovato la risposta che cercavi? Il nostro team è a tua disposizione per qualsiasi chiarimento.
            </p>

            <div className="bg-blue-50 border border-blue-100 p-8 md:p-10 rounded-2xl">
              <h3 className="text-xl font-extrabold text-gray-900 mb-4">Contattaci direttamente</h3>
              <p className="text-gray-700 mb-6">
                Puoi contattarci telefonicamente, via email o compilando il form di contatto sul nostro sito.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="tel:+393473975804"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-extrabold"
                >
                  Chiama ora
                </a>

                <a
                  href="mailto:alessioferrisecasaemutui@gmail.com"
                  className="bg-white text-blue-800 border border-blue-200 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors font-extrabold"
                >
                  Invia email
                </a>

                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-extrabold"
                >
                  Form contatti
                </button>
              </div>

              {/* CTA extra */}
              <div className="mt-6">
                <button
                  onClick={() => onNavigate('sell')}
                  className="inline-flex items-center justify-center rounded-xl bg-white/80 px-6 py-3 text-blue-950 font-extrabold hover:bg-white transition-colors"
                >
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Vuoi vendere con noi?
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
