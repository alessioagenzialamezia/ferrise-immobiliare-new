import React, { useRef, useState } from "react";
import { Send, CheckCircle, X } from "lucide-react";
import emailjs from "emailjs-com";

/* ================= TYPES ================= */

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  requestType: string;
  message: string;
  privacyConsent: boolean;
}

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

/* ================= COMPONENT ================= */

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [contactForm, setContactForm] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    requestType: "",
    message: "",
    privacyConsent: false,
  });

  /* ================= VALIDATION ================= */

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {};

    if (!contactForm.firstName.trim()) {
      newErrors.firstName = "Il nome è obbligatorio";
    }

    if (!contactForm.lastName.trim()) {
      newErrors.lastName = "Il cognome è obbligatorio";
    }

    if (!contactForm.email.trim()) {
      newErrors.email = "L'email è obbligatoria";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactForm.email)
    ) {
      newErrors.email = "Inserisci un indirizzo email valido";
    }

    if (!contactForm.requestType) {
      newErrors.requestType = "Seleziona il tipo di richiesta";
    }

    if (!contactForm.message.trim()) {
      newErrors.message = "Il messaggio è obbligatorio";
    } else if (contactForm.message.trim().length < 10) {
      newErrors.message = "Il messaggio deve contenere almeno 10 caratteri";
    }

    if (!contactForm.privacyConsent) {
      newErrors.privacyConsent =
        "Devi accettare l'informativa sulla privacy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SEND EMAIL ================= */

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!form.current) return;

    setLoading(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setShowSuccessModal(true);
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        requestType: "",
        message: "",
        privacyConsent: false,
      });
      setErrors({});
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("❌ Errore nell'invio del messaggio. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const handleInputChange = (
    field: keyof ContactFormData,
    value: string | boolean
  ) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Inviaci un Messaggio
      </h2>

      <form ref={form} onSubmit={sendEmail} className="space-y-6">
        {/* Hidden fields for EmailJS */}
        <input
          type="hidden"
          name="user_name"
          value={`${contactForm.firstName} ${contactForm.lastName}`}
        />
        <input type="hidden" name="user_email" value={contactForm.email} />
        <input type="hidden" name="user_phone" value={contactForm.phone} />
        <input type="hidden" name="request_type" value={contactForm.requestType} />
        <input type="hidden" name="message" value={contactForm.message} />

        {/* Nome / Cognome */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              value={contactForm.firstName}
              onChange={(e) =>
                handleInputChange("firstName", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cognome *
            </label>
            <input
              value={contactForm.lastName}
              onChange={(e) =>
                handleInputChange("lastName", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email / Telefono */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefono
            </label>
            <input
              value={contactForm.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tipo richiesta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo di Richiesta *
          </label>
          <select
            value={contactForm.requestType}
            onChange={(e) =>
              handleInputChange("requestType", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.requestType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleziona...</option>
            <option value="Richiesta Informazioni">Richiesta Informazioni</option>
            <option value="Prenotazione Visita">Prenotazione Visita</option>
            <option value="Valutazione Immobile">Valutazione Immobile</option>
            <option value="Vendita immobile">Vendita immobile</option>
            <option value="Consulenza">Consulenza</option>
          </select>
          {errors.requestType && (
            <p className="mt-1 text-sm text-red-600">
              {errors.requestType}
            </p>
          )}
        </div>

        {/* Messaggio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Messaggio *
          </label>
          <textarea
            rows={5}
            value={contactForm.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        {/* Privacy */}
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={contactForm.privacyConsent}
              onChange={(e) =>
                handleInputChange("privacyConsent", e.target.checked)
              }
              className="mt-1 h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-600">
              Acconsento al trattamento dei dati personali *
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="mt-1 text-sm text-red-600">
              {errors.privacyConsent}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
        >
          {loading ? "Invio in corso..." : "Invia Messaggio"}
        </button>
      </form>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Messaggio inviato!
              </h3>

              <p className="text-gray-600 mb-6">
                Grazie per averci contattato.<br />
                Ti risponderemo entro <strong>24 ore lavorative</strong>.
              </p>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
                <strong>Per urgenze:</strong><br />
                📞 <a href="tel:+393473975804">+39 347 397 5804</a><br />
                📧 <a href="mailto:alessioferrisecasaemutui@gmail.com">
                  alessioferrisecasaemutui@gmail.com
                </a>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
              >
                Perfetto, grazie!
              </button>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
