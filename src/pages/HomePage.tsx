import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, Filter, ChevronRight, Star, Phone, Mail, Clock, Award, Euro, ChevronLeft, ChevronRight as ChevronRightIcon, Menu, X } from 'lucide-react';
import { supabase, Property } from '../lib/supabase';
import Footer from '../components/Footer';

interface HomePageProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'vendita' | 'affitto'>('vendita');
  const [searchForm, setSearchForm] = useState({
    location: '',
    propertyType: '',
    minPrice: 0,
    maxPrice: 0,
  });
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Immagini per il carousel di sfondo
  const backgroundImages = [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  ];

  useEffect(() => {
    fetchFeaturedProperties();
    
    // Auto-slide del carousel ogni 5 secondi
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      // Check if Supabase is properly configured
      if (!supabase) {
        console.warn('Supabase client not initialized');
        setFeaturedProperties([]);
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeaturedProperties(data || []);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      // Set empty array to prevent UI issues
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    try {
      // Crea un oggetto con i filtri di ricerca
      const searchFilters = {
        listingType: activeTab,
        location: searchForm.location.trim(),
        propertyType: searchForm.propertyType && searchForm.propertyType !== 'Tutti i tipi' ? searchForm.propertyType : '',
        minPrice: searchForm.minPrice > 0 ? searchForm.minPrice : 0,
        maxPrice: searchForm.maxPrice > 0 ? searchForm.maxPrice : 0
      };
      
      console.log('Saving search filters:', searchFilters);
      
      // Salva i filtri nel sessionStorage per passarli alla pagina proprietà
      sessionStorage.setItem('searchFilters', JSON.stringify(searchFilters));
      
      // Naviga alla pagina proprietà
      onNavigate('properties');
    } catch (error) {
      console.error('Error saving search filters:', error);
      // Fallback: naviga comunque alla pagina proprietà
      onNavigate('properties');
    }
  };

  // Debug: verifica che i filtri vengano salvati
  const handleSearchDebug = () => {
    console.log('Current search form:', searchForm);
    console.log('Active tab:', activeTab);
    handleSearch();
  };

  // Usa handleSearchDebug per il debug, poi torna a handleSearch
  const onSearchClick = () => {
    onNavigate('properties');
  };

  const propertyTypes = [
    'Tutti i tipi',
    'Appartamento',
    'Villa',
    'Casa',
    'Ufficio',
    'Terreno',
    'Deposito',
    'Altro'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
                className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
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
              <button 
                onClick={() => onNavigate('admin')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Admin
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
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
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
                <button 
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors text-left mx-3 mt-2"
                >
                  Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-700/60"></div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Trova la Casa dei Tuoi Sogni
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              La tua agenzia immobiliare di fiducia per vendita e affitto
            </p>
          </div>

          {/* Call to Action - Esplora Proprietà */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-white/20">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center mb-6">
                  <img 
                    src="/Alessio.png" 
                    alt="Alessio Ferrise - Ferris Immobiliare" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Esplora le Nostre Proposte
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Scopri il nostro catalogo completo di immobili in vendita e affitto. 
                  Utilizza i filtri avanzati per trovare la soluzione perfetta per te.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600">Proprietà Disponibili</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-green-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">15+</div>
                    <div className="text-sm text-gray-600">Anni di Esperienza</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">Soddisfazione Cliente</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('properties')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center justify-center text-lg group"
                >
                  <Search className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Esplora Tutte le Proprietà
                  <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => onNavigate('contact')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-semibold flex items-center justify-center text-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contattaci Subito
                </button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                🏠 Vendita • 🏢 Affitto • 💼 Consulenza • 📊 Valutazioni Gratuite
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Proprietà in Evidenza
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group"
                      onClick={() => onNavigate('property-detail', property.id)}
                    >
                      {property.images && property.images.length > 0 && (
                        <div className="relative overflow-hidden">
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              property.listing_type === 'vendita' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {property.listing_type === 'vendita' ? 'Vendita' : 'Affitto'}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Star className="w-6 h-6 text-yellow-400 fill-current drop-shadow-sm" />
                          </div>
                          {property.images.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                              +{property.images.length - 1} foto
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                        
                        {property.price && (
                          <p className="text-2xl font-bold text-blue-600 mb-3">
                            €{property.price.toLocaleString()}
                            {property.listing_type === 'affitto' && <span className="text-lg text-gray-600">/mese</span>}
                          </p>
                        )}
                        
                        {(property.city || property.province) && (
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="text-sm truncate">
                              {property.city}{property.city && property.province && ', '}{property.province}
                            </span>
                          </div>
                        )}
                        
                        {/* Property Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.property_type && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {property.property_type}
                            </span>
                          )}
                          {property.rooms && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {property.rooms} vani
                            </span>
                          )}
                          {property.bathrooms && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {property.bathrooms} bagni
                            </span>
                          )}
                          {property.square_meters && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              {property.square_meters} m²
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            {new Date(property.created_at!).toLocaleDateString('it-IT')}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessuna proprietà in evidenza</h3>
                  <p className="text-gray-600 mb-6">
                    Al momento non ci sono proprietà selezionate come "in evidenza"
                  </p>
                  <button 
                    onClick={() => onNavigate('properties')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Esplora Tutte le Proprietà
                  </button>
                </div>
              )}
            </>
          )}

          {featuredProperties.length > 0 && (
            <div className="text-center mt-12">
              <button 
                onClick={() => onNavigate('properties')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
              >
                Vedi Tutte le Proprietà
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Free Valuation Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-yellow-600 text-sm font-medium mb-3">VALUTAZIONE GRATUITA</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Scopri il Valore del Tuo Immobile
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Ottieni una valutazione professionale e gratuita del tuo immobile. 
                I nostri esperti analizzeranno il mercato locale per fornirti una stima accurata e aggiornata.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Analisi di Mercato Completa</h3>
                    <p className="text-gray-600">Studio approfondito dei prezzi nella tua zona</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Valutazione Professionale</h3>
                    <p className="text-gray-600">Esperti qualificati con anni di esperienza</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Nessun Impegno</h3>
                    <p className="text-gray-600">Servizio completamente gratuito e senza vincoli</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('contact')}
                  className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Richiedi Valutazione Gratuita
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="border-2 border-yellow-500 text-yellow-700 px-8 py-4 rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition-colors font-semibold"
                >
                  Maggiori Informazioni
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              I Nostri Servizi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Esperienza e professionalità al tuo servizio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vendita Immobili</h3>
              <p className="text-gray-600">
                Assistenza completa nella vendita del tuo immobile con valutazioni accurate e marketing mirato.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Affitti</h3>
              <p className="text-gray-600">
                Gestione completa degli affitti con contratti sicuri e assistenza continua.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Consulenza</h3>
              <p className="text-gray-600">
                Consulenza personalizzata per investimenti immobiliari e pratiche burocratiche.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}