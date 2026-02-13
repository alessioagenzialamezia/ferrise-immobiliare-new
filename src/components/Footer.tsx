import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
  showAdminButton?: boolean;
}

export default function Footer({ onNavigate, showAdminButton = true }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const goTo = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* MAIN */}
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16 py-14">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* ================= BRAND ================= */}
            <div>
              <img
                src="/logoconsimmbianco1.png"
                alt="Ferrise Immobiliare"
                className="h-12 w-auto mb-5"
              />

              <p className="text-gray-300 leading-relaxed max-w-xl">
                Agenzia immobiliare di fiducia a Lamezia Terme. Esperienza, professionalità
                e risultati concreti per accompagnarti in ogni fase del tuo progetto immobiliare.
              </p>

              {/* SOCIAL */}
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://www.facebook.com/alessioferrisecasaemutui/?locale=it_IT"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-md bg-gray-800 flex items-center justify-center
                             transition-all duration-300 ease-out
                             hover:-translate-y-0.5 hover:shadow-lg hover:bg-blue-600
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  <img src="/facebook.png" alt="" className="w-5 h-5" />
                </a>

                <a
                  href="https://www.instagram.com/ferrisealessio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-md bg-gray-800 flex items-center justify-center
                             transition-all duration-300 ease-out
                             hover:-translate-y-0.5 hover:shadow-lg
                             hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  <img src="/instagram.png" alt="" className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="space-y-12">

              {/* NAVIGATION */}
              <div>
                <h3 className="text-yellow-400 text-lg font-semibold mb-5">
                  Navigazione
                </h3>

                <ul className="flex flex-wrap gap-x-8 gap-y-4 text-gray-300">
                  {[
                    ["home", "Home"],
                    ["agency", "Agenzia"],
                    ["properties", "Proprietà"],
                    ["sell", "Vendi con noi"],
                    ["blog", "Blog"],
                    ["faq", "FAQ"],
                    ["contact", "Contatti"],
                  ].map(([key, label]) => (
                    <li key={key}>
                      <button
                        onClick={() => goTo(key)}
                        className="relative transition-all duration-300 ease-out
                                   hover:text-yellow-400 hover:-translate-y-0.5
                                   after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                                   after:w-0 after:bg-yellow-400 after:transition-all after:duration-300
                                   hover:after:w-full
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                      >
                        {label}
                      </button>
                    </li>
                  ))}

                  {showAdminButton && (
                    <li>
                      <button
                        onClick={() => goTo("admin")}
                        className="text-sm text-gray-400 transition-all duration-300
                                   hover:text-yellow-400 hover:-translate-y-0.5
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                      >
                        Area Admin
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* CONTACT + HOURS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

                {/* CONTATTI */}
                <div>
                  <h3 className="text-yellow-400 text-lg font-semibold mb-5">
                    Contatti
                  </h3>

                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p>Via Piave 69</p>
                        <p>88046 Lamezia Terme (CZ)</p>
                        <p>Calabria</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <a
                          href="tel:+393473975804"
                          className="hover:text-yellow-400 transition-colors"
                        >
                          +39 347 397 5804
                        </a>
                        <p className="text-sm text-gray-400">WhatsApp disponibile</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <a
                        href="mailto:alessioferrisecasaemutui@gmail.com"
                        className="hover:text-yellow-400 transition-colors break-all"
                      >
                        alessioferrisecasaemutui@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>

                {/* ORARI */}
                <div>
                  <h3 className="text-yellow-400 text-lg font-semibold mb-5">
                    Orari
                  </h3>

                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Lunedì – Venerdì</p>
                        <p>9:00 – 19:30</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Sabato</p>
                        <p>9:00 – 12:00</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Domenica</p>
                        <p>Chiuso</p>
                      </div>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16 py-6">
          <div className="mx-auto w-full max-w-screen-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Ferrise Immobiliare – Alessio Ferrise
              </p>
              <p className="text-gray-500 text-xs mt-1">
                REA CZ 211940 · Agenzia Immobiliare Autorizzata
              </p>
            </div>

            <div className="text-xs text-gray-500 text-center md:text-right">
              Sito web professionale per servizi immobiliari
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
