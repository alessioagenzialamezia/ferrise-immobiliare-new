import {
  Calendar,
  CheckCircle,
  Target,
  TrendingUp,
  ArrowRight,
  Building,
  MapPin,
  Clock,
  Phone,
  Home as HomeIcon,
} from 'lucide-react';
import AppLayout from '../components/AppLayout';

interface AgencyPageProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function AgencyPage({ onNavigate }: AgencyPageProps) {
  const timeline = [
    {
      year: '2020',
      title: 'Fondazione',
      description:
        'Alessio Ferrise fonda Ferrise Immobiliare a Lamezia Terme, con la missione di offrire un servizio immobiliare di qualità.',
      icon: Building,
    },
    {
      year: '2021',
      title: 'Espansione',
      description: "L'agenzia amplia il proprio team e inizia a operare in tutta la regione Calabria.",
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
      description:
        'Ferrise Immobiliare estende i propri servizi a tutto il territorio nazionale, grazie a una rete di collaboratori fidati.',
      icon: Calendar,
    },
  ];

  return (
    <AppLayout onNavigate={onNavigate} showAdminButton={true}>
      {/* Hero */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">La Nostra Agenzia</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Scopri la storia, i servizi e l&apos;approccio di Ferrise Immobiliare.
            </p>

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

      {/* History & Timeline */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
            {/* Left */}
            <div>
              <div className="text-yellow-600 text-sm font-semibold tracking-wider mb-3">LA NOSTRA STORIA</div>
              <h2 className="text-3xl font-extrabold text-blue-950 mb-6">Un percorso di crescita e successo</h2>

              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Dal 2020, Ferrise Immobiliare è sinonimo di professionalità nel mercato immobiliare. Fondata da Alessio
                  Ferrise a Lamezia Terme, l&apos;agenzia è cresciuta fino a diventare un punto di riferimento non solo a
                  Lamezia Terme, ma in tutta la Calabria.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Nel corso degli anni, abbiamo ampliato il nostro team con professionisti qualificati, espandendo al
                  contempo la gamma dei servizi offerti per rispondere alle esigenze di un mercato in costante evoluzione.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  La nostra crescita è stata guidata dalla soddisfazione dei clienti e dalla capacità di adattarci ai
                  cambiamenti del mercato, mantenendo sempre i nostri valori fondamentali: professionalità, trasparenza e
                  attenzione al cliente.
                </p>
              </div>

              {/* Alessio */}
              <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src="/Alessio.png"
                      alt="Alessio Ferrise - Fondatore Ferrise Immobiliare"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-blue-950 mb-1">Alessio Ferrise</h3>
                    <p className="text-blue-700 font-semibold mb-3">Fondatore &amp; CEO</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Con oltre 15 anni di esperienza nel settore immobiliare, Alessio ha costruito Ferrise Immobiliare
                      basandosi sui principi di fiducia, competenza e risultati concreti.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                <CheckCircle className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="italic text-blue-900 leading-relaxed">
                  &quot;La nostra storia è fatta di relazioni, di fiducia costruita nel tempo e di sogni realizzati.&quot;
                </p>
              </div>

              <button
                onClick={() => onNavigate('contact')}
                className="mt-8 inline-flex items-center bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                Conosci il Nostro Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Right Timeline */}
            <div className="relative">
              <div className="rounded-2xl bg-white border border-blue-100 shadow-sm p-6 md:p-8">
                <div className="relative pl-10">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-blue-200" />

                  <div className="space-y-8">
                    {timeline.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-2 top-1.5 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                          <item.icon className="w-4 h-4 text-white" />
                        </div>

                        <div className="ml-6 rounded-xl border border-gray-100 bg-gray-50/60 p-5 hover:bg-white hover:shadow-md transition-all duration-300">
                          <div className="text-yellow-600 font-extrabold text-lg">{item.year}</div>
                          <h3 className="text-lg font-extrabold text-blue-950 mt-1">{item.title}</h3>
                          <p className="text-gray-700 mt-2 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                Nota: i servizi evolvono nel tempo per offrire un&apos;esperienza sempre più completa.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">La Nostra Sede</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Vieni a trovarci nella nostra accogliente agenzia a Lamezia Terme. Uffici moderni e professionali per
              offrirti il miglior servizio.
            </p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="lg:col-span-2 lg:row-span-2">
              <div className="rounded-2xl overflow-hidden h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img
                  src="/agenzia1 copy.jpg"
                  alt="Interno ufficio principale - Ferrise Immobiliare"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden h-64 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="/agenzia2.jpg" alt="Vetrina esterna agenzia - CONSIMM" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <div className="rounded-2xl overflow-hidden h-64 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img src="/agenzia3 copy.jpg" alt="Vetrina con annunci immobiliari" className="w-full h-full object-cover" />
              </div>
            </div>

            <div>
              <div className="rounded-2xl overflow-hidden h-64 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img
                  src="/agenzia4 copy.jpg"
                  alt="Secondo interno ufficio con postazioni"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Info + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-12">
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Informazioni Utili</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Indirizzo</h4>
                    <p className="text-gray-700">Via Piave 69, 88046 Lamezia Terme (CZ)</p>
                    <p className="text-sm text-gray-500 mt-1">Facilmente raggiungibile dal centro città</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Orari di Apertura</h4>
                    <div className="text-gray-700 space-y-1">
                      <p>
                        <span className="font-semibold">Lun - Ven:</span> 9:00 - 19:30
                      </p>
                      <p>
                        <span className="font-semibold">Sabato:</span> 9:00 - 12:00
                      </p>
                      <p>
                        <span className="font-semibold">Domenica:</span> Chiuso
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Appuntamenti anche fuori orario su richiesta</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Contatti Diretti</h4>
                    <p className="text-gray-700 mb-1">
                      <a href="tel:+393473975804" className="hover:text-blue-600 transition-colors font-semibold">
                        +39 347 397 5804
                      </a>
                    </p>
                    <p className="text-gray-700 mb-2">
                      <a
                        href="mailto:alessioferrisecasaemutui@gmail.com"
                        className="hover:text-blue-600 transition-colors text-sm"
                      >
                        alessioferrisecasaemutui@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">WhatsApp disponibile</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">Come Raggiungerci</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                La nostra sede è situata in una posizione strategica nel centro di Lamezia Terme, facilmente raggiungibile
                sia in auto che con i mezzi pubblici. Disponiamo di parcheggio nelle vicinanze.
              </p>

              <div className="h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.1518803944636!2d16.304562775878184!3d38.96738834772422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d308bc2a795ebf%3A0xc1602f029da1d9ee!2sVia%20Piave%2C%2069%2C%2088046%20Lamezia%20Terme%20CZ%2C%20Italy!5e0!3m2!1sit!2sit!4v1735746123456!5m2!1sit!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mappa Ferrise Immobiliare - Via Piave 69, Lamezia Terme"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Inizia il Tuo Percorso Immobiliare</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              Che tu stia cercando casa, vendendo un immobile o necessiti di una consulenza, siamo qui per trasformare i
              tuoi progetti in realtà.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onNavigate('properties')}
                className="bg-yellow-500 text-blue-950 py-3 px-8 rounded-xl hover:bg-yellow-400 transition-all duration-300 hover:-translate-y-0.5 font-extrabold shadow-sm hover:shadow-md"
              >
                🏠 Esplora le Proprietà
              </button>

              <button
                onClick={() => onNavigate('sell')}
                className="bg-white/10 text-white hover:bg-white/15 py-3 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 font-extrabold shadow-sm hover:shadow-md inline-flex items-center justify-center"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Vendi immobile
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="bg-white text-blue-900 hover:bg-gray-100 py-3 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 font-extrabold shadow-sm hover:shadow-md"
              >
                📞 Contattaci Ora
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
