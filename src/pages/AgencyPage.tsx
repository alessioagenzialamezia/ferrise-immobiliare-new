import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Target, 
  TrendingUp,
  ArrowRight,
  Building,
  MapPin,
  Clock,
  Phone,
  Mail,
  Menu,
  X
} from 'lucide-react';
import Footer from '../components/Footer';

interface AgencyPageProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function AgencyPage({ onNavigate }: AgencyPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const timeline = [
    {
      year: '2020',
      title: 'Fondazione',
      description: 'Alessio Ferrise fonda Ferrise Immobiliare a Lamezia Terme, con la missione di offrire un servizio immobiliare di qualità.',
      icon: Building,
    },
    {
      year: '2021',
      title: 'Espansione',
      description: 'L\'agenzia amplia il proprio team e inizia a operare in tutta la regione Calabria.',
      icon: TrendingUp,
    },
    {
      year: '2022',
      title: 'Nuova Sede',
      description: 'Trasferimento nella nuova e attuale sede di Via Piave 69, più ampia e accogliente.',
      icon: MapPin,
    },
    {
      year: '2024',
      title: 'Servizi Digitali',
      description: 'Introduzione di nuovi servizi digitali, tra cui tour virtuali e consulenze online.',
      icon: Target,
    },
    {
      year: '2025',
      title: 'Copertura Nazionale',
      description: 'Ferrise Immobiliare estende i propri servizi a tutto il territorio nazionale, grazie a una rete di collaboratori fidati.',
      icon: Calendar,
    },
  ];

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
              <button className="text-blue-600 px-3 py-2 text-sm font-medium">
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
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors text-left"
                >
                  Proprietà
                </button>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-600 px-3 py-2 text-base font-medium text-left"
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

      {/* Hero Section */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              La Nostra Agenzia
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Scopri la storia, i servizi e l'approccio di Ferrise Immobiliare
            </p>
          </div>
        </div>
      </section>

      {/* History & Timeline */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="text-yellow-600 text-sm font-medium mb-3">LA NOSTRA STORIA</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                Un percorso di crescita e successo
              </h2>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                Dal 2020, Ferrise Immobiliare è sinonimo di professionalità nel mercato immobiliare. 
                Fondata da Alessio Ferrise a Lamezia Terme, l'agenzia è cresciuta fino a diventare un punto di riferimento 
                non solo a Lamezia Terme, ma in tutta la Calabria.
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                Nel corso degli anni, abbiamo ampliato il nostro team con professionisti qualificati, 
                espandendo al contempo la gamma dei servizi offerti per rispondere alle esigenze di un mercato in costante evoluzione.
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-8">
                La nostra crescita è stata guidata dalla soddisfazione dei clienti e dalla capacità di adattarci ai cambiamenti del mercato, 
                mantenendo sempre i nostri valori fondamentali: professionalità, trasparenza e attenzione al cliente.
              </p>
              
              {/* Sezione Alessio Ferrise */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <img 
                      src="/Alessio.png" 
                      alt="Alessio Ferrise - Fondatore Ferrise Immobiliare"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Alessio Ferrise</h3>
                    <p className="text-blue-600 font-medium mb-3">Fondatore & CEO</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Con oltre 15 anni di esperienza nel settore immobiliare, Alessio ha costruito 
                      Ferrise Immobiliare basandosi sui principi di fiducia, competenza e risultati concreti. 
                      La sua passione per il settore e l'attenzione ai dettagli hanno reso l'agenzia 
                      un punto di riferimento nel territorio calabrese.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm mb-8">
                <CheckCircle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                <p className="italic text-blue-700">
                  "La nostra storia è fatta di relazioni, di fiducia costruita nel tempo e di sogni realizzati."
                </p>
              </div>
              
              <button
                onClick={() => onNavigate('contact')}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Conosci il Nostro Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Circle indicator */}
                    <div className="absolute -left-8 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm ml-2">
                      <div className="text-yellow-600 font-bold text-lg mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-blue-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Information with Images */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">La Nostra Sede</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vieni a trovarci nella nostra accogliente agenzia a Lamezia Terme. Uffici moderni e professionali per offrirti il miglior servizio.
            </p>
          </div>
          
          {/* Gallery Principale */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Immagine principale - Interno ufficio */}
            <div className="lg:col-span-2 lg:row-span-2">
              <div className="rounded-xl overflow-hidden h-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <img 
                  src="/agenzia1 copy.jpg" 
                  alt="Interno ufficio principale - Ferrise Immobiliare"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Vetrina esterna */}
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden h-64 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <img 
                  src="/agenzia2.jpg" 
                  alt="Vetrina esterna agenzia - CONSIMM"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Vetrina con annunci */}
            <div>
              <div className="rounded-xl overflow-hidden h-64 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <img 
                  src="/agenzia3 copy.jpg" 
                  alt="Vetrina con annunci immobiliari"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Secondo interno ufficio */}
            <div>
              <div className="rounded-xl overflow-hidden h-64 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <img 
                  src="/agenzia4 copy.jpg" 
                  alt="Secondo interno ufficio con postazioni"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Informazioni e Mappa */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Informazioni Utili
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Indirizzo</h4>
                    <p className="text-gray-600">Via Piave 69, 88046 Lamezia Terme (CZ)</p>
                    <p className="text-sm text-gray-500 mt-1">Facilmente raggiungibile dal centro città</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Orari di Apertura</h4>
                    <div className="text-gray-600 space-y-1">
                      <p><span className="font-medium">Lun - Ven:</span> 9:00 - 19:30</p>
                      <p><span className="font-medium">Sabato:</span> 9:00 - 12:00</p>
                      <p><span className="font-medium">Domenica:</span> Chiuso</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Appuntamenti anche fuori orario su richiesta</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Contatti Diretti</h4>
                    <p className="text-gray-600 mb-1">
                      <a href="tel:+393473975804" className="hover:text-blue-600 transition-colors font-medium">
                        +39 347 397 5804
                      </a>
                    </p>
                    <p className="text-gray-600 mb-2">
                      <a href="mailto:alessioferrisecasaemutui@gmail.com" className="hover:text-blue-600 transition-colors text-sm">
                        alessioferrisecasaemutui@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">WhatsApp disponibile</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Come Raggiungerci
              </h3>
              <p className="text-gray-600 mb-6">
                La nostra sede è situata in una posizione strategica nel centro di Lamezia Terme, 
                facilmente raggiungibile sia in auto che con i mezzi pubblici. Disponiamo di parcheggio nelle vicinanze.
              </p>
              
              <div className="h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.1518803944636!2d16.304562775878184!3d38.96738834772422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d308bc2a795ebf%3A0xc1602f029da1d9ee!2sVia%20Piave%2C%2069%2C%2088046%20Lamezia%20Terme%20CZ%2C%20Italy!5e0!3m2!1sit!2sit!4v1735746123456!5m2!1sit!2sit"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa Ferrise Immobiliare - Via Piave 69, Lamezia Terme"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Inizia il Tuo Percorso Immobiliare
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Che tu stia cercando casa, vendendo un immobile o necessiti di una consulenza, 
              siamo qui per trasformare i tuoi progetti in realtà.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => onNavigate('properties')}
                className="bg-yellow-500 text-blue-900 py-3 px-8 rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                🏠 Esplora le Proprietà
              </button>
              <button 
                onClick={() => onNavigate('contact')}
                className="bg-white text-blue-800 hover:bg-gray-100 py-3 px-8 rounded-lg transition-all transform hover:scale-105 font-semibold shadow-lg"
              >
                📞 Contattaci Ora
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}