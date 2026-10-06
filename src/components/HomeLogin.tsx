import { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Lock, 
  Mail, 
  Key, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  MapPin, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Globe
} from 'lucide-react';
import { ADMIN_CREDENTIALS, WeddingData } from '../data/weddingStore';
import heroBanner from '../assets/images/wedding_concierge_hero_1791309110090.jpg';

interface HomeLoginProps {
  weddings: WeddingData[];
  onGuestLogin: (guestInfo: { name: string; email: string; weddingCode: string; provider: 'google' | 'apple' | 'email' }) => void;
  onAdminLogin: () => void;
}

export default function HomeLogin({ weddings, onGuestLogin, onAdminLogin }: HomeLoginProps) {
  const [activeTab, setActiveTab] = useState<'guest' | 'admin'>('guest');

  // Form Ospite
  const [guestName, setGuestName] = useState('Eleanor Vance');
  const [guestEmail, setGuestEmail] = useState('eleanor.vance@nycapital.com');
  const [weddingCode, setWeddingCode] = useState('EMMA-ALEX-2026');
  const [guestError, setGuestError] = useState('');
  const [socialProvider, setSocialProvider] = useState<'google' | 'apple' | 'email'>('google');

  // Form Amministratore
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleGuestSubmit = (provider: 'google' | 'apple' | 'email') => {
    setGuestError('');
    const cleanCode = weddingCode.trim().toUpperCase();
    
    if (!cleanCode) {
      setGuestError('Inserisci il codice matrimonio ricevuto sull\'invito WhatsApp o via email.');
      return;
    }

    const found = weddings.find(w => w.weddingCode.toUpperCase() === cleanCode);
    if (!found) {
      setGuestError(`Codice "${cleanCode}" non trovato. Verifica il codice oppure prova i codici demo.`);
      return;
    }

    if (!guestName.trim()) {
      setGuestError('Inserisci il tuo nome per accedere al portale.');
      return;
    }

    onGuestLogin({
      name: guestName.trim(),
      email: guestEmail.trim() || 'guest@example.com',
      weddingCode: cleanCode,
      provider
    });
  };

  const handleFillAdminDemo = () => {
    setAdminEmail(ADMIN_CREDENTIALS.email);
    setAdminPassword(ADMIN_CREDENTIALS.password);
    setAdminError('');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (adminEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
        adminPassword === ADMIN_CREDENTIALS.password) {
      onAdminLogin();
    } else {
      setAdminError('Credenziali non valide. Usa le credenziali amministrative provvisorie indicate nel riquadro.');
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Welcome Section */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-950 text-white shadow-md">
        <div className="absolute inset-0 z-0 opacity-45">
          <img 
            src={heroBanner} 
            alt="Luxury Destination Wedding Italy" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
            <span>Destination Wedding Concierge Service</span>
            <span aria-hidden="true">·</span>
            <span>Italy & Mediterranean</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white tracking-tight leading-tight">
            Gestione Ospiti Esteri & Concierge di Nozze
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
            La piattaforma dedicata agli invitati internazionali: prenotazione camere in blocchi hotel riservati, trasferimenti da/per aeroporto e programmi di esperienze sul territorio.
          </p>

          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs text-neutral-300 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Blocchi Camere Contrattualizzati</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Transfer & NCC Dedicati</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Assistenza WhatsApp H24</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Authentication Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Selector Card (Tab Switcher) */}
        <div className="lg:col-span-12 flex justify-center">
          <div className="inline-flex p-1 bg-white border border-neutral-200 rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab('guest')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'guest'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Accesso Ospite (Invitato)</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Accesso Agenzia (Back End)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LATO FRONT END: LOGIN OSPITE CON GOOGLE, APPLE O CODICE MATRIMONIO       */}
        {/* ========================================================================= */}
        {activeTab === 'guest' && (
          <div className="lg:col-span-8 lg:col-start-3 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Front End · Area Invitati
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900 mt-1">
                Entra nel Matrimonio a cui sei Invitato
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2">
                Effettua l'accesso per consultare tutte le proposte dell'agenzia: hotel convenzionati, navette da Malpensa/Linate e programma degli eventi.
              </p>
            </div>

            {/* Social Login Buttons (Google / Apple) */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              <button
                type="button"
                onClick={() => handleGuestSubmit('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-lg shadow-2xs transition-colors"
              >
                {/* Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Accedi con Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleGuestSubmit('apple')}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-lg shadow-2xs transition-colors"
              >
                {/* Apple SVG Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.76-.95 2.81 1.02.08 2.05-.49 2.68-1.26"/>
                </svg>
                <span>Accedi con Apple</span>
              </button>
            </div>

            <div className="relative my-4 max-w-md mx-auto">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-neutral-400 bg-white px-3">
                oppure inserisci i tuoi dati
              </div>
            </div>

            {/* Input Form con Codice Matrimonio */}
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Il Tuo Nome & Cognome
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Es. Eleanor Vance"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Es. eleanor.vance@example.com"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-900">
                    Codice Matrimonio (dall'invito)
                  </label>
                  <span className="text-[11px] text-amber-700 font-medium">Obbligatorio</span>
                </div>
                <input
                  type="text"
                  value={weddingCode}
                  onChange={(e) => setWeddingCode(e.target.value.toUpperCase())}
                  placeholder="Es. EMMA-ALEX-2026"
                  className="w-full p-3 text-sm font-mono font-bold tracking-wider uppercase bg-amber-50/50 border-2 border-amber-300 rounded-lg text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Lo trovi nel messaggio WhatsApp ricevuto dagli sposi o nel biglietto d'invito.
                </p>
              </div>

              {/* Codici Demo Rapidi per Test Immediato */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                <span className="text-neutral-500 block mb-1 text-[11px] uppercase tracking-wider font-semibold">
                  Matrimoni Disponibili nel Sistema:
                </span>
                <div className="flex flex-wrap gap-2">
                  {weddings.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWeddingCode(w.weddingCode)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors ${
                        weddingCode === w.weddingCode
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {w.weddingCode} <span className="text-[10px] opacity-75">({w.city})</span>
                    </button>
                  ))}
                </div>
              </div>

              {guestError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{guestError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleGuestSubmit('email')}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors mt-2"
              >
                <span>Entra nella Sezione Matrimonio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LATO BACK END: LOGIN AMMINISTRATORE CON EMAIL E PASSWORD                 */}
        {/* ========================================================================= */}
        {activeTab === 'admin' && (
          <div className="lg:col-span-8 lg:col-start-3 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Back End · Area Riservata Agenzia
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900 mt-1">
                Accesso Amministrativo Wedding Concierge
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2">
                Inserisci credenziali per accedere al back office: inserimento hotel, transfer, esperienze e generatore di inviti WhatsApp per ogni matrimonio.
              </p>
            </div>

            {/* Riquadro Credenziali Provvisorie Richieste dall'Utente */}
            <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  <span>Credenziali Amministrative Provvisorie</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="text-[11px] font-semibold text-amber-800 underline hover:text-amber-950"
                >
                  Usa Credenziali Demo
                </button>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-amber-950 bg-white/70 p-2.5 rounded border border-amber-200/60">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-sans">Email:</span>
                  <span className="font-bold">{ADMIN_CREDENTIALS.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-sans">Password:</span>
                  <span className="font-bold">{ADMIN_CREDENTIALS.password}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Amministratore
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@weddingconcierge.it"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                    required
                  />
                </div>
              </div>

              {adminError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors mt-2"
              >
                <span>Accedi al Pannello Agenzia</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
