import React, { useRef, useState } from "react";
import { Send, CheckCircle, X } from "lucide-react";
import emailjs from "emailjs-com";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  requestType: string;
  message: string;
  privacyConsent: boolean;
}

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [contactForm, setContactForm] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    requestType: '',
    message: '',
    privacyConsent: false
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!contactForm.firstName.trim()) {
      newErrors.firstName = 'Il nome è obbligatorio';
    }

    if (!contactForm.lastName.trim()) {
      newErrors.lastName = 'Il cognome è obbligatorio';
    }

    if (!contactForm.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contactForm.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }

    if (!contactForm.requestType) {
      newErrors.requestType = 'Seleziona il tipo di richiesta';
    }

    if (!contactForm.message.trim()) {
      newErrors.message = 'Il messaggio è obbligatorio';
    } else if (contactForm.message.trim().length < 10) {
      newErrors.message = 'Il messaggio deve contenere almeno 10 caratteri';
    }

    if (!contactForm.privacyConsent) {
      newErrors.privacyConsent = 'Devi accettare l\'informativa sulla privacy' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!form.current) return;

    setLoading(true);

    try {
      // Invia email tramite EmailJS
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      setShowSuccessModal(true);
      setContactForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        requestType: '',
        message: '',
        privacyConsent: false
      });
      setErrors({});

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setShowSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Errore nell\'invio del messaggio. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Inviaci un Messaggio
      </h2>
      
      {success && !showSuccessModal && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
          <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Messaggio inviato con successo!</p>
            <p className="text-sm">Grazie per averci contattato. Ti risponderemo al più presto.</p>
          </div>
        </div>
      )}
      
      <form ref={form} onSubmit={sendEmail} className="space-y-6">
        {/* Hidden fields for EmailJS template */}
        <input type="hidden" name="user_name" value={`${contactForm.firstName} ${contactForm.lastName}`} />
        <input type="hidden" name="user_email" value={contactForm.email} />
        <input type="hidden" name="user_phone" value={contactForm.phone} />
        <input type="hidden" name="request_type" value={contactForm.requestType} />
        <input type="hidden" name="message" value={contactForm.message} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
            <input
              type="text"
              value={contactForm.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Il tuo nome"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cognome *</label>
            <input
              type="text"
              value={contactForm.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Il tuo cognome"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="la.tua.email@esempio.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
            <input
              type="tel"
              value={contactForm.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+39 123 456 7890"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo di Richiesta *</label>
          <select
            value={contactForm.requestType}
            onChange={(e) => handleInputChange('requestType', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.requestType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleziona...</option>
            <option value="Richiesta Informazioni">Richiesta Informazioni</option>
            <option value="Prenotazione Visita">Prenotazione Visita</option>
            <option value="Valutazione Immobile">Valutazione Immobile</option>
            <option value="Vendita immobile">Vendita immobile</option>
            <option value="Acquisto immobile">Acquisto immobile</option>
            <option value="Affitto immobile">Affitto immobile</option>
            <option value="Consulenza">Consulenza</option>
            <option value="Altro">Altro</option>
          </select>
          {errors.requestType && (
            <p className="mt-1 text-sm text-red-600">{errors.requestType}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Messaggio *</label>
          <textarea
            rows={5}
            value={contactForm.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descrivi la tua richiesta..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={contactForm.privacyConsent}
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-600">
              Acconsento al trattamento dei miei dati personali in conformità con l'informativa sulla privacy *
            </label>
          </div>
          {errors.privacyConsent && (
            <p className="mt-1 text-sm text-red-600">{errors.privacyConsent as string}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <Send className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Invio in corso...' : 'Invia Messaggio'}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-pulse">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Messaggio Inviato!
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Grazie per averci contattato! <br />
                Il tuo messaggio è stato inviato con successo. <br />
                Ti risponderemo entro <strong>24 ore</strong>.
              </p>
              
              {/* Contact Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Per urgenze:</strong><br />
                  📞 <a href="tel:+393473975804" className="hover:underline">+39 347 397 5804</a><br />
                  📧 <a href="mailto:alessioferrisecasaemutui@gmail.com" className="hover:underline">alessioferrisecasaemutui@gmail.com</a>
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Perfetto, grazie!
              </button>
            </div>
            
            {/* Close X Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}