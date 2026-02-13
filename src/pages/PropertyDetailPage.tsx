import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Building,
  Bed,
  Bath,
  Square,
  Zap,
  Star,
  Phone,
  Mail,
  Calendar,
  Menu,
  X,
  Share2,
  Facebook,
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
} from 'lucide-react';
import { supabase, Property } from '../lib/supabase';
import emailjs from '@emailjs/browser';
import Footer from '../components/Footer';

interface PropertyDetailPageProps {
  propertyId: string | null;
  onNavigate: (view: string, id?: string) => void;
}

export default function PropertyDetailPage({ propertyId, onNavigate }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // sempre top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const fetchProperty = async () => {
    if (!propertyId) return;

    try {
      const sb = supabase;
      if (!sb) {
        console.warn('Supabase client not initialized');
        setProperty(null);
        return;
      }

      const { data, error } = await sb.from('properties').select('*').eq('id', propertyId).single();

      if (error) throw error;
      setProperty(data);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const images = useMemo(() => (property?.images && property.images.length > 0 ? property.images : []), [property?.images]);

  const propertyUrl = useMemo(() => {
    if (!propertyId) return '';
    return `${window.location.origin}#property-detail/${propertyId}`;
  }, [propertyId]);

  const featuresList = useMemo(() => {
    const raw = property?.features || '';
    if (!raw) return [];
    return raw
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)
      .slice(0, 18);
  }, [property?.features]);

  const isRent = property?.listing_type === 'affitto';

  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const shareProperty = (platform: 'facebook' | 'whatsapp' | 'email') => {
    const title = property?.title || '';
    const description = property?.description || '';
    const price = property?.price ? `€${property.price.toLocaleString()}` : '';
    const location = [property?.city, property?.province].filter(Boolean).join(', ');
    const shareText = `🏠 ${title}\n💰 ${price}\n📍 ${location}\n\n${description}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + propertyUrl)}`);
        break;
      case 'email':
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + propertyUrl)}`
        );
        break;
    }
    setShowShareMenu(false);
  };

  const openEmailShare = () => {
    const url = `${window.location.origin}#property-detail/${propertyId}`;
    const title = property?.title || 'Annuncio';
    const price = property?.price ? `€${property.price.toLocaleString()}` : '';
    const location = [property?.city, property?.province].filter(Boolean).join(', ');

    const subject = `Ferrise Immobiliare - ${title}`;
    const body = `Ciao!

  Ti condivido questa proprietà dal sito Ferrise Immobiliare:

  🏠 ${title}
  💰 ${price}
  📍 ${location}

  Link:
  ${url}

  Buona giornata!`;

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Per favore compila tutti i campi obbligatori');
      return;
    }

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_PROPERTY_SERVICE_ID as string | undefined;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_PROPERTY_ID as string | undefined;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PROPERTY_PUBLIC_KEY as string | undefined;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error('EmailJS env mancanti:', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
      alert('❌ Configurazione email non valida. Contatta l’amministratore del sito.');
      return;
    }

    try {
      const propertyUrl = `${window.location.origin}#property-detail/${propertyId}`;

      const templateParams = {
        user_name: contactForm.name,
        user_email: contactForm.email,
        user_phone: contactForm.phone || 'Non fornito',
        property_title: property?.title || '',
        property_id: propertyId || '',
        property_url: propertyUrl,
        message: contactForm.message,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      alert('✅ Messaggio inviato con successo! Ti contatteremo presto.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setShowContactForm(false);
    } catch (err: any) {
      console.error('EmailJS error:', err);

      // Se EmailJS restituisce dettagli, spesso stanno in err.text o err.message
      const msg = err?.text || err?.message || 'Errore sconosciuto';
      alert(`❌ Errore nell'invio del messaggio: ${msg}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => onNavigate('properties')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Torna alle proprietà"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={() => onNavigate('home')} className="flex items-center" aria-label="Vai alla home">
                  <img src="/logoalessio.png" alt="Ferrise Immobiliare" className="h-10 w-auto hover:opacity-80 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-lg w-full">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Proprietà non trovata</h2>
            <p className="text-gray-600 mb-6">L’annuncio potrebbe non essere più disponibile.</p>
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Torna alle Proprietà
            </button>
          </div>
        </div>

        <Footer onNavigate={onNavigate} showAdminButton={true} />
      </div>
    );
  }

  const createdDate = property.created_at ? new Date(property.created_at) : null;
  const updatedDate = new Date(property.updated_at || property.created_at || Date.now());

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate('properties')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Torna alle proprietà"
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
                className="text-blue-600 px-3 py-2 text-sm font-medium"
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
              <button
                onClick={() => onNavigate('blog')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
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
                  className="text-blue-600 px-3 py-2 text-base font-semibold text-left"
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
                  onClick={() => {
                    onNavigate('blog');
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
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

      {/* Content */}
      <main className="flex-1">
        {/* Utility bar */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-4">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => onNavigate('properties')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna alle proprietà
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    property.listing_type === 'vendita' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {property.listing_type === 'vendita' ? 'Vendita' : 'Affitto'}
                </span>

                {property.is_featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-yellow-100 text-yellow-800">
                    <Star className="w-4 h-4 fill-current" />
                    In evidenza
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-8">
              {/* Gallery */}
              {images.length > 0 ? (
                <div className="mb-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                    <div className="relative">
                      <img
                        src={images[currentImageIndex]}
                        alt={property.title}
                        className="w-full h-[380px] sm:h-[460px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={prevImage}
                            aria-label="Immagine precedente"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                          </button>
                          <button
                            type="button"
                            onClick={nextImage}
                            aria-label="Immagine successiva"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                          </button>

                          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/55 text-white text-xs font-semibold">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {images.length > 1 && (
                      <div className="p-4 border-t border-gray-100 bg-white">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                currentImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                              }`}
                              aria-label={`Vai alla foto ${index + 1}`}
                              type="button"
                            >
                              <img src={image} alt={`${property.title} - ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                  <Building className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                  <div className="text-gray-700 font-semibold">Nessuna foto disponibile</div>
                </div>
              )}

              {/* Title + price */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{property.title}</h1>

                  {(property.city || property.province) && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="text-base md:text-lg">
                        {property.city}
                        {property.city && property.province && ', '}
                        {property.province}
                      </span>
                    </div>
                  )}

                  {property.price && (
                    <div className="flex items-end gap-2">
                      <div className="text-4xl font-extrabold text-blue-700">€{property.price.toLocaleString()}</div>
                      {isRent && <div className="text-lg text-gray-500 font-semibold">/mese</div>}
                    </div>
                  )}
                </div>

                {/* quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                  {property.rooms ? (
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                      <Bed className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-extrabold text-gray-900">{property.rooms}</div>
                      <div className="text-xs font-semibold text-gray-600">Vani</div>
                    </div>
                  ) : null}

                  {property.bathrooms ? (
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                      <Bath className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-extrabold text-gray-900">{property.bathrooms}</div>
                      <div className="text-xs font-semibold text-gray-600">Bagni</div>
                    </div>
                  ) : null}

                  {property.square_meters ? (
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                      <Square className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-extrabold text-gray-900">{property.square_meters}</div>
                      <div className="text-xs font-semibold text-gray-600">m²</div>
                    </div>
                  ) : null}

                  {property.energy_class ? (
                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                      <Zap className="w-7 h-7 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-extrabold text-gray-900">{property.energy_class}</div>
                      <div className="text-xs font-semibold text-gray-600">Classe</div>
                    </div>
                  ) : null}
                </div>

                {/* tags */}
                <div className="flex flex-wrap gap-2 mt-8">
                  {property.property_type && (
                    <span className="px-3 py-1.5 bg-purple-50 text-purple-800 text-sm rounded-full font-semibold border border-purple-100 inline-flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {property.property_type}
                    </span>
                  )}
                  {featuresList.map((feature, index) => (
                    <span
                      key={`${feature}-${index}`}
                      className="px-3 py-1.5 bg-blue-50 text-blue-800 text-sm rounded-full font-semibold border border-blue-100"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-4">Descrizione</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4">
              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="/Alessio.png"
                    alt="Alessio Ferrise"
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
                  />
                  <div className="min-w-0">
                    <div className="text-lg font-extrabold text-gray-900 leading-tight">Alessio Ferrise</div>
                    <div className="text-sm text-gray-600 font-semibold">Consulente immobiliare</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-5">
                  <a
                    href="tel:+393473975804"
                    className="inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-white font-extrabold hover:bg-green-700 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Chiama ora
                  </a>

                  <a
                    href="https://wa.me/393473975804"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-green-50 px-4 py-3 text-green-800 font-extrabold hover:bg-green-100 transition-all duration-300 border border-green-100"
                  >
                    <span className="mr-2">📱</span>
                    WhatsApp
                  </a>

                  <button
                    onClick={() => setShowContactForm(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white font-extrabold hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Invia messaggio
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu((v) => !v)}
                      className="inline-flex items-center justify-center w-full rounded-xl bg-gray-900 px-4 py-3 text-white font-extrabold hover:bg-black transition-colors"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Condividi annuncio
                    </button>

                    {showShareMenu && (
                      <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                        <button
                          onClick={() => shareProperty('facebook')}
                          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50"
                        >
                          <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                          Facebook
                        </button>
                        <button
                          onClick={() => shareProperty('whatsapp')}
                          className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50"
                        >
                          <span className="mr-3 text-green-600">📱</span>
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={openEmailShare}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Mail className="h-4 w-4 mr-3 text-gray-600" />
                          Email
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                    <div className="flex items-center text-sm text-gray-700 font-semibold">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      {createdDate ? `Pubblicato il ${createdDate.toLocaleDateString('it-IT')}` : 'Data non disponibile'}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Risposta garantita entro 24h</div>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                <h3 className="text-base font-extrabold text-gray-900 mb-4">Informazioni annuncio</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600 font-semibold">Codice:</span>
                    <span className="font-extrabold text-gray-900">#{property.id?.slice(-8).toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600 font-semibold">Tipo:</span>
                    <span className="font-extrabold text-gray-900">{isRent ? 'Affitto' : 'Vendita'}</span>
                  </div>

                  {property.property_type && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 font-semibold">Categoria:</span>
                      <span className="font-extrabold text-gray-900">{property.property_type}</span>
                    </div>
                  )}

                  {property.energy_class && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-600 font-semibold">Classe energetica:</span>
                      <span className="font-extrabold text-gray-900">{property.energy_class}</span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600 font-semibold">Aggiornato:</span>
                    <span className="font-extrabold text-gray-900">{updatedDate.toLocaleDateString('it-IT')}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => onNavigate('sell')}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-blue-900 font-extrabold border border-blue-100 hover:bg-blue-50 transition-colors"
                  >
                    <HomeIcon className="w-5 h-5 mr-2" />
                    Vuoi vendere con noi?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Contatta l’agente</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Ti ricontattiamo al più presto.</p>
                </div>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
                  aria-label="Chiudi"
                  type="button"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="p-5">
                <div className="mb-4 rounded-xl bg-gray-50 border border-gray-100 p-3">
                  <div className="text-xs text-gray-600 font-semibold">Riferimento annuncio</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5 line-clamp-2">{property.title}</div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nome *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Telefono</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Messaggio *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sono interessato a questa proprietà..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-extrabold"
                    >
                      Invia messaggio
                    </button>
                  </div>
                </form>

                <div className="mt-4 text-xs text-gray-500">
                  Inviando accetti di essere ricontattato da Ferrise Immobiliare in merito a questa richiesta.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} showAdminButton={true} />
    </div>
  );
}
