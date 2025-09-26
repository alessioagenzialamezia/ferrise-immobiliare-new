import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, Clock, Menu, X, MapPin } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <button className="text-blue-600 px-3 py-2 text-sm font-medium">
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-600 px-3 py-2 text-base font-medium text-left"
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
              Contatti
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Siamo qui per rispondere a tutte le tue domande
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Come Contattarci
              </h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Indirizzo</h3>
                    <p className="text-gray-600">
                      Via Piave 69<br />
                      88046 Lamezia Terme (CZ)<br />
                      Calabria, Italia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Telefono & WhatsApp</h3>
                    <p className="text-gray-600">
                      <a 
                        href="https://wa.me/393473975804" 
                        className="hover:text-green-600 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        +39 347 397 5804
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a 
                        href="mailto:alessioferrisecasaemutui@gmail.com" 
                        className="hover:text-red-600 transition-colors break-all"
                      >
                        alessioferrisecasaemutui@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Orari di Apertura</h3>
                    <div className="text-gray-600 space-y-1">
                      <p><span className="font-medium">Lunedì - Venerdì:</span> 9:00 - 19:30</p>
                      <p><span className="font-medium">Sabato:</span> 9:00 - 12:00</p>
                      <p><span className="font-medium">Domenica:</span> Chiuso</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="h-80 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.1518803944636!2d16.304562775878184!3d38.96738834772422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d308bc2a795ebf%3A0xc1602f029da1d9ee!2sVia%20Piave%2C%2088046%20Lamezia%20Terme%20CZ!5e0!3m2!1sit!2sit!4v1688908724889!5m2!1sit!2sit" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa Ferrise Immobiliare"
                />
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
            <Footer onNavigate={onNavigate} showAdminButton={true} />
    </div>
  );
}