import { useState } from 'react';
import { 
  Building2, 
  Compass, 
  Sparkles, 
  Users, 
  Lock, 
  Globe, 
  LogOut, 
  ShieldCheck, 
  MessageCircle,
  Package,
  HeartHandshake,
  FileText,
  X,
  Phone,
  Mail,
  MapPin,
  Heart
} from 'lucide-react';
import HomeLogin from './components/HomeLogin';
import AdminPanel from './components/AdminPanel';
import GuestPortal from './components/GuestPortal';
import SupplierPortal from './components/SupplierPortal';
import CouplePortal from './components/CouplePortal';
import AgencyDashboard from './components/AgencyDashboard';
import { 
  INITIAL_WEDDINGS, 
  INITIAL_SUPPLIERS,
  INITIAL_SUPPLIER_PACKAGES,
  INITIAL_SUPPLIER_BOOKINGS,
  INITIAL_WISH_REQUESTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_PAYMENT_REQUESTS,
  WeddingData,
  MasterSupplier,
  SupplierPackage,
  SupplierBookingOrder,
  TouristWishRequest,
  ChatMessage,
  PaymentRequest,
  AdminSettings
} from './data/weddingStore';

export default function App() {
  // Database State
  const [weddings, setWeddings] = useState<WeddingData[]>(INITIAL_WEDDINGS);
  const [suppliers, setSuppliers] = useState<MasterSupplier[]>(INITIAL_SUPPLIERS);
  const [packages, setPackages] = useState<SupplierPackage[]>(INITIAL_SUPPLIER_PACKAGES);
  const [bookingOrders, setBookingOrders] = useState<SupplierBookingOrder[]>(INITIAL_SUPPLIER_BOOKINGS);
  const [wishRequests, setWishRequests] = useState<TouristWishRequest[]>(INITIAL_WISH_REQUESTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(INITIAL_ADMIN_SETTINGS);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(INITIAL_PAYMENT_REQUESTS);

  // Stato Autenticazione & Ruolo
  const [authRole, setAuthRole] = useState<'guest' | 'couple' | 'admin' | 'supplier' | null>(null);
  const [currentGuest, setCurrentGuest] = useState<{
    name: string;
    email: string;
    weddingCode: string;
    provider: 'google' | 'apple' | 'email';
    country?: string;
  } | null>(null);
  const [currentCoupleWeddingCode, setCurrentCoupleWeddingCode] = useState<string>(INITIAL_WEDDINGS[0].weddingCode);
  const [currentSupplierId, setCurrentSupplierId] = useState<string>(INITIAL_SUPPLIERS[0].id);

  // Vista Attiva (Home, Ospite, Sposi, Admin, Fornitore, Dashboard)
  const [currentView, setCurrentView] = useState<'home' | 'guest' | 'couple' | 'admin' | 'supplier' | 'dashboard'>('home');

  // Modali Informative Legali Footer (AD Marketing Palagianello TA)
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'cookies' | 'terms' | null>(null);

  // Login Ospite
  const handleGuestLogin = (guestInfo: { 
    name: string; 
    email: string; 
    weddingCode: string; 
    provider: 'google' | 'apple' | 'email'; 
    country?: string 
  }) => {
    setAuthRole('guest');
    setCurrentGuest(guestInfo);
    setCurrentView('guest');
  };

  // Login Sposi
  const handleCoupleLogin = (code: string) => {
    setAuthRole('couple');
    setCurrentCoupleWeddingCode(code);
    setCurrentGuest(null);
    setCurrentView('couple');
  };

  // Aggiornamento singolo matrimonio (dall'area sposi)
  const handleUpdateSingleWedding = (updatedWedding: WeddingData) => {
    setWeddings(prev => prev.map(w => w.id === updatedWedding.id ? updatedWedding : w));
  };

  // Login Amministrazione Agenzia
  const handleAdminLogin = () => {
    setAuthRole('admin');
    setCurrentGuest(null);
    setCurrentView('admin');
  };

  // Login Fornitore Partner
  const handleSupplierLogin = (supplierId: string) => {
    setAuthRole('supplier');
    setCurrentSupplierId(supplierId);
    setCurrentGuest(null);
    setCurrentView('supplier');
  };

  // Logout Globale
  const handleLogout = () => {
    setAuthRole(null);
    setCurrentGuest(null);
    setCurrentView('home');
  };

  // Anteprima Ospite dal pannello admin
  const handlePreviewAsGuest = (code: string) => {
    setAuthRole('guest');
    setCurrentGuest({
      name: 'Eleanor Vance (Anteprima Staff)',
      email: 'eleanor.vance@gmail.com',
      weddingCode: code,
      provider: 'google',
      country: 'Stati Uniti'
    });
    setCurrentView('guest');
  };

  // Invio messaggio in chat da parte dell'ospite
  const handleSendMessageFromGuest = (msg: { text: string; guestName: string; guestEmail: string; weddingCode: string }) => {
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      weddingCode: msg.weddingCode,
      guestName: msg.guestName,
      guestEmail: msg.guestEmail,
      sender: 'guest',
      text: msg.text,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      readByAdmin: false
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Risposta automatica di cortesia simulata da parte di Valeria se l'ospite è online
    setTimeout(() => {
      const valeriaReply: ChatMessage = {
        id: `chat-valeria-${Date.now()}`,
        weddingCode: msg.weddingCode,
        guestName: msg.guestName,
        guestEmail: msg.guestEmail,
        sender: 'valeria',
        text: `Grazie ${msg.guestName.split(' ')[0]}! Ho ricevuto la tua richiesta per il matrimonio di ${msg.weddingCode}. Ti confermo che sto verificando i dettagli e ti aggiorno a breve! - Valeria Concierge`,
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        readByAdmin: true
      };
      setChatMessages(prev => [...prev, valeriaReply]);
    }, 2000);
  };

  // Risposta alla chat da parte dell'amministrazione (Valeria)
  const handleReplyChatMessage = (reply: { weddingCode: string; guestName: string; guestEmail: string; text: string }) => {
    const newMsg: ChatMessage = {
      id: `chat-valeria-${Date.now()}`,
      weddingCode: reply.weddingCode,
      guestName: reply.guestName,
      guestEmail: reply.guestEmail,
      sender: 'valeria',
      text: reply.text,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      readByAdmin: true
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  // Invio nuova proposta / desiderio su misura da parte dell'ospite
  const handleSendWish = (wish: { title: string; description: string; preferredDate: string; participantsCount: number; budgetRange: string }) => {
    const newWish: TouristWishRequest = {
      id: `wish-${Date.now()}`,
      weddingCode: currentGuest?.weddingCode || 'SOPHIA-LIAM-2026',
      guestName: currentGuest?.name || 'Ospite',
      guestEmail: currentGuest?.email || 'guest@example.com',
      title: wish.title,
      description: wish.description,
      preferredDate: wish.preferredDate,
      participantsCount: wish.participantsCount,
      budgetRange: wish.budgetRange,
      status: 'RECEIVED',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setWishRequests(prev => [newWish, ...prev]);
  };

  // Registrazione nuovi ordini ai fornitori quando l'ospite invia il voucher
  const handleConfirmBookingToSuppliers = (newOrders: SupplierBookingOrder[]) => {
    setBookingOrders(prev => [...newOrders, ...prev]);
  };

  // Aggiunta nuovo pacchetto da parte del fornitore
  const handleAddPackage = (newPkg: SupplierPackage) => {
    setPackages(prev => [newPkg, ...prev]);
  };

  // Matrimonio attivo per la vista ospite
  const activeGuestWedding = weddings.find(
    w => w.weddingCode.toUpperCase() === (currentGuest?.weddingCode.toUpperCase() || 'SOPHIA-LIAM-2026')
  ) || weddings[0];

  // Matrimonio attivo per la vista sposi
  const activeCoupleWedding = weddings.find(
    w => w.weddingCode.toUpperCase() === currentCoupleWeddingCode.toUpperCase()
  ) || weddings[0];

  // Fornitore attualmente selezionato
  const activeSupplier = suppliers.find(s => s.id === currentSupplierId) || suppliers[0];

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* 
        ======================================================================
        HEADER CONCIERGE (Menu pulito senza voci interne di test o architettura)
        ======================================================================
      */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Element Wordmark */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('home')}
              className="text-left group flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-900 text-white flex items-center justify-center font-serif-luxury font-bold text-base shadow-2xs">
                P
              </div>
              <div>
                <span className="text-lg font-serif-luxury font-bold tracking-tight text-neutral-900 group-hover:text-amber-800 transition-colors block leading-none">
                  Apulian Wedding Concierge
                </span>
                <span className="text-[10px] text-amber-800 uppercase tracking-widest font-semibold block mt-0.5">
                  AD Marketing · Palagianello (TA)
                </span>
              </div>
            </button>
          </div>

          {/* Clean Navigation Links (Voci architettura eliminate da front end!) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600">
            <button
              onClick={() => setCurrentView('home')}
              className={`transition-colors py-1 cursor-pointer ${
                currentView === 'home'
                  ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                  : 'hover:text-neutral-900'
              }`}
            >
              Home & Login
            </button>

            {/* Link Ospite (Attivo se loggato come ospite) */}
            {authRole === 'guest' && (
              <button
                onClick={() => setCurrentView('guest')}
                className={`transition-colors py-1 cursor-pointer ${
                  currentView === 'guest'
                    ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                    : 'hover:text-neutral-900'
                }`}
              >
                Mio Matrimonio ({currentGuest?.weddingCode})
              </button>
            )}

            {/* Link Sposi (Attivo se loggato come sposi) */}
            {authRole === 'couple' && (
              <button
                onClick={() => setCurrentView('couple')}
                className={`transition-colors py-1 cursor-pointer ${
                  currentView === 'couple'
                    ? 'text-rose-900 font-bold border-b-2 border-rose-900'
                    : 'hover:text-rose-900'
                }`}
              >
                Area Sposi ({activeCoupleWedding?.coupleNames})
              </button>
            )}

            {/* Link Amministrazione (Attivo se loggato come admin) */}
            {authRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`transition-colors py-1 cursor-pointer ${
                    currentView === 'admin'
                      ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                      : 'hover:text-neutral-900'
                  }`}
                >
                  Pannello Agenzia & Inviti
                </button>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`transition-colors py-1 cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'text-neutral-900 font-bold border-b-2 border-neutral-900'
                      : 'hover:text-neutral-900'
                  }`}
                >
                  Monitoraggio Camere & Voli
                </button>
              </>
            )}

            {/* Link Fornitore (Attivo se loggato come fornitore) */}
            {authRole === 'supplier' && (
              <button
                onClick={() => setCurrentView('supplier')}
                className={`transition-colors py-1 cursor-pointer ${
                  currentView === 'supplier'
                    ? 'text-purple-900 font-bold border-b-2 border-purple-900'
                    : 'hover:text-neutral-900'
                }`}
              >
                Area Fornitore ({activeSupplier?.name})
              </button>
            )}
          </nav>

          {/* Authentication Badges & Quick Action */}
          <div className="flex items-center gap-2">
            {authRole === 'guest' && currentGuest ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-md">
                  <Globe className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate max-w-[120px]">{currentGuest.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                >
                  Esci
                </button>
              </div>
            ) : authRole === 'couple' ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-rose-800 bg-rose-50 rounded-md border border-rose-200">
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span className="truncate max-w-[140px]">{activeCoupleWedding?.coupleNames}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                >
                  Esci
                </button>
              </div>
            ) : authRole === 'admin' ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-rose-800 bg-rose-50 rounded-md border border-rose-200">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>Admin Agenzia</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                >
                  Esci
                </button>
              </div>
            ) : authRole === 'supplier' ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-purple-800 bg-purple-50 rounded-md border border-purple-200">
                  <Package className="w-3.5 h-3.5 text-purple-600" />
                  <span className="truncate max-w-[140px]">{activeSupplier?.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
                >
                  Esci
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('home')}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
              >
                Accedi
              </button>
            )}
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-neutral-100 bg-white px-2 py-2 text-[11px] font-medium text-neutral-600 overflow-x-auto">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'home' ? 'bg-neutral-900 text-white font-bold' : ''}`}
          >
            Home / Login
          </button>

          {authRole === 'guest' && (
            <button
              onClick={() => setCurrentView('guest')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'guest' ? 'bg-neutral-900 text-white font-bold' : ''}`}
            >
              Mio Matrimonio
            </button>
          )}

          {authRole === 'couple' && (
            <button
              onClick={() => setCurrentView('couple')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'couple' ? 'bg-rose-900 text-white font-bold' : ''}`}
            >
              Area Sposi
            </button>
          )}

          {authRole === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'admin' ? 'bg-neutral-900 text-white font-bold' : ''}`}
            >
              Pannello Agenzia
            </button>
          )}

          {authRole === 'supplier' && (
            <button
              onClick={() => setCurrentView('supplier')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${currentView === 'supplier' ? 'bg-purple-900 text-white font-bold' : ''}`}
            >
              Area Fornitore
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomeLogin 
            weddings={weddings} 
            suppliers={suppliers}
            onGuestLogin={handleGuestLogin} 
            onCoupleLogin={handleCoupleLogin}
            onAdminLogin={handleAdminLogin}
            onSupplierLogin={handleSupplierLogin}
          />
        )}

        {currentView === 'couple' && (
          <CouplePortal 
            weddingData={activeCoupleWedding}
            onUpdateWedding={handleUpdateSingleWedding}
            onLogout={handleLogout}
            onPreviewAsGuest={handlePreviewAsGuest}
            adminSettings={adminSettings}
          />
        )}

        {currentView === 'guest' && (
          <GuestPortal 
            weddingData={activeGuestWedding} 
            guestInfo={currentGuest || {
              name: 'Eleanor Vance',
              email: 'eleanor.vance@gmail.com',
              weddingCode: activeGuestWedding.weddingCode,
              provider: 'google',
              country: 'Stati Uniti'
            }}
            adminNotificationEmail={adminSettings.adminNotificationEmail}
            suppliers={suppliers}
            onLogout={handleLogout}
            chatMessages={chatMessages}
            onSendMessage={handleSendMessageFromGuest}
            onSendWish={handleSendWish}
            onConfirmBookingToSuppliers={handleConfirmBookingToSuppliers}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel 
            weddings={weddings} 
            onUpdateWeddings={setWeddings}
            suppliers={suppliers}
            onUpdateSuppliers={setSuppliers}
            packages={packages}
            wishRequests={wishRequests}
            onUpdateWishRequests={setWishRequests}
            chatMessages={chatMessages}
            onReplyChatMessage={handleReplyChatMessage}
            adminSettings={adminSettings}
            onUpdateAdminSettings={setAdminSettings}
            paymentRequests={paymentRequests}
            onUpdatePaymentRequests={setPaymentRequests}
            onLogout={handleLogout}
            onPreviewAsGuest={handlePreviewAsGuest}
          />
        )}

        {currentView === 'supplier' && (
          <SupplierPortal
            suppliers={suppliers}
            currentSupplierId={currentSupplierId}
            onChangeSupplier={setCurrentSupplierId}
            packages={packages}
            onAddPackage={handleAddPackage}
            bookingOrders={bookingOrders}
            onUpdateBookingOrders={setBookingOrders}
            weddings={weddings}
            onLogout={handleLogout}
            onNavigateToAgency={() => {
              setAuthRole('admin');
              setCurrentView('admin');
            }}
          />
        )}

        {currentView === 'dashboard' && <AgencyDashboard />}
      </main>

      {/* ========================================================================= */}
      {/* FOOTER CON INFO AD MARKETING PALAGIANELLO (TA) & PRIVACY POLICY          */}
      {/* ========================================================================= */}
      <footer className="border-t border-neutral-200 bg-white pt-10 pb-8 mt-12 text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Colonna 1: Dati Agenzia AD Marketing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury font-bold text-neutral-900 text-base">
                  Apulian Wedding Concierge
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Piattaforma di incoming e hospitality management per ospiti internazionali di matrimoni di lusso in Puglia.
              </p>
              <div className="text-[11px] text-neutral-700 font-semibold pt-1">
                A cura di <strong>AD Marketing S.r.l.s.</strong>
              </div>
              <div className="text-[11px] text-neutral-500">
                Palagianello (TA) · Puglia, Italia
              </div>
            </div>

            {/* Colonna 2: Dati Legali & Fiscali */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 block">
                Dati Societari & Legali
              </span>
              <div className="text-[11px] text-neutral-500 space-y-1">
                <div>Ragione Sociale: <strong>AD Marketing S.r.l.s.</strong></div>
                <div>Sede Legale: Via Roma, 45</div>
                <div>74018 Palagianello (TA) - Italia</div>
                <div>P.IVA & Codice Fiscale: <strong className="font-mono text-neutral-800">IT03124590731</strong></div>
                <div>REA: TA-201842 · Capitale Sociale: €10.000 i.v.</div>
              </div>
            </div>

            {/* Colonna 3: Contatti & Assistenza Ospiti */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 block">
                Centrale Operativa Puglia
              </span>
              <div className="text-[11px] text-neutral-500 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono">{adminSettings.adminNotificationEmail}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Tel: +39 099 8887766</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Concierge H24: +39 340 1234567 (Valeria)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Operatività: Bari, Brindisi, Valle d'Itria, Salento</span>
                </div>
              </div>
            </div>

            {/* Colonna 4: Informative & Link Legali (Modali Interattivi) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 block">
                Privacy & Trasparenza
              </span>
              <ul className="text-[11px] space-y-1.5">
                <li>
                  <button
                    onClick={() => setActiveLegalModal('privacy')}
                    className="text-neutral-600 hover:text-neutral-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Privacy Policy (GDPR EU 2016/679)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('cookies')}
                    className="text-neutral-600 hover:text-neutral-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Cookie Policy & Trattamento Dati</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveLegalModal('terms')}
                    className="text-neutral-600 hover:text-neutral-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Termini di Servizio Concierge & Pagamenti</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setAuthRole('supplier');
                      setCurrentView('supplier');
                    }}
                    className="text-purple-700 hover:text-purple-900 hover:underline cursor-pointer font-semibold flex items-center gap-1 pt-1"
                  >
                    <span>Portale Convenzione Fornitori Partner →</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
            <div>
              © {new Date().getFullYear()} AD Marketing S.r.l.s. · Palagianello (TA) · Tutti i diritti riservati.
            </div>
            <div className="flex items-center gap-3">
              <span>Progettato per matrimoni d'eccellenza in Puglia</span>
              <span aria-hidden="true">·</span>
              <span>Bari / Brindisi Airport Concierge NCC</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODALI INTERATTIVI PRIVACY POLICY & TERMINI                               */}
      {/* ========================================================================= */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-neutral-800" />
                <h3 className="text-base font-bold text-neutral-900">
                  {activeLegalModal === 'privacy' && 'Informativa sulla Privacy (GDPR UE 2016/679)'}
                  {activeLegalModal === 'cookies' && 'Informativa Cookie & Preferenze Dati'}
                  {activeLegalModal === 'terms' && 'Termini e Condizioni di Servizio Concierge'}
                </h3>
              </div>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              {activeLegalModal === 'privacy' && (
                <>
                  <p>
                    <strong>Titolare del Trattamento:</strong> AD Marketing S.r.l.s., con sede legale in Via Roma 45, 74018 Palagianello (TA), P.IVA IT03124590731, email: info@admarketing.it.
                  </p>
                  <p>
                    <strong>Finalità del Trattamento:</strong> I dati personali forniti dagli ospiti (nome, cognome, email, numero di telefono, dettagli di volo, preferenze alimentari ed eventuali richieste speciali) sono raccolti esclusivamente per la corretta organizzazione della logistica matrimoniale, prenotazione camere d'hotel, coordinamento transfer aeroportuali e gestione delle esperienze sul territorio pugliese.
                  </p>
                  <p>
                    <strong>Comunicazione a Terzi:</strong> I dati necessari alla fornitura dei singoli servizi vengono trasmessi ai soli fornitori partner incaricati (strutture ricettive, autisti NCC, skipper e professionisti estetici) e all'assistente personale Valeria per l'assistenza diretta.
                  </p>
                  <p>
                    <strong>Conservazione e Diritti dell'Interessato:</strong> I dati sono conservati per il tempo strettamente necessario all'espletamento dell'evento matrimoniale e agli obblighi fiscali. In conformità con gli artt. 15-22 del GDPR, l'interessato può richiedere in ogni momento la cancellazione o rettifica dei dati scrivendo a info@admarketing.it.
                  </p>
                </>
              )}

              {activeLegalModal === 'cookies' && (
                <>
                  <p>
                    <strong>Tipologia di Cookie Utilizzati:</strong> L'applicazione <em>Apulian Wedding Concierge</em> fa uso unicamente di cookie tecnici di sessione e preferenze di autenticazione, necessari per consentire l'accesso sicuro con codice matrimonio, account Google o Apple, e per conservare il riepilogo del voucher dell'ospite.
                  </p>
                  <p>
                    Non viene effettuata profilazione commerciale o tracciamento a fini pubblicitari invasivi da parte di terze parti non autorizzate.
                  </p>
                  <p>
                    Per maggiori informazioni o per disabilitare l'uso dei cookie dal browser, è possibile fare riferimento alle impostazioni del proprio dispositivo. Titolare: AD Marketing S.r.l.s. - Palagianello (TA).
                  </p>
                </>
              )}

              {activeLegalModal === 'terms' && (
                <>
                  <p>
                    <strong>Oggetto del Servizio:</strong> AD Marketing S.r.l.s. (Palagianello - TA) fornisce servizi di concierge, coordinamento e intermediazione per ospiti di destination wedding in Puglia.
                  </p>
                  <p>
                    <strong>Alloggi e Tariffe Convenzionate:</strong> Le camere sono bloccate secondo accordi stipulati con le singole strutture ricettive. L'ospite è libero di aderire o di alloggiare in autonomia.
                  </p>
                  <p>
                    <strong>Modalità di Pagamento:</strong> I pagamenti per i servizi a pagamento scelti dall'ospite (transfer privati, gite in barca, make-up in camera) possono essere saldati tramite link sicuro Stripe, bonifico bancario ad AD Marketing o accordo diretto con il fornitore partner secondo le indicazioni fornite nel riepilogo.
                  </p>
                  <p>
                    <strong>Eventi Gratuiti degli Sposi:</strong> Le serate ed esperienze contrassegnate come "Offerto dagli Sposi" sono interamente a carico della coppia nuziale e non comportano alcun costo per l'invitato.
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
