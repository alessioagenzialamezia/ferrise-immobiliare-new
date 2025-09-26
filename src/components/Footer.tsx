import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  showAdminButton?: boolean;
}

export default function Footer({ onNavigate, showAdminButton = true }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <img 
                src="/logobiancoalessio.png" 
                alt="Ferris Immobiliare Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La tua agenzia immobiliare di fiducia a Lamezia Terme. Esperienza, professionalità 
              e risultati concreti per realizzare i tuoi progetti immobiliari con la massima 
              trasparenza e competenza.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/alessioferrisecasaemutui/?locale=it_IT"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group-hover:scale-110">
                  <img 
                    src="/face.webp" 
                    alt="Facebook" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </a>
              <a
                href="https://www.instagram.com/ferrisealessio/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group-hover:scale-110">
                  <img 
                    src="/insta.png" 
                    alt="Instagram" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">Link Rapidi</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="text-gray-300 hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 flex items-center"
                >
                  🏠 Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('agency')}
                  className="text-gray-300 hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 flex items-center"
                >
                  🏛️ Agenzia
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('properties')}
                  className="text-gray-300 hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 flex items-center"
                >
                  🏢 Proprietà
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('blog')}
                  className="text-gray-300 hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 flex items-center"
                >
                  📝 Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('faq')}
                  className="text-gray-300 hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 flex items-center"
                >
                  ❓ FAQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')}
                  className="text-gray-300 hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 flex items-center"
                >
                  📞 Contatti
                </button>
              </li>
              {showAdminButton && (
                <li>
                  <button 
                    onClick={() => onNavigate('admin')}
                    className="text-gray-300 hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 flex items-center text-sm"
                  >
                    🔐 Admin
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">Contatti</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mt-0.5 mr-3 text-yellow-400 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>Via Piave 69</p>
                  <p>88046 Lamezia Terme (CZ)</p>
                  <p>Calabria, Italia</p>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a 
                    href="tel:+393934739758" 
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    393 473 975 804
                  </a>
                  <p className="text-sm text-gray-400">WhatsApp disponibile</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a 
                    href="mailto:alessioferrisecasaemutui@gmail.com" 
                    className="text-gray-300 hover:text-yellow-400 transition-colors break-all"
                  >
                    alessioferrisecasaemutui@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="md:col-span-3">
            <h3 className="text-yellow-400 text-lg font-semibold mb-4">Orari di Apertura</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Lunedì - Venerdì</p>
                  <p className="text-gray-300">9:00 - 19:30</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Sabato</p>
                  <p className="text-gray-300">9:00 - 12:00</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Domenica</p>
                  <p className="text-gray-300">Chiuso</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Ferrise Immobiliare - Alessio Ferrise. Tutti i diritti riservati.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                REA CZ 211940 | Agenzia Immobiliare Autorizzata
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span className="text-gray-500">
                Sito web professionale per servizi immobiliari
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}