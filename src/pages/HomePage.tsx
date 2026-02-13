import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Search,
  MapPin,
  Building,
  ChevronRight,
  Star,
  Phone,
  Clock,
  Award,
  KeyRound,
  Handshake,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon
} from 'lucide-react';
import SiteHeader from '../components/SiteHeader';
import { supabase, Property } from '../lib/supabase';
import Footer from '../components/Footer';

interface HomePageProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigateTop = (view: string, id?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(view, id);
  };

  const backgroundImages = useMemo(
    () => [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    ],
    []
  );

  useEffect(() => {
    fetchFeaturedProperties();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const client = supabase; // ✅ evita errore TS: supabase possibly null
      if (!client) {
        console.warn('Supabase client not initialized');
        setFeaturedProperties([]);
        return;
      }

      const { data, error } = await client
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header unificato */}
      <SiteHeader onNavigate={onNavigate} />

      {/* HERO */}
      <section className="relative text-white overflow-hidden">
        <div className="relative h-[580px] md:h-[720px] lg:h-[780px] xl:h-[820px]">
          {/* Background carousel */}
          <div className="absolute inset-0">
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/75 via-blue-900/35 to-transparent" />
              </div>
            ))}
          </div>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/15 hover:bg-white/25 rounded-full transition-all"
            aria-label="Slide precedente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/15 hover:bg-white/25 rounded-full transition-all"
            aria-label="Slide successiva"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative h-full flex items-center py-10 md:py-14 lg:py-16">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center pt-10 md:pt-14 lg:pt-16 mb-10 md:mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
              Trova la Casa dei Tuoi Sogni
            </h1>
            <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto">
              La tua agenzia immobiliare di fiducia per vendita e affitto
            </p>
          </div>

            {/* CTA Card (più larga, più bassa, responsive) */}
            <div className="w-full max-w-screen-xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden">
                {/* Layout: 1 colonna su mobile, 2 colonne su desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* LEFT */}
                  <div className="lg:col-span-7 p-6 md:p-8">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                      <img
                        src="/Alessio.png"
                        alt="Alessio Ferrise - Ferrise Immobiliare"
                        className="w-16 h-16 md:w-18 md:h-18 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                      />

                      <div className="text-left">
                        <div className="text-xs font-bold tracking-wide text-blue-700 uppercase">
                          Ferrise Immobiliare
                        </div>
                        <div className="text-sm md:text-base font-semibold text-gray-900">
                          Consulenza e supporto dedicato
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Vendita • Affitto • Valutazioni • Assistenza completa
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 text-center lg:text-left">
                      Esplora le Nostre Proposte
                    </h2>

                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5 text-center lg:text-left">
                      Scopri il catalogo completo di immobili in vendita e affitto. Filtri avanzati e supporto
                      professionale in ogni fase.
                    </p>

                    {/* Stats più compatti */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="rounded-xl bg-blue-50 px-3 py-3 text-center">
                        <div className="text-lg md:text-xl font-extrabold text-blue-700">50+</div>
                        <div className="text-[11px] md:text-xs text-gray-600">Proprietà</div>
                      </div>
                      <div className="rounded-xl bg-green-50 px-3 py-3 text-center">
                        <div className="text-lg md:text-xl font-extrabold text-green-700">15+</div>
                        <div className="text-[11px] md:text-xs text-gray-600">Esperienza</div>
                      </div>
                      <div className="rounded-xl bg-yellow-50 px-3 py-3 text-center">
                        <div className="text-lg md:text-xl font-extrabold text-yellow-700">100%</div>
                        <div className="text-[11px] md:text-xs text-gray-600">Clienti</div>
                      </div>
                    </div>

                    {/* CTA */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          onClick={() => navigateTop('properties')}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg flex items-center justify-center group"
                        >
                          <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                          Esplora
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => navigateTop('sell')}
                          className="bg-white border-2 border-blue-600 text-blue-700 px-5 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-semibold flex items-center justify-center"
                        >
                          <HomeIcon className="w-5 h-5 mr-2" />
                          Vendi
                        </button>

                        <button
                          onClick={() => navigateTop('contact')}
                          className="border-2 border-blue-600/40 text-blue-800 px-5 py-3 rounded-xl hover:bg-blue-50 transition-all font-semibold flex items-center justify-center"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          Contatti
                        </button>
                      </div>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden>🏠</span> <span>Vendita</span>
                          </span>

                          <span className="hidden sm:inline text-gray-300">•</span>

                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden>🏢</span> <span>Affitto</span>
                          </span>

                          <span className="hidden sm:inline text-gray-300">•</span>

                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden>💼</span> <span>Consulenza</span>
                          </span>

                          <span className="hidden sm:inline text-gray-300">•</span>

                          <span className="inline-flex items-center gap-2">
                            <span aria-hidden>📊</span> <span>Valutazioni Gratuite</span>
                          </span>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-blue-800 to-blue-950 text-white p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold tracking-wide text-blue-100 uppercase mb-2">
                          In evidenza
                        </div>
                        <h3 className="text-xl md:text-2xl font-extrabold leading-snug mb-3">
                          Valutazione gratuita <br className="hidden md:block" />
                          e strategia su misura
                        </h3>
                        <p className="text-sm text-blue-100 leading-relaxed">
                          Analisi di mercato locale, piano marketing e gestione trattativa per vendere bene e serenamente.
                        </p>

                        <div className="mt-5 space-y-3">
                          <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3">
                            <div className="text-sm font-semibold">Esperienza reale</div>
                            <div className="text-xs text-blue-100">Supporto in ogni fase</div>
                          </div>
                          <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3">
                            <div className="text-sm font-semibold">Tempi chiari</div>
                            <div className="text-xs text-blue-100">Piano d’azione concreto</div>
                          </div>
                          <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3">
                            <div className="text-sm font-semibold">Contatto diretto</div>
                            <div className="text-xs text-blue-100">Ti richiamiamo noi</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => navigateTop('sell')}
                          className="w-full bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors font-extrabold inline-flex items-center justify-center"
                        >
                          Richiedi valutazione
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </button>

                        <div className="mt-2 text-[11px] text-blue-100 text-center">
                          Risposta rapida • Nessun impegno • Preventivo gratuito
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-14 md:py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Proprietà in Evidenza
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Scopri le migliori opportunità immobiliari selezionate per te
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {featuredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {featuredProperties.map((property) => (
                    <article
                      key={property.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group"
                      onClick={() => onNavigate('property-detail', property.id)}
                    >
                      {property.images && property.images.length > 0 ? (
                        <div className="relative overflow-hidden">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-52 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                property.listing_type === 'vendita'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {property.listing_type === 'vendita' ? 'Vendita' : 'Affitto'}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Star className="w-6 h-6 text-yellow-400 fill-current drop-shadow-sm" />
                          </div>
                          {property.images.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                              +{property.images.length - 1} foto
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-52 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Building className="w-12 h-12 text-gray-400" />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {property.title}
                        </h3>

                        {property.price ? (
                          <p className="text-2xl font-extrabold text-blue-600 mb-3">
                            €{property.price.toLocaleString()}
                            {property.listing_type === 'affitto' && (
                              <span className="text-base font-semibold text-gray-600">/mese</span>
                            )}
                          </p>
                        ) : (
                          <p className="text-gray-500 mb-3">Prezzo su richiesta</p>
                        )}

                        {(property.city || property.province) && (
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm truncate">
                              {property.city}
                              {property.city && property.province && ', '}
                              {property.province}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            {property.created_at ? new Date(property.created_at).toLocaleDateString('it-IT') : ''}
                          </span>
                          <div className="inline-flex items-center text-blue-700 font-semibold">
                            Dettagli
                            <ChevronRight className="w-5 h-5 ml-1 text-blue-700" />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 bg-gray-50 rounded-2xl border border-gray-100">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">Nessuna proprietà in evidenza</h3>
                  <p className="text-gray-600 mb-6">
                    Al momento non ci sono proprietà selezionate come “in evidenza”.
                  </p>
                  <button
                    onClick={() => onNavigate('properties')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Esplora Tutte le Proprietà
                  </button>
                </div>
              )}
            </>
          )}

          {featuredProperties.length > 0 && (
            <div className="text-center mt-10 md:mt-12">
              <button
                onClick={() => onNavigate('properties')}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
              >
                Vedi Tutte le Proprietà
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FREE VALUATION */}
      <section className="py-14 md:py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-yellow-700 text-sm font-extrabold mb-3 tracking-wide">
                VALUTAZIONE GRATUITA
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5">
                Scopri il Valore del Tuo Immobile
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-7">
                Ottieni una valutazione professionale e gratuita. Analizziamo il mercato locale per una stima
                realistica e aggiornata.
              </p>

              <div className="space-y-4 mb-8">
                <Bullet title="Analisi di Mercato" desc="Studio dei prezzi reali nella tua zona" />
                <Bullet title="Valutazione Professionale" desc="Esperienza e metodo, senza promesse irrealistiche" />
                <Bullet title="Nessun Impegno" desc="Servizio gratuito e senza vincoli" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigateTop('sell')}
                  className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-2xl hover:bg-yellow-400 transition-colors font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Richiedi Valutazione Gratuita
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="border-2 border-yellow-500 text-yellow-700 px-8 py-4 rounded-2xl hover:bg-yellow-500 hover:text-gray-900 transition-colors font-bold"
                >
                  Maggiori Informazioni
                </button>
              </div>
            </div>

            <div className="lg:pl-6">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-white/60">
                <div className="relative h-56 md:h-64">
                  <img
                    src="https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"
                    alt="Valutazione immobile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-sm font-semibold tracking-wide">VENDI BENE, VENDI SERENO</div>
                    <div className="text-xl md:text-2xl font-extrabold mt-1">
                      Strategia + Marketing + Trattativa
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MiniStat icon={<Award className="w-5 h-5 text-blue-600" />} title="Esperienza" desc="Supporto dedicato" />
                    <MiniStat icon={<Clock className="w-5 h-5 text-green-600" />} title="Tempi" desc="Piano d’azione" />
                    <MiniStat icon={<Phone className="w-5 h-5 text-yellow-700" />} title="Contatto" desc="Ti richiamiamo noi" />
                  </div>

                  <button
                    onClick={() => navigateTop('sell')}
                    className="mt-6 w-full bg-blue-600 text-white px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-colors font-extrabold inline-flex items-center justify-center"
                  >
                    Vai alla pagina “Vendi immobile”
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              I NOSTRI SERVIZI
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Un supporto completo, dall’inizio alla firma
            </h2>
            <p className="mt-3 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Strategie, consulenza e gestione pratica per vendere, affittare o acquistare con serenità.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <ServiceCard
              icon={<KeyRound className="w-6 h-6 text-blue-700" />}
              title="Vendita Immobili"
              desc="Valutazione realistica, marketing mirato e trattativa seguita passo dopo passo."
              cta="Vai a Vendi immobile"
              onClick={() => navigateTop('sell')}
            />

            <ServiceCard
              icon={<Handshake className="w-6 h-6 text-emerald-700" />}
              title="Affitti"
              desc="Selezione, contratti, gestione e assistenza continua per proprietari e inquilini."
              cta="Esplora le Proprietà"
              onClick={() => onNavigate('properties')}
            />

            <ServiceCard
              icon={<ShieldCheck className="w-6 h-6 text-amber-700" />}
              title="Consulenza"
              desc="Supporto su documenti, pratiche e strategie per massimizzare valore e tempi."
              cta="Contattaci"
              onClick={() => onNavigate('contact')}
            />
          </div>

          <div className="mt-10 md:mt-12">
            <div className="mx-auto h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

/* --- Helpers --- */

function Bullet({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start">
      <div className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
        <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-700">{desc}</p>
      </div>
    </div>
  );
}

function MiniStat({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-600">{desc}</div>
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  cta = 'Scopri di più',
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta?: string;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className="group relative overflow-hidden rounded-2xl bg-white p-7 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* glow hover */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-blue-100/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="h-14 w-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-[1.03] transition-transform">
            {icon}
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600 leading-relaxed">{desc}</p>

          {/* CTA */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // così il click resta pulito
              onClick();
            }}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            {cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* linea elegante */}
      <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}

function StatPill({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: 'blue' | 'green' | 'yellow';
}) {
  const toneClasses =
    tone === 'blue'
      ? 'bg-blue-50 text-blue-700'
      : tone === 'green'
      ? 'bg-green-50 text-green-700'
      : 'bg-yellow-50 text-yellow-700';

  return (
    <div className={`rounded-2xl px-4 py-3 text-center ${toneClasses}`}>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-sm font-semibold">{label}</div>
    </div>
  );
}

function InfoRow({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
      <div className="mt-0.5 text-white/95">{icon}</div>
      <div>
        <div className="font-extrabold leading-tight">{title}</div>
        <div className="text-sm text-blue-100/90">{desc}</div>
      </div>
    </div>
  );
}
