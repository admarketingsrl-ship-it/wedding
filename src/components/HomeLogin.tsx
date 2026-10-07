import { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Globe, 
  AlertCircle, 
  X, 
  HeartHandshake, 
  Package, 
  Building2, 
  Check,
  Heart,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { ADMIN_CREDENTIALS, WeddingData, MasterSupplier } from '../data/weddingStore';
import heroBanner from '../assets/images/wedding_concierge_hero_1791309110090.jpg';

interface HomeLoginProps {
  weddings: WeddingData[];
  suppliers: MasterSupplier[];
  onGuestLogin: (guestInfo: { name: string; email: string; weddingCode: string; provider: 'google' | 'apple' | 'email'; country?: string }, rememberMe?: boolean) => void;
  onCoupleLogin: (weddingCode: string, rememberMe?: boolean) => void;
  onAdminLogin: (rememberMe?: boolean) => void;
  onSupplierLogin: (supplierId: string, rememberMe?: boolean) => void;
  savedSession?: { role: string; name?: string; details?: string } | null;
  onResumeSavedSession?: () => void;
  onClearSavedSession?: () => void;
}

export default function HomeLogin({ 
  weddings, 
  suppliers, 
  onGuestLogin, 
  onCoupleLogin,
  onAdminLogin,
  onSupplierLogin,
  savedSession,
  onResumeSavedSession,
  onClearSavedSession
}: HomeLoginProps) {
  // Ruolo attivo: 'guest' (esploso come principale di default) oppure 'couple' | 'admin' | 'supplier'
  const [activeRole, setActiveRole] = useState<'guest' | 'couple' | 'admin' | 'supplier'>('guest');

  // Funzione Memoria ("Ricordami su questo dispositivo")
  const [rememberMeGuest, setRememberMeGuest] = useState(true);
  const [rememberMeCouple, setRememberMeCouple] = useState(true);
  const [rememberMeAdmin, setRememberMeAdmin] = useState(true);
  const [rememberMeSupplier, setRememberMeSupplier] = useState(true);

  // Stato Modulo Ospite
  const [guestMode, setGuestMode] = useState<'quick' | 'register'>('quick');
  const [guestName, setGuestName] = useState('Eleanor Vance');
  const [guestEmail, setGuestEmail] = useState('eleanor.vance@gmail.com');
  const [guestCountry, setGuestCountry] = useState('Stati Uniti (New York)');
  const [weddingCode, setWeddingCode] = useState('SOPHIA-LIAM-2026');
  const [guestError, setGuestError] = useState('');

  // Modali Social Login (Google & Apple)
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showAppleModal, setShowAppleModal] = useState(false);

  // Stato Modulo Sposi
  const [coupleWeddingCode, setCoupleWeddingCode] = useState(weddings[0]?.weddingCode || 'SOPHIA-LIAM-2026');
  const [couplePassword, setCouplePassword] = useState('sposi2026');
  const [coupleError, setCoupleError] = useState('');

  // Stato Modulo Amministratore
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Stato Modulo Fornitore (Solo caselle per inserire le credenziali!)
  const [supplierInput, setSupplierInput] = useState('booking@borgoegnazia.it');
  const [supplierPassword, setSupplierPassword] = useState('fornitore2026');
  const [showSupplierPassword, setShowSupplierPassword] = useState(false);
  const [supplierError, setSupplierError] = useState('');

  // Submit Ospite
  const handleGuestSubmit = (provider: 'google' | 'apple' | 'email', customData?: { name: string; email: string }) => {
    setGuestError('');
    const cleanCode = weddingCode.trim().toUpperCase();
    
    if (!cleanCode) {
      setGuestError('Inserisci il Codice Matrimonio ricevuto nel messaggio WhatsApp o nella partecipazione.');
      return;
    }

    const found = weddings.find(w => w.weddingCode.toUpperCase() === cleanCode);
    if (!found) {
      setGuestError(`Il codice "${cleanCode}" non è stato trovato. Verifica il codice o clicca su uno dei codici suggeriti sotto.`);
      return;
    }

    const finalName = customData?.name || guestName.trim();
    const finalEmail = customData?.email || guestEmail.trim() || 'guest@example.com';

    if (!finalName) {
      setGuestError('Inserisci il tuo nome e cognome per entrare.');
      return;
    }

    onGuestLogin({
      name: finalName,
      email: finalEmail,
      weddingCode: cleanCode,
      provider,
      country: guestCountry
    }, rememberMeGuest);
  };

  // Submit Sposi
  const handleCoupleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCoupleError('');

    const cleanCode = coupleWeddingCode.trim().toUpperCase();
    const found = weddings.find(w => w.weddingCode.toUpperCase() === cleanCode);

    if (!found) {
      setCoupleError(`Nessun matrimonio trovato con il codice "${cleanCode}".`);
      return;
    }

    // Verifica password sposi (default: sposi2026 o admin2026)
    const expectedPassword = found.couplePassword || 'sposi2026';
    if (couplePassword !== expectedPassword && couplePassword !== 'sposi2026' && couplePassword !== 'admin2026') {
      setCoupleError('Password sposi non corretta. Usa la password predefinita: sposi2026');
      return;
    }

    onCoupleLogin(cleanCode, rememberMeCouple);
  };

  // Demo fill Admin
  const handleFillAdminDemo = () => {
    setAdminEmail(ADMIN_CREDENTIALS.email);
    setAdminPassword(ADMIN_CREDENTIALS.password);
    setAdminError('');
  };

  // Submit Admin
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (
      (adminEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() ||
       adminEmail.trim().toLowerCase() === 'info@admarketing.it') &&
      adminPassword === ADMIN_CREDENTIALS.password
    ) {
      onAdminLogin(rememberMeAdmin);
    } else {
      setAdminError('Credenziali non valide. Clicca su "Usa Credenziali Demo" per inserire i dati corretti.');
    }
  };

  // Submit Fornitore (Solo caselle per inserire le credenziali)
  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupplierError('');

    const query = supplierInput.trim().toLowerCase();
    if (!query) {
      setSupplierError('Inserisci la tua email aziendale o il codice fornitore assegnato.');
      return;
    }

    // Cerca tra i fornitori registrati
    const matchedSupplier = suppliers.find(s => 
      s.email.toLowerCase() === query ||
      s.id.toLowerCase() === query ||
      s.name.toLowerCase() === query
    );

    if (!matchedSupplier) {
      setSupplierError('Nessun fornitore registrato con questa email o codice. Controlla la mail di benvenuto ricevuta dall\'agenzia.');
      return;
    }

    const validPassword = matchedSupplier.accessPassword || 'fornitore2026';
    if (supplierPassword !== validPassword && supplierPassword !== 'fornitore2026' && supplierPassword !== 'admin2026') {
      setSupplierError('Password errata. Inserisci la password ricevuta nella mail di attivazione (es. fornitore2026).');
      return;
    }

    onSupplierLogin(matchedSupplier.id, rememberMeSupplier);
  };

  return (
    <div className="space-y-10">
      {/* ========================================================================= */}
      {/* HERO BANNER BENVENUTO PUGLIA                                              */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-950 text-white shadow-xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={heroBanner} 
            alt="Puglia Destination Wedding & Luxury Concierge" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-14 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
            <span>Hospitality & Wedding Destination Puglia</span>
            <span aria-hidden="true">·</span>
            <span>AD Marketing · Palagianello (TA)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white tracking-tight leading-tight">
            Apulian Wedding Concierge
          </h1>

          <p className="text-neutral-300 text-sm sm:text-base mt-4 leading-relaxed max-w-2xl">
            La piattaforma integrata per matrimoni internazionali in Puglia: accoglienza ospiti, prenotazione autonoma di hotel convenzionati, transfer aeroporto, servizi di bellezza ed esperienze indimenticabili offerte dagli sposi.
          </p>

          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs text-neutral-300 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Nessun Obbligo: Selezione Libera</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Hotel 5★, Transfer & Beauty Salons</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>Assistente Valeria Dedicata in Puglia</span>
            </div>
          </div>
        </div>
      </div>

      {/* BANNER SESSIONE SALVATA (Funzione Memoria) */}
      {savedSession && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-200/80 rounded-xl text-amber-900 shrink-0">
              <UserCheck className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span>Accesso Memorizzato su questo dispositivo</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                Sei pronto a riprendere la sessione come <strong className="font-semibold text-amber-950">{savedSession.name || savedSession.role}</strong> {savedSession.details ? `(${savedSession.details})` : ''}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onResumeSavedSession}
              className="px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Accedi Subito</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClearSavedSession}
              className="px-3 py-2 bg-white text-neutral-600 border border-neutral-300 rounded-xl text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cambia Profilo
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE PRINCIPALE ESPLOSA: ACCESSO OSPITI                                */}
      {/* (Oppure login Sposi / Agenzia / Fornitori se selezionati)                */}
      {/* ========================================================================= */}

      {/* SEZIONE 1: ACCESSO OSPITI (ESPLOSA COME PRINCIPALE) */}
      {activeRole === 'guest' && (
        <section className="bg-white border-2 border-amber-900/30 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 max-w-4xl mx-auto relative transition-all">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>Accesso Principale · Portale Ospiti & Invitati</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
              Entra nel Matrimonio per cui sei Invitato
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Inserisci il <strong>Codice Matrimonio</strong> ricevuto per accedere a tutte le sezioni: prenota liberamente alloggi convenzionati, transfer dall'aeroporto, acconciatura ed escursioni pugliesi.
            </p>
          </div>

          {/* Toggle rapido: Accesso Rapido vs Registrazione Email */}
          <div className="flex justify-center pt-1">
            <div className="inline-flex p-1 bg-neutral-100 rounded-xl text-xs font-medium text-neutral-600">
              <button
                type="button"
                onClick={() => setGuestMode('quick')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  guestMode === 'quick' 
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold' 
                    : 'hover:text-neutral-900'
                }`}
              >
                Accesso Rapido (Social o Codice)
              </button>
              <button
                type="button"
                onClick={() => setGuestMode('register')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  guestMode === 'register' 
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold' 
                    : 'hover:text-neutral-900'
                }`}
              >
                Registrati con Email Completa
              </button>
            </div>
          </div>

          {/* Social Buttons Rapidi (Google & Apple) */}
          {guestMode === 'quick' && (
            <div className="space-y-3 max-w-md mx-auto pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl shadow-2xs transition-all hover:border-neutral-400 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Continua con Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAppleModal(true)}
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.76-.95 2.81 1.02.08 2.05-.49 2.68-1.26"/>
                  </svg>
                  <span>Continua con Apple</span>
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-neutral-400 bg-white px-3 font-semibold">
                  oppure compila i campi sotto
                </div>
              </div>
            </div>
          )}

          {/* Form Dati Invitato & Codice Matrimonio */}
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nome e Cognome dell'Invitato
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Es. Eleanor Vance"
                className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email dell'Invitato
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="eleanor.vance@gmail.com"
                className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-700"
              />
            </div>

            {guestMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Città / Paese di Provenienza
                </label>
                <input
                  type="text"
                  value={guestCountry}
                  onChange={(e) => setGuestCountry(e.target.value)}
                  placeholder="Es. New York, Londra, Milano, Dublino"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-700"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Codice Matrimonio (Ricevuto su WhatsApp dagli sposi)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-amber-700 absolute left-3 top-3" />
                <input
                  type="text"
                  value={weddingCode}
                  onChange={(e) => setWeddingCode(e.target.value.toUpperCase())}
                  placeholder="ES: SOPHIA-LIAM-2026"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-amber-50/70 border border-amber-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800 font-mono font-bold tracking-wider uppercase text-amber-950"
                />
              </div>
            </div>

            {/* Suggerimento rapido codici attivi */}
            <div className="pt-1">
              <div className="text-[11px] text-neutral-500 mb-1.5 flex items-center justify-between">
                <span>Codici matrimonio attivi per provare il portale:</span>
                <span className="text-[10px] text-amber-800 font-semibold">Clicca per inserire</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {weddings.map((w) => (
                  <button
                    key={w.weddingCode}
                    type="button"
                    onClick={() => setWeddingCode(w.weddingCode)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                      weddingCode === w.weddingCode
                        ? 'bg-amber-900 text-white border-amber-900 font-bold shadow-2xs'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {w.weddingCode}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Demo Invitati per velocizzare il test */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <span className="text-[11px] font-semibold text-neutral-500 block mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-neutral-700" />
                Invitati di test rapido:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGuestName('Eleanor Vance');
                    setGuestEmail('eleanor.vance@gmail.com');
                    setGuestCountry('Stati Uniti (New York)');
                    setWeddingCode('SOPHIA-LIAM-2026');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-white border border-neutral-300 hover:border-amber-700 cursor-pointer"
                >
                  Eleanor Vance (NY)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestName('Aidan Murphy');
                    setGuestEmail('aidan.murphy@gmail.com');
                    setGuestCountry('Irlanda (Dublino)');
                    setWeddingCode('SOPHIA-LIAM-2026');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-white border border-neutral-300 hover:border-amber-700 cursor-pointer"
                >
                  Aidan Murphy (Dublino)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestName('Marco Bellini');
                    setGuestEmail('marco.bellini@yahoo.it');
                    setGuestCountry('Italia (Milano)');
                    setWeddingCode('CHIARA-MATTEO-2026');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-white border border-neutral-300 hover:border-amber-700 cursor-pointer"
                >
                  Marco Bellini (Milano)
                </button>
              </div>
            </div>

            {guestError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{guestError}</span>
              </div>
            )}

            {/* Funzione Memoria Ospiti */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600 select-none py-1">
              <input
                type="checkbox"
                checked={rememberMeGuest}
                onChange={(e) => setRememberMeGuest(e.target.checked)}
                className="w-4 h-4 rounded text-amber-900 border-neutral-300 focus:ring-amber-800"
              />
              <span><strong>Ricordami su questo dispositivo</strong> (Accesso automatico futuro)</span>
            </label>

            <button
              type="button"
              onClick={() => handleGuestSubmit('email')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Entra nel Matrimonio Selezionato</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE SPOSI (Se attivata tramite pulsante piccolo)                     */}
      {/* ========================================================================= */}
      {activeRole === 'couple' && (
        <section className="bg-white border-2 border-rose-950/30 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 max-w-2xl mx-auto relative animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setActiveRole('guest')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna all'Accesso Ospiti (Principale)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('guest')}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
              title="Chiudi e torna agli ospiti"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 text-rose-700 fill-rose-700" />
              <span>Area Riservata Futuri Sposi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
              Benvenuti nella Pagina Sposi
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Gestite i dettagli delle nozze, caricate le vostre foto, aggiungete informazioni secondarie (logistica, clima, lista nozze) e condividete l'invito ufficiale WhatsApp con i vostri ospiti.
            </p>
          </div>

          <form onSubmit={handleCoupleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Seleziona il Vostro Matrimonio:
              </label>
              <select
                value={coupleWeddingCode}
                onChange={(e) => setCoupleWeddingCode(e.target.value)}
                className="w-full p-2.5 text-xs bg-rose-50/50 border border-rose-300 rounded-lg font-mono font-bold text-rose-950 mb-2 cursor-pointer"
              >
                {weddings.map((w) => (
                  <option key={w.weddingCode} value={w.weddingCode}>
                    {w.coupleNames} — {w.weddingCode} ({w.venue})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Password Sposi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={couplePassword}
                  onChange={(e) => setCouplePassword(e.target.value)}
                  placeholder="sposi2026"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-800 font-mono"
                  required
                />
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Password predefinita di prova: <strong className="font-mono text-neutral-700">sposi2026</strong>
              </span>
            </div>

            {coupleError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{coupleError}</span>
              </div>
            )}

            {/* Funzione Memoria Sposi */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600 select-none py-1">
              <input
                type="checkbox"
                checked={rememberMeCouple}
                onChange={(e) => setRememberMeCouple(e.target.checked)}
                className="w-4 h-4 rounded text-rose-800 border-neutral-300 focus:ring-rose-800"
              />
              <span><strong>Ricordami su questo dispositivo</strong> (Accesso automatico futuro)</span>
            </label>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition-colors mt-2 cursor-pointer"
            >
              <span>Entra nel Portale Sposi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE AGENZIA (Se attivata tramite pulsante piccolo)                   */}
      {/* ========================================================================= */}
      {activeRole === 'admin' && (
        <section className="bg-white border-2 border-neutral-900/30 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 max-w-2xl mx-auto relative animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setActiveRole('guest')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna all'Accesso Ospiti (Principale)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('guest')}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
              title="Chiudi e torna agli ospiti"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center max-w-lg mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Back End · Staff Concierge AD Marketing
            </span>
            <h3 className="text-2xl font-serif-luxury font-bold text-neutral-900 mt-1">
              Pannello Direzionale Concierge
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Gestione matrimoni in Puglia, pacchetti fornitori, inviti WhatsApp per gli sposi, monitoraggio scelte e contabilità.
            </p>
          </div>

          {/* Credenziali Amministrative Provvisorie */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-700" />
                <span>Credenziali Amministrative Provvisorie</span>
              </span>
              <button
                type="button"
                onClick={handleFillAdminDemo}
                className="text-[11px] font-semibold text-amber-800 underline hover:text-amber-950 cursor-pointer"
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900 font-mono"
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

            {/* Funzione Memoria Admin */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600 select-none py-1">
              <input
                type="checkbox"
                checked={rememberMeAdmin}
                onChange={(e) => setRememberMeAdmin(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-neutral-900"
              />
              <span><strong>Ricordami su questo dispositivo</strong> (Accesso automatico futuro)</span>
            </label>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-xs transition-colors mt-2 cursor-pointer"
            >
              <span>Accedi al Back Office Agenzia</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE FORNITORI (Se attivata tramite pulsante piccolo)                  */}
      {/* ========================================================================= */}
      {activeRole === 'supplier' && (
        <section className="bg-white border-2 border-purple-900/30 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 max-w-2xl mx-auto relative animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setActiveRole('guest')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna all'Accesso Ospiti (Principale)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('guest')}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
              title="Chiudi e torna agli ospiti"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5 text-purple-700" />
              <span>Accesso Riservato Partner & Fornitori</span>
            </div>
            <h3 className="text-2xl font-serif-luxury font-bold text-neutral-900">
              Portale Fornitori Convenzionati
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Inserisci le tue credenziali riservate per accedere all'area di gestione pacchetti e visualizzare le prenotazioni ricevute.
            </p>
          </div>

          {/* Form Credenziali Fornitore (SENZA elenco fornitori visibile) */}
          <form onSubmit={handleSupplierSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Aziendale o Codice Fornitore
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={supplierInput}
                  onChange={(e) => setSupplierInput(e.target.value)}
                  placeholder="Es. booking@borgoegnazia.it oppure sup-borgo"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-700 font-medium"
                  required
                />
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Inserisci l'email o il codice fornitore presente nella mail di attivazione inviata dall'agenzia.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Password di Accesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type={showSupplierPassword ? "text" : "password"}
                  value={supplierPassword}
                  onChange={(e) => setSupplierPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-700 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSupplierPassword(!showSupplierPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showSupplierPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Password predefinita: <strong className="font-mono text-neutral-700">fornitore2026</strong>
              </span>
            </div>

            {supplierError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{supplierError}</span>
              </div>
            )}

            {/* Funzione Memoria Fornitore */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600 select-none py-1">
              <input
                type="checkbox"
                checked={rememberMeSupplier}
                onChange={(e) => setRememberMeSupplier(e.target.checked)}
                className="w-4 h-4 rounded text-purple-700 border-neutral-300 focus:ring-purple-700"
              />
              <span><strong>Ricordami su questo dispositivo</strong> (Accesso automatico futuro)</span>
            </label>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors mt-2 cursor-pointer"
            >
              <span>Accedi all'Area Fornitore</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Box Credenziali Demo per test veloci */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/70 text-[11px] text-purple-900 space-y-1 mt-3">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-700" />
                  <span>Credenziali Fornitore di Prova:</span>
                </span>
                <span className="text-[10px] text-purple-700 font-mono">pwd: fornitore2026</span>
              </div>
              <div className="flex items-center justify-between text-purple-800 pt-0.5">
                <span>Hotel: <code className="font-mono bg-white px-1 py-0.5 rounded border border-purple-200">booking@borgoegnazia.it</code></span>
                <button
                  type="button"
                  onClick={() => {
                    setSupplierInput('booking@borgoegnazia.it');
                    setSupplierPassword('fornitore2026');
                    setSupplierError('');
                  }}
                  className="font-bold underline hover:text-purple-950 cursor-pointer ml-2 text-[10px]"
                >
                  Usa Demo
                </button>
              </div>
              <div className="flex items-center justify-between text-purple-800">
                <span>Transfer NCC: <code className="font-mono bg-white px-1 py-0.5 rounded border border-purple-200">info@apuliaviptransfer.it</code></span>
                <button
                  type="button"
                  onClick={() => {
                    setSupplierInput('info@apuliaviptransfer.it');
                    setSupplierPassword('fornitore2026');
                    setSupplierError('');
                  }}
                  className="font-bold underline hover:text-purple-950 cursor-pointer ml-2 text-[10px]"
                >
                  Usa Demo
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE ALTRI ACCESSI PIÙ IN PICCOLO: SPOSI, AGENZIA, FORNITORI           */}
      {/* "mentre sposi , agenzia e fornitori più in piccolo"                       */}
      {/* ========================================================================= */}
      <section className="pt-2 border-t border-neutral-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Altri Accessi Riservati alla Piattaforma
            </h3>
            <p className="text-xs text-neutral-500">
              Se sei una coppia di sposi, lo staff dell'agenzia o una struttura partner, clicca per accedere:
            </p>
          </div>
          {activeRole !== 'guest' && (
            <button
              type="button"
              onClick={() => setActiveRole('guest')}
              className="text-xs font-semibold text-amber-800 hover:underline inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Mostra di nuovo Accesso Ospiti principale</span>
            </button>
          )}
        </div>

        {/* 3 Card Più in Piccolo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* 1. ACCESSO SPOSI (COMPATTO) */}
          <div
            onClick={() => {
              setActiveRole('couple');
              const el = document.getElementById('top');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
              activeRole === 'couple'
                ? 'bg-rose-50/70 border-rose-400 shadow-sm ring-1 ring-rose-400'
                : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-rose-300 shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                    Coppia Nozze
                  </span>
                </div>
                <h4 className="text-sm font-serif-luxury font-bold text-neutral-900 mt-0.5">
                  Accesso Sposi
                </h4>
                <p className="text-[11px] text-neutral-500 leading-snug mt-1">
                  Inserisci dettagli nozze, carica foto, gestisci note secondarie e crea inviti WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-rose-800 group-hover:text-rose-950">
              <span>{activeRole === 'couple' ? 'Sezione Sposi attiva' : 'Apri Login Sposi'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. ACCESSO AGENZIA (COMPATTO) */}
          <div
            onClick={() => {
              setActiveRole('admin');
              const el = document.getElementById('top');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
              activeRole === 'admin'
                ? 'bg-neutral-100 border-neutral-400 shadow-sm ring-1 ring-neutral-400'
                : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    Staff AD Marketing
                  </span>
                </div>
                <h4 className="text-sm font-serif-luxury font-bold text-neutral-900 mt-0.5">
                  Accesso Agenzia
                </h4>
                <p className="text-[11px] text-neutral-500 leading-snug mt-1">
                  Back office direzionale, approvazione pacchetti fornitori, contabilità e report ospiti.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-800 group-hover:text-neutral-950">
              <span>{activeRole === 'admin' ? 'Sezione Agenzia attiva' : 'Apri Login Agenzia'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. ACCESSO FORNITORI (COMPATTO) */}
          <div
            onClick={() => {
              setActiveRole('supplier');
              const el = document.getElementById('top');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
              activeRole === 'supplier'
                ? 'bg-purple-50/70 border-purple-400 shadow-sm ring-1 ring-purple-400'
                : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-purple-300 shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Partner & Strutture
                  </span>
                </div>
                <h4 className="text-sm font-serif-luxury font-bold text-neutral-900 mt-0.5">
                  Accesso Fornitori
                </h4>
                <p className="text-[11px] text-neutral-500 leading-snug mt-1">
                  Inserisci pacchetti per l'agenzia, ricevi prenotazioni email e configura pagamenti.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-purple-800 group-hover:text-purple-950">
              <span>{activeRole === 'supplier' ? 'Sezione Fornitori attiva' : 'Apri Login Fornitore'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* POPUP INTERATTIVO GOOGLE SIGN-IN                                          */}
      {/* ========================================================================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.41 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.59 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="font-semibold text-sm text-neutral-800">Accedi con Google</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Seleziona l'account Google con cui accedere ad Apulian Wedding Concierge:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleModal(false);
                  handleGuestSubmit('google', { name: 'Eleanor Vance', email: 'eleanor.vance@gmail.com' });
                }}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-neutral-400 flex items-center gap-3 text-left transition-colors hover:bg-neutral-50 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  EV
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-neutral-900 truncate">Eleanor Vance</div>
                  <div className="text-[11px] text-neutral-500 truncate">eleanor.vance@gmail.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowGoogleModal(false);
                  handleGuestSubmit('google', { name: 'Aidan Murphy', email: 'aidan.murphy@gmail.com' });
                }}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-neutral-400 flex items-center gap-3 text-left transition-colors hover:bg-neutral-50 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  AM
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-neutral-900 truncate">Aidan Murphy</div>
                  <div className="text-[11px] text-neutral-500 truncate">aidan.murphy@gmail.com</div>
                </div>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400 text-center">
              Codice matrimonio attivo: <span className="font-mono font-bold text-neutral-800">{weddingCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP INTERATTIVO APPLE ID                                                */}
      {/* ========================================================================= */}
      {showAppleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.76-.95 2.81 1.02.08 2.05-.49 2.68-1.26"/>
                </svg>
                <span className="font-semibold text-sm text-neutral-800">Accedi con ID Apple</span>
              </div>
              <button 
                onClick={() => setShowAppleModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Accedi con il tuo ID Apple privato ad Apulian Wedding Concierge:
            </p>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-500">
                <span>Nome:</span>
                <span className="font-semibold text-neutral-900">{guestName || 'Eleanor Vance'}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Email Apple:</span>
                <span className="font-mono text-neutral-900">••••@privaterelay.appleid.com</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Codice Matrimonio:</span>
                <span className="font-mono font-bold text-amber-700">{weddingCode}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAppleModal(false);
                handleGuestSubmit('apple', { name: guestName || 'Eleanor Vance', email: 'guest.apple@privaterelay.appleid.com' });
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Continua con Face ID / Touch ID</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
