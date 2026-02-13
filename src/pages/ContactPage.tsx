import { useEffect } from 'react';
import { Phone, Mail, Clock, MapPin, Home as HomeIcon, ExternalLink } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import AppLayout from '../components/AppLayout';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  // ✅ quando entri in Contatti, vai sempre al top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <AppLayout onNavigate={onNavigate} showAdminButton={true}>
      {/* HERO */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Contatti</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Siamo qui per rispondere a tutte le tue domande.
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
                onClick={() => onNavigate('properties')}
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-blue-900 font-semibold hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Esplora Proprietà
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INFO + FORM */}
      <section className="py-14 md:py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-12">
            {/* INFO */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Come contattarci</h2>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  Puoi chiamarci, scriverci su WhatsApp o inviarci una mail. Ti rispondiamo il prima possibile.
                </p>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Indirizzo */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-gray-900">Indirizzo</div>
                      <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                        Via Piave 69<br />
                        88046 Lamezia Terme (CZ)<br />
                        Calabria, Italia
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telefono / WhatsApp */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-gray-900">Telefono & WhatsApp</div>
                      <a
                        href="https://wa.me/393473975804"
                        className="inline-flex items-center text-sm text-gray-700 mt-2 hover:text-green-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        +39 347 397 5804
                        <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
                      </a>
                      <div className="text-xs text-gray-500 mt-1">Clicca per aprire WhatsApp</div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-gray-900">Email</div>
                      <a
                        href="mailto:alessioferrisecasaemutui@gmail.com"
                        className="block text-sm text-gray-700 mt-2 hover:text-red-600 transition-colors break-words"
                      >
                        alessioferrisecasaemutui@gmail.com
                      </a>
                      <div className="text-xs text-gray-500 mt-1">Rispondiamo appena possibile</div>
                    </div>
                  </div>
                </div>

                {/* Orari */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-gray-900">Orari</div>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div>
                          <span className="font-semibold text-gray-900">Lun–Ven:</span> 9:00 – 19:30
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Sab:</span> 9:00 – 12:00
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Dom:</span> Chiuso
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mappa */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-gray-900">Dove siamo</div>
                    <div className="text-sm text-gray-600">Via Piave 69, Lamezia Terme</div>
                  </div>

                  <a
                    href="https://www.google.com/maps?q=Via+Piave+69,+88046+Lamezia+Terme+CZ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-extrabold text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                  >
                    Apri su Maps
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>

                <div className="h-80 bg-gray-200">
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
            </div>

            {/* FORM */}
            <div className="lg:pl-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">Scrivici un messaggio</h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">Compila il form: ti ricontattiamo al più presto.</p>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
