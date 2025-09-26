import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Building, Euro, Bed, Bath, Square, Zap, Star, Phone, Mail, Calendar, Menu, X, Share2, Facebook } from 'lucide-react';
import { supabase, Property } from '../lib/supabase';
import emailjs from 'emailjs-com';
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
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    if (!propertyId) return;
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Per favore compila tutti i campi obbligatori');
      return;
    }

    try {
      // Prepare email data for EmailJS
      const emailData = {
        user_name: contactForm.name,
        user_email: contactForm.email,
        user_phone: contactForm.phone || 'Non fornito',
        request_type: `Interesse per proprietà: ${property?.title}`,
        message: `Interesse per: ${property?.title}\n\nID Proprietà: ${propertyId}\n\n${contactForm.message}`,
        property_id: propertyId || 'N/A'
      };

      // Send email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      alert('Messaggio inviato con successo! Ti contatteremo presto.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setShowContactForm(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Errore nell\'invio del messaggio. Riprova più tardi.');
    }
  };

  const shareProperty = (platform: 'facebook' | 'whatsapp' | 'email') => {
    const propertyUrl = `${window.location.origin}/property/${propertyId}`;
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
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + propertyUrl)}`);
        break;
    }
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Proprietà non trovata</h2>
          <button 
            onClick={() => onNavigate('properties')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Torna alle Proprietà
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
                onClick={() => onNavigate('properties')}
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
                  className="text-blue-600 px-3 py-2 text-sm font-medium"
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
                  className="text-blue-600 px-3 py-2 text-base font-medium text-left"
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
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {property.images && property.images.length > 0 && (
              <div className="mb-8">
                <div className="relative">
                  <img 
                    src={property.images[currentImageIndex]} 
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  {property.is_featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        In Evidenza
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.listing_type === 'vendita' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.listing_type === 'vendita' ? 'Vendita' : 'Affitto'}
                    </span>
                  </div>
                </div>
                
                {property.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${property.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
                
                {(property.city || property.province) && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">
                      {property.city}{property.city && property.province && ', '}{property.province}
                    </span>
                  </div>
                )}

                {property.price && (
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-600">
                      €{property.price.toLocaleString()}
                    </span>
                    {property.listing_type === 'affitto' && (
                      <span className="text-xl text-gray-600 ml-2">/mese</span>
                    )}
                  </div>
                )}
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {property.rooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.rooms}</div>
                    <div className="text-sm text-gray-600">Vani</div>
                  </div>
                )}
                
                {property.bathrooms && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bagni</div>
                  </div>
                )}
                
                {property.square_meters && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Square className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.square_meters}</div>
                    <div className="text-sm text-gray-600">m²</div>
                  </div>
                )}
                
                {property.energy_class && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{property.energy_class}</div>
                    <div className="text-sm text-gray-600">Classe Energetica</div>
                  </div>
                )}
              </div>

              {/* Property Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {property.property_type && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    <Building className="w-4 h-4 inline mr-1" />
                    {property.property_type}
                  </span>
                )}
                {property.features && property.features.split(',').map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {feature.trim()}
                  </span>
                ))}
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Descrizione</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-24">
              <div className="text-center mb-6">
                <img 
                  src="/Alessio.png" 
                  alt="Alessio - Agente Immobiliare" 
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900">Alessio</h3>
                <p className="text-gray-600">Agente Immobiliare</p>
              </div>

              <div className="space-y-4 mb-6">
                <a 
                  href="tel:+393934739758"
                  className="flex items-center justify-center w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Chiama Ora
                </a>
                
                <button
                  onClick={() => setShowContactForm(true)}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Invia Messaggio
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center justify-center w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Condividi Annuncio
                  </button>
                  
                  {showShareMenu && (
                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => shareProperty('facebook')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                        >
                          <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                          Facebook
                        </button>
                        <button
                          onClick={() => shareProperty('whatsapp')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                        >
                          <span className="mr-3 text-green-600">📱</span>
                          WhatsApp
                        </button>
                        <button
                          onClick={() => shareProperty('email')}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Mail className="h-4 w-4 mr-3 text-gray-600" />
                          Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  Pubblicato il {new Date(property.created_at!).toLocaleDateString()}
                </div>
                <p>Risposta garantita entro 24h</p>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Proprietà</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Codice:</span>
                  <span className="font-medium">#{property.id?.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{property.listing_type === 'vendita' ? 'Vendita' : 'Affitto'}</span>
                </div>
                {property.property_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-medium">{property.property_type}</span>
                  </div>
                )}
                {property.energy_class && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classe Energetica:</span>
                    <span className="font-medium">{property.energy_class}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Aggiornato:</span>
                  <span className="font-medium">
                    {new Date(property.updated_at || property.created_at!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contatta l'Agente</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Messaggio *</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sono interessato a questa proprietà..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Invia Messaggio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
}