import { useEffect, useMemo, useRef, useState } from "react";
import { Home, X, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import emailjs from "emailjs-com";
import AppLayout from "../components/AppLayout";

interface SellPropertyPageProps {
  onNavigate: (view: string, id?: string) => void;
}

// Leaflet loaded via CDN (no npm install)
declare global {
  interface Window {
    L?: any;
  }
}

export default function SellPropertyPage({ onNavigate }: SellPropertyPageProps) {
  // ======= FORM STATE =======
  const [propertyForm, setPropertyForm] = useState({
    contract: "Vendita",
    type: "",
    address: "",
    city: "",
    notes: "",
    locationLat: "" as string,
    locationLng: "" as string,
  });

  // ======= DATI CLIENTE =======
  const [sellContact, setSellContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    privacyConsent: false,
  });

  const [sending, setSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ======= MAP / LEAFLET =======
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkerRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const DEFAULT_CENTER = { lat: 38.965, lng: 16.31 };

  // testo completo (utile anche per template)
  const fullText = useMemo(() => {
    const location =
      propertyForm.locationLat && propertyForm.locationLng
        ? `${propertyForm.locationLat}, ${propertyForm.locationLng}`
        : "-";

    return `DETTAGLI IMMOBILE
Contratto: ${propertyForm.contract || "-"}
Tipologia: ${propertyForm.type || "-"}
Indirizzo: ${propertyForm.address || "-"}
Città/Zona: ${propertyForm.city || "-"}
Dettagli dell'immobile e note: ${propertyForm.notes?.trim() ? propertyForm.notes.trim() : "-"}
Posizione (facoltativa): ${location}

DATI CLIENTE
Nome: ${sellContact.firstName} ${sellContact.lastName}
Email: ${sellContact.email}
Telefono: ${sellContact.phone || "-"}`;
  }, [propertyForm, sellContact]);

  // ======= MAP LOADER (Leaflet via CDN) =======
  useEffect(() => {
    const ensureLeaflet = async () => {
      try {
        if (window.L) {
          setMapReady(true);
          return;
        }

        // CSS
        const cssId = "leaflet-css";
        if (!document.getElementById(cssId)) {
          const link = document.createElement("link");
          link.id = cssId;
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          link.crossOrigin = "";
          document.head.appendChild(link);
        }

        // JS
        const scriptId = "leaflet-js";
        if (!document.getElementById(scriptId)) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
            script.crossOrigin = "";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Impossibile caricare Leaflet"));
            document.body.appendChild(script);
          });
        } else {
          await new Promise((r) => setTimeout(r, 200));
        }

        if (!window.L) throw new Error("Leaflet non disponibile dopo il caricamento");
        setMapReady(true);
      } catch (e: any) {
        console.error(e);
        setMapError(
          "Mappa non disponibile al momento. Puoi comunque compilare il form senza selezionare la zona."
        );
      }
    };

    ensureLeaflet();
  }, []);

  // ======= INIT MAP =======
  useEffect(() => {
    if (!mapReady) return;
    if (!mapContainerRef.current) return;
    if (leafletMapRef.current) return;

    try {
      const L = window.L;

      leafletMapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(leafletMapRef.current);

      leafletMapRef.current.on("click", (ev: any) => {
        const { lat, lng } = ev.latlng;

        if (!leafletMarkerRef.current) {
          leafletMarkerRef.current = L.marker([lat, lng]).addTo(leafletMapRef.current);
        } else {
          leafletMarkerRef.current.setLatLng([lat, lng]);
        }

        setPropertyForm((p) => ({
          ...p,
          locationLat: lat.toFixed(6),
          locationLng: lng.toFixed(6),
        }));
      });
    } catch (e) {
      console.error(e);
      setMapError(
        "Mappa non disponibile al momento. Puoi comunque compilare il form senza selezionare la zona."
      );
    }
  }, [mapReady]);

  // ======= MAP HELPERS =======
  const clearMapSelection = () => {
    try {
      if (leafletMarkerRef.current) {
        leafletMapRef.current?.removeLayer(leafletMarkerRef.current);
        leafletMarkerRef.current = null;
      }
    } catch {
      // ignore
    }
    setPropertyForm((p) => ({ ...p, locationLat: "", locationLng: "" }));
  };

  const useMyPosition = () => {
    if (!navigator.geolocation) {
      alert("Geolocalizzazione non supportata dal browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPropertyForm((p) => ({
          ...p,
          locationLat: lat.toFixed(6),
          locationLng: lng.toFixed(6),
        }));

        try {
          const L = window.L;
          if (leafletMapRef.current && L) {
            leafletMapRef.current.setView([lat, lng], 15);
            if (!leafletMarkerRef.current) {
              leafletMarkerRef.current = L.marker([lat, lng]).addTo(leafletMapRef.current);
            } else {
              leafletMarkerRef.current.setLatLng([lat, lng]);
            }
          }
        } catch {
          // ignore
        }
      },
      () => alert("Impossibile recuperare la posizione. Puoi cliccare sulla mappa o lasciare vuoto."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ======= INVIO EMAILJS =======
  const sendSellEmail = async () => {
    if (sending) return;

    // Validazione dati cliente
    if (!sellContact.firstName.trim()) return alert("Inserisci il nome");
    if (!sellContact.lastName.trim()) return alert("Inserisci il cognome");
    if (!sellContact.email.trim()) return alert("Inserisci l'email");
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(sellContact.email)) {
      return alert("Inserisci un indirizzo email valido");
    }
    if (!sellContact.privacyConsent) return alert("Devi accettare l'informativa sulla privacy");

    // Validazione dati immobile (minimi)
    if (!propertyForm.type.trim()) return alert("Seleziona la tipologia");
    if (!propertyForm.city.trim()) return alert("Inserisci la città/zona");

    const location =
      propertyForm.locationLat && propertyForm.locationLng
        ? `${propertyForm.locationLat}, ${propertyForm.locationLng}`
        : "-";

    setSending(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_SELL_ID,
        {
          first_name: sellContact.firstName,
          last_name: sellContact.lastName,
          email: sellContact.email,
          phone: sellContact.phone || "-",

          contract: propertyForm.contract || "-",
          property_type: propertyForm.type || "-",
          address: propertyForm.address || "-",
          city: propertyForm.city || "-",
          notes: propertyForm.notes?.trim() ? propertyForm.notes.trim() : "-",
          location,
          full_text: fullText,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setShowSuccessModal(true);

      setSellContact({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        privacyConsent: false,
      });
    } catch (err) {
      console.error("EmailJS sell error:", err);
      alert("❌ Errore nell'invio. Riprova più tardi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout onNavigate={onNavigate} showAdminButton={true}>
      {/* ================= HERO ================= */}
      <section className="relative">
        <div
          className="h-[430px] md:h-[540px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-blue-900/35 to-transparent" />

        <div className="absolute inset-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/90 text-sm font-medium">
                <Home className="w-4 h-4" />
                Valutazione gratuita • Strategia di vendita • Marketing
              </div>

              <h1 className="mt-5 text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Vuoi vendere il tuo immobile?
              </h1>

              <p className="mt-4 text-white/90 text-lg sm:text-xl max-w-xl leading-relaxed">
                Compila i dettagli: ti ricontattiamo rapidamente con una valutazione realistica e un piano su misura.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    document.getElementById("sell-main")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="
                    inline-flex items-center justify-center rounded-xl
                    bg-blue-600 px-7 py-3.5 text-white font-semibold
                    shadow-xl
                    transition-all duration-300 ease-out
                    hover:bg-blue-700 hover:-translate-y-1 hover:shadow-2xl
                  "
                >
                  Inizia ora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>

                <button
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center justify-center rounded-xl bg-white/10 px-7 py-3.5 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Vai ai contatti
                </button>
              </div>

              <div className="mt-5 text-sm text-white/75">
                Suggerimento: seleziona anche una zona sulla mappa (facoltativo).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section id="sell-main" className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ================= LEFT COLUMN ================= */}
            <div className="lg:col-span-4">
              <div
                className="
                  bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-lg
                "
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">Inserisci i dati dell’immobile</h2>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  Più informazioni ci dai, più veloce e precisa sarà la valutazione. La selezione della zona sulla mappa
                  è <span className="font-semibold">facoltativa</span>.
                </p>

                <div className="mt-6 rounded-xl bg-blue-50 p-4 border border-blue-100">
                  <div className="text-sm font-semibold text-blue-900">Come usarlo al meglio</div>
                  <ul className="mt-2 text-sm text-blue-900/80 space-y-2">
                    <li>• Compila i campi a destra</li>
                    <li>• (Facoltativo) Clicca sulla mappa per segnare la zona</li>
                    <li>• Inserisci i tuoi dati e invia la richiesta</li>
                  </ul>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Privacy</div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        Le coordinate sono opzionali e servono solo a indicare la zona in modo più rapido.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="text-sm font-semibold text-gray-900">Preferisci parlare direttamente?</div>
                <p className="mt-2 text-sm text-gray-600">Vai alla pagina Contatti per chiamarci o scriverci.</p>
                <button
                  onClick={() => onNavigate("contact")}
                  className="mt-4 w-full inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-white font-semibold hover:bg-black transition-colors"
                >
                  Vai ai Contatti
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="lg:col-span-8 space-y-8">
              {/* CARD 1: dati immobile */}
              <div
                className="
                  bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-lg
                "
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Dati dell’immobile</h3>
                <p className="mt-2 text-gray-600">
                  Compila i campi qui sotto. Tutto è modificabile e la posizione sulla mappa è facoltativa.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contratto</label>
                    <select
                      value={propertyForm.contract}
                      onChange={(e) => setPropertyForm((p) => ({ ...p, contract: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Vendita">Vendita</option>
                      <option value="Affitto">Affitto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipologia *</label>
                    <select
                      value={propertyForm.type}
                      onChange={(e) => setPropertyForm((p) => ({ ...p, type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleziona...</option>
                      <option value="Appartamento">Appartamento</option>
                      <option value="Villa">Villa</option>
                      <option value="Casa indipendente">Casa indipendente</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Locale commerciale">Locale commerciale</option>
                      <option value="Altro">Altro</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo dell’immobile</label>
                  <input
                    value={propertyForm.address}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Es. Via Roma 10"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Se non vuoi inserire l’indirizzo preciso, scrivi solo via/zona (facoltativo).
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Città / Zona *</label>
                  <input
                    value={propertyForm.city}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Es. Lamezia Terme, Nicastro, Sambiase..."
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dettagli dell'immobile e note (opzionale)
                  </label>
                  <textarea
                    value={propertyForm.notes}
                    onChange={(e) => setPropertyForm((p) => ({ ...p, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Es. metratura, piano, stato, ascensore, balconi, giardino, box auto, esposizione..."
                  />
                </div>

                {/* MAP */}
                <div className="mt-7 rounded-2xl overflow-hidden border border-gray-200">
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-sm font-medium text-gray-700">Mappa (facoltativa) — clicca per indicare la zona</div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={useMyPosition}
                        className="text-sm px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Usa la mia posizione
                      </button>

                      <button
                        type="button"
                        onClick={clearMapSelection}
                        className="text-sm px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Rimuovi selezione
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    {mapError ? (
                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
                        <div className="font-semibold">Attenzione</div>
                        <div className="text-sm mt-1">{mapError}</div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="
                            h-[320px] rounded-xl overflow-hidden border border-gray-100
                            transition-all duration-300 ease-out
                            hover:shadow-lg
                          "
                        >
                          <div ref={mapContainerRef} className="w-full h-full" />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Latitudine (facoltativa)</label>
                            <input
                              value={propertyForm.locationLat}
                              onChange={(e) => setPropertyForm((p) => ({ ...p, locationLat: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Es. 38.967388"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Longitudine (facoltativa)</label>
                            <input
                              value={propertyForm.locationLng}
                              onChange={(e) => setPropertyForm((p) => ({ ...p, locationLng: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Es. 16.304563"
                            />
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">Se non vuoi indicare la posizione, lascia i campi vuoti.</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 2: dati cliente + invio */}
              <div
                className="
                  bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-lg
                "
              >
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">I tuoi dati</h3>
                <p className="mt-2 text-gray-600">
                  Inserisci i tuoi contatti per ricevere una valutazione gratuita e una strategia su misura.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                    <input
                      value={sellContact.firstName}
                      onChange={(e) => setSellContact((p) => ({ ...p, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Il tuo nome"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cognome *</label>
                    <input
                      value={sellContact.lastName}
                      onChange={(e) => setSellContact((p) => ({ ...p, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Il tuo cognome"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={sellContact.email}
                      onChange={(e) => setSellContact((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="la.tua.email@esempio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                    <input
                      type="tel"
                      value={sellContact.phone}
                      onChange={(e) => setSellContact((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={sellContact.privacyConsent}
                      onChange={(e) => setSellContact((p) => ({ ...p, privacyConsent: e.target.checked }))}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      Acconsento al trattamento dei miei dati personali in conformità con l'informativa sulla privacy *
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={sendSellEmail}
                  disabled={sending}
                  className="
                    mt-6 w-full inline-flex items-center justify-center rounded-xl
                    bg-blue-600 px-6 py-3.5 text-white font-semibold
                    shadow-md
                    transition-all duration-300 ease-out
                    hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                    active:translate-y-0
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {sending ? "Invio in corso..." : "Invia richiesta"}
                </button>

                <p className="mt-3 text-xs text-gray-500">Riceverai una risposta entro 24 ore lavorative.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="
              bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden
              animate-[fadeIn_0.25s_ease-out]
            "
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">Richiesta inviata!</h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Grazie! Abbiamo ricevuto i dettagli dell’immobile. <br />
                Ti ricontatteremo entro <strong>24 ore lavorative</strong>.
              </p>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Per urgenze:</strong>
                  <br />
                  📞{" "}
                  <a href="tel:+393473975804" className="hover:underline">
                    +39 347 397 5804
                  </a>
                  <br />
                  📧{" "}
                  <a href="mailto:alessioferrisecasaemutui@gmail.com" className="hover:underline">
                    alessioferrisecasaemutui@gmail.com
                  </a>
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Perfetto, grazie!
              </button>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
