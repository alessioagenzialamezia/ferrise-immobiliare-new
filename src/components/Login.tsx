import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onBackToHome?: () => void;
}

export default function Login({ onLogin, onBackToHome }: LoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ opzionale: effetto "premium" + coerente con le altre pagine (sempre top)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Password statica (come prima, non cambia nulla)
    const correctPassword = 'Gabriele13!';

    if (password === correctPassword) {
      // Sessione nel localStorage (come prima, non cambia nulla)
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ore

      localStorage.setItem(
        'admin_session',
        JSON.stringify({
          token: sessionToken,
          expiresAt: expiresAt.toISOString(),
        })
      );

      onLogin(true);
    } else {
      setError('Password non corretta');
      onLogin(false);
    }

    setLoading(false);
  };

  const canGoBack = useMemo(() => typeof onBackToHome === 'function', [onBackToHome]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar (stile sito) */}
      <header className="bg-white/90 backdrop-blur shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {canGoBack && (
                <button
                  onClick={() => onBackToHome?.()}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  aria-label="Torna alla home"
                  type="button"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-800" />
                </button>
              )}

              <button
                onClick={() => onBackToHome?.()}
                className="flex items-center"
                aria-label="Vai alla home"
                type="button"
              >
                <img
                  src="/logoalessio.png"
                  alt="Ferrise Immobiliare"
                  className="h-10 w-auto hover:opacity-80 transition-opacity"
                />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Area amministrazione
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-12 sm:py-14">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: intro */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-gradient-to-br from-blue-800 to-blue-950 text-white p-8 sm:p-10 shadow-sm overflow-hidden relative">
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    <Lock className="w-4 h-4" />
                    Accesso sicuro
                  </div>

                  <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight">
                    Pannello Amministrazione
                  </h1>
                  <p className="mt-4 text-blue-100 text-base sm:text-lg leading-relaxed max-w-xl">
                    Inserisci la password per accedere alla dashboard e gestire contenuti, annunci e aggiornamenti del sito.
                  </p>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                      <div className="text-xs font-semibold text-blue-100">Sessione</div>
                      <div className="text-sm font-extrabold mt-1">24 ore</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                      <div className="text-xs font-semibold text-blue-100">Accesso</div>
                      <div className="text-sm font-extrabold mt-1">Riservato</div>
                    </div>
                  </div>

                  {canGoBack && (
                    <button
                      onClick={() => onBackToHome?.()}
                      className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-blue-900 font-extrabold hover:bg-blue-50 transition-colors"
                      type="button"
                    >
                      Torna al sito
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                Suggerimento: se condividi lo schermo, evita di mostrare la password in chiaro.
              </p>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">Accedi</h2>
                    <p className="text-gray-600 mt-1">
                      Inserisci la password per continuare.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                        placeholder="Inserisci la password"
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
                        aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                      <p className="text-red-700 text-sm font-semibold">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-extrabold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Accesso in corso...' : 'Accedi'}
                  </button>

                  {canGoBack && (
                    <button
                      type="button"
                      onClick={() => onBackToHome?.()}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-gray-100 px-6 py-3 text-gray-800 font-extrabold hover:bg-gray-200 transition-colors"
                    >
                      Annulla
                    </button>
                  )}
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500">Accesso riservato agli amministratori</p>
                </div>
              </div>

              {/* mini note */}
              <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-5">
                <div className="text-sm font-extrabold text-gray-900">Problemi di accesso?</div>
                <p className="text-sm text-gray-600 mt-1">
                  Verifica di aver inserito correttamente la password (maiuscole/minuscole e simboli).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
