import { useState } from 'react';
import { 
  Building2, 
  Car, 
  Sparkles, 
  Plus, 
  Check, 
  Copy, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CreditCard, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  LogOut, 
  Package, 
  ArrowRight,
  ExternalLink,
  DollarSign,
  Tag,
  Scissors,
  Users
} from 'lucide-react';
import { 
  MasterSupplier, 
  SupplierPackage, 
  SupplierBookingOrder,
  WeddingData
} from '../data/weddingStore';
import hotelSuiteImg from '../assets/images/wedding_hotel_suite_1791309120679.jpg';
import boatTourImg from '../assets/images/wedding_boat_experience_1791309131765.jpg';
import heroBanner from '../assets/images/wedding_concierge_hero_1791309110090.jpg';

interface SupplierPortalProps {
  suppliers: MasterSupplier[];
  currentSupplierId: string;
  onChangeSupplier: (id: string) => void;
  packages: SupplierPackage[];
  onAddPackage: (pkg: SupplierPackage) => void;
  onUpdatePackage?: (pkg: SupplierPackage) => void;
  bookingOrders: SupplierBookingOrder[];
  onUpdateBookingOrders: (orders: SupplierBookingOrder[]) => void;
  weddings: WeddingData[];
  onLogout: () => void;
  onNavigateToAgency: () => void;
}

export default function SupplierPortal({
  suppliers,
  currentSupplierId,
  onChangeSupplier,
  packages,
  onAddPackage,
  bookingOrders,
  onUpdateBookingOrders,
  weddings,
  onLogout,
  onNavigateToAgency
}: SupplierPortalProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'orders' | 'profile'>('packages');

  // Fornitore attualmente selezionato
  const currentSupplier = suppliers.find(s => s.id === currentSupplierId) || suppliers[0];

  // Pacchetti appartenenti a questo fornitore
  const myPackages = packages.filter(p => p.supplierId === currentSupplier?.id);

  // Ordini / Prenotazioni ricevute per questo fornitore
  const myBookings = bookingOrders.filter(b => b.supplierId === currentSupplier?.id);

  // Modulo Nuovo Pacchetto
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgCategory, setNewPkgCategory] = useState<'HOTEL' | 'TRANSFER' | 'EXPERIENCE' | 'BEAUTY_HAIR' | 'CATERING' | 'OTHER'>(
    (currentSupplier?.category as any) || 'EXPERIENCE'
  );
  const [newPkgDescription, setNewPkgDescription] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState<number>(currentSupplier?.standardRate || 120);
  const [newPkgCommission, setNewPkgCommission] = useState<number>(currentSupplier?.commissionPercent || 15);
  const [newPkgCapacity, setNewPkgCapacity] = useState('Disponibilità per 20 ospiti');
  const [newPkgFeatureText, setNewPkgFeatureText] = useState('Cancellazione gratuita fino a 14gg prima');
  const [newPkgFeatures, setNewPkgFeatures] = useState<string[]>([
    'Assistenza dedicata in loco',
    'Cancellazione flessibile',
    'Tariffa speciale riservata AD Marketing'
  ]);
  const [newPkgImageChoice, setNewPkgImageChoice] = useState<'hotel' | 'boat' | 'hero'>('hotel');
  const [newPkgAgencyNotes, setNewPkgAgencyNotes] = useState('Disponibile per matrimoni da maggio a ottobre in Puglia.');

  // Gestione Metodo di Pagamento su Prenotazione Selezionata
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<'DIRECT_AT_CHECKIN' | 'SUPPLIER_BANK_TRANSFER' | 'SUPPLIER_PAYMENT_LINK' | 'AGENCY_CENTRAL_BILLING'>('DIRECT_AT_CHECKIN');
  const [paymentCustomNotes, setPaymentCustomNotes] = useState('');
  const [notificationSentSuccess, setNotificationSentSuccess] = useState<string | null>(null);

  // Aggiungi un tag caratteristica
  const handleAddFeature = () => {
    if (newPkgFeatureText.trim() && !newPkgFeatures.includes(newPkgFeatureText.trim())) {
      setNewPkgFeatures([...newPkgFeatures, newPkgFeatureText.trim()]);
      setNewPkgFeatureText('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setNewPkgFeatures(newPkgFeatures.filter(f => f !== feat));
  };

  // Salvataggio nuovo pacchetto
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle.trim() || !currentSupplier) return;

    let selectedImg = hotelSuiteImg;
    if (newPkgImageChoice === 'boat') selectedImg = boatTourImg;
    if (newPkgImageChoice === 'hero') selectedImg = heroBanner;

    const newPkg: SupplierPackage = {
      id: `pkg-${Date.now()}`,
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.name,
      supplierEmail: currentSupplier.email,
      supplierPhone: currentSupplier.phone,
      title: newPkgTitle.trim(),
      category: newPkgCategory,
      description: newPkgDescription.trim(),
      pricePerUnit: Number(newPkgPrice),
      currency: 'EUR',
      commissionPercent: Number(newPkgCommission),
      capacityOrAvailability: newPkgCapacity.trim(),
      includedFeatures: newPkgFeatures,
      image: selectedImg,
      notesForAgency: newPkgAgencyNotes.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddPackage(newPkg);
    setShowAddPackageModal(false);

    // Reset
    setNewPkgTitle('');
    setNewPkgDescription('');
  };

  // Conferma prenotazione e decisione metodo di pagamento da parte del fornitore
  const handleConfirmOrderPayment = (orderId: string) => {
    const updated = bookingOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'CONFIRMED' as const,
          paymentMethodChosen: paymentChoice,
          paymentNotes: paymentCustomNotes.trim() || getDefaultPaymentNote(paymentChoice),
          supplierResponseDate: new Date().toISOString().split('T')[0]
        };
      }
      return order;
    });

    onUpdateBookingOrders(updated);
    const curr = bookingOrders.find(o => o.id === orderId);
    setNotificationSentSuccess(
      `Conferma e metodo di pagamento inviati con successo all'ospite ${curr?.guestName} (${curr?.guestEmail}) e archiviati per l'agenzia!`
    );
    setSelectedOrderId(null);
    setTimeout(() => setNotificationSentSuccess(null), 5000);
  };

  const getDefaultPaymentNote = (method: 'DIRECT_AT_CHECKIN' | 'SUPPLIER_BANK_TRANSFER' | 'SUPPLIER_PAYMENT_LINK' | 'AGENCY_CENTRAL_BILLING') => {
    switch (method) {
      case 'DIRECT_AT_CHECKIN':
        return 'Saldo diretto al momento dell\'arrivo o imbarco tramite carta di credito o contanti.';
      case 'SUPPLIER_BANK_TRANSFER':
        return `Bonifico diretto anticipato su conto ${currentSupplier?.name} (IBAN fornito nella notifica).`;
      case 'SUPPLIER_PAYMENT_LINK':
        return 'Link di pagamento sicuro POS virtuale inviato tramite SMS/Email al cliente.';
      case 'AGENCY_CENTRAL_BILLING':
        return 'Saldo centralizzato tramite addebito e voucher gestito dall\'agenzia AD Marketing.';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Area Fornitori */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 uppercase tracking-wider">
            <span>Area Riservata Fornitori Partner</span>
            <span aria-hidden="true">·</span>
            <span>Rete Hospitality Puglia AD Marketing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900 mt-1">
            Portale Fornitori Convenzionati
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-2xl leading-relaxed">
            Inserisci i tuoi pacchetti di soggiorno, navette, esperienze e trattamenti estetici. L'agenzia potrà includerli nei cataloghi dei matrimoni attivi. Riceverai le conferme di prenotazione direttamente via email e potrai decidere la modalità di saldo.
          </p>
        </div>

        {/* Quick Supplier Selector Switcher */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium">Sei loggato come:</span>
            <select
              value={currentSupplierId}
              onChange={(e) => onChangeSupplier(e.target.value)}
              className="text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200 rounded-xl px-3 py-2 focus:outline-hidden"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToAgency}
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Vedi Vista Agenzia</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </div>

      {/* Scheda Aziendale Fornitore Attivo */}
      <div className="p-4 sm:p-5 bg-neutral-900 text-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-purple-300" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-white">{currentSupplier.name}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {currentSupplier.category}
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Partner Verificato AD Marketing</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-neutral-300 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{currentSupplier.city}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-mono text-purple-200">{currentSupplier.email}</span>
                <span className="text-[10px] text-neutral-400">(Email notifiche prenotazioni)</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{currentSupplier.phone}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800 text-xs">
          <div className="bg-neutral-800/80 px-3 py-2 rounded-xl border border-neutral-700/80 text-center">
            <div className="text-[11px] text-neutral-400">Pacchetti Pubblicati</div>
            <div className="text-base font-bold text-white">{myPackages.length}</div>
          </div>

          <div className="bg-neutral-800/80 px-3 py-2 rounded-xl border border-neutral-700/80 text-center">
            <div className="text-[11px] text-neutral-400">Prenotazioni Ospiti</div>
            <div className="text-base font-bold text-purple-300">{myBookings.length}</div>
          </div>
        </div>
      </div>

      {/* Navigazione Schede Fornitore: Menu a Pulsanti Adattivo e Responsive (Nessuno scorrimento orizzontale) */}
      <div className="pt-1 pb-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. I Miei Pacchetti */}
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'packages'
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${activeTab === 'packages' ? 'bg-white/15 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="block text-xs font-semibold">I Miei Pacchetti</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'packages' ? 'bg-purple-400 text-neutral-900' : 'bg-neutral-100 text-neutral-700'}`}>
                  {myPackages.length}
                </span>
              </div>
              <span className={`text-[10px] block mt-0.5 truncate ${activeTab === 'packages' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Camere, tour & transfer per l'agenzia
              </span>
            </div>
          </button>

          {/* 2. Prenotazioni Ricevute */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'orders'
                ? 'bg-purple-900 text-white font-semibold shadow-xs border-purple-950 ring-2 ring-purple-900/20'
                : 'text-neutral-700 hover:text-purple-900 hover:bg-purple-50/60 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${activeTab === 'orders' ? 'bg-white/15 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="block text-xs font-semibold">Prenotazioni Ospiti</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'orders' ? 'bg-white text-purple-900' : 'bg-purple-200 text-purple-800'}`}>
                  {myBookings.length}
                </span>
                {myBookings.some(b => b.status === 'RECEIVED') && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" title="Nuove prenotazioni da gestire" />
                )}
              </div>
              <span className={`text-[10px] block mt-0.5 truncate ${activeTab === 'orders' ? 'text-purple-200' : 'text-neutral-500'}`}>
                Gestisci saldo e conferma
              </span>
            </div>
          </button>

          {/* 3. Dati Aziendali */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'profile'
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20'
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${activeTab === 'profile' ? 'bg-white/15 text-neutral-300' : 'bg-neutral-100 text-neutral-700'}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block text-xs font-semibold">Profilo & Saldo</span>
              <span className={`text-[10px] block mt-0.5 truncate ${activeTab === 'profile' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Coordinate bancarie & contatti
              </span>
            </div>
          </button>
        </div>
      </div>

      {notificationSentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationSentSuccess}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHEDA 1: I MIEI PACCHETTI DISPONIBILI PER L'AGENZIA                     */}
      {/* ========================================================================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Catalogo Pacchetti Offerti all'Agenzia
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Questi pacchetti compaiono nell'area back-end dell'agenzia e possono essere collegati direttamente ai matrimoni di Sophia & Liam, Emma & Alexander o futuri matrimoni.
              </p>
            </div>

            <button
              onClick={() => setShowAddPackageModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Crea Nuovo Pacchetto</span>
            </button>
          </div>

          {myPackages.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-neutral-200 space-y-3">
              <Package className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-base font-semibold text-neutral-800">Nessun pacchetto ancora inserito</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Crea il tuo primo pacchetto (camere hotel, noleggio navette, tour in barca o servizio trucco) per renderlo disponibile per l'agenzia.
              </p>
              <button
                onClick={() => setShowAddPackageModal(true)}
                className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-xl"
              >
                Crea Pacchetto Ora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-all"
                >
                  <div>
                    {/* Immagine o copertina pacchetto */}
                    <div className="h-44 w-full bg-neutral-900 relative overflow-hidden">
                      <img
                        src={pkg.image || hotelSuiteImg}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-white text-neutral-900 shadow-2xs">
                          {pkg.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-purple-700 text-white">
                          Commissione {pkg.commissionPercent}% AD Marketing
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-lg font-serif-luxury font-bold leading-tight">{pkg.title}</div>
                        <div className="text-xs text-purple-200 font-mono mt-0.5">
                          €{pkg.pricePerUnit} / tariffa unitaria
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="text-xs text-neutral-700 font-medium flex items-center gap-1.5 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                        <Users className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>Capacità / Disponibilità: <strong>{pkg.capacityOrAvailability}</strong></span>
                      </div>

                      {/* Caratteristiche e plus inclusi */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                          Servizi & Plus Inclusi nel Pacchetto:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.includedFeatures.map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                            >
                              <Check className="w-2.5 h-2.5 text-purple-600" />
                              <span>{feat}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {pkg.notesForAgency && (
                        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900">
                          <span className="font-semibold block text-[10px] uppercase text-amber-700">Note per il Concierge Agenzia:</span>
                          <span>{pkg.notesForAgency}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Attivo nel catalogo matrimoni</span>
                    </span>

                    <span className="text-neutral-400 font-mono text-[11px]">
                      Creato il {pkg.createdAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHEDA 2: PRENOTAZIONI RICEVUTE DAGLI OSPITI                             */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Prenotazioni Ricevute dagli Ospiti del Matrimonio
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Ricezione in tempo reale quando l'ospite invia la conferma del voucher. In questa sezione puoi esaminare i dettagli e <strong>decidere come ricevere il pagamento</strong>.
              </p>
            </div>

            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Notifiche automatiche inviate a: <strong>{currentSupplier.email}</strong></span>
            </div>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-neutral-200 space-y-2">
              <Mail className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-base font-semibold text-neutral-800">Nessuna prenotazione ricevuta al momento</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Quando gli ospiti confermeranno i loro voucher dal portale, la prenotazione apparirà qui e riceverai la notifica immediata via email.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map((order) => {
                const isSelectedForAction = selectedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className={`border rounded-2xl p-5 sm:p-6 bg-white shadow-xs transition-all ${
                      isSelectedForAction ? 'border-purple-600 ring-2 ring-purple-100' : 'border-neutral-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Dati Ordine e Ospite */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            order.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {order.status === 'CONFIRMED' ? '✓ PRENOTAZIONE CONFERMATA' : '⏳ NUOVA PRENOTAZIONE DA GESTIRE'}
                          </span>

                          <span className="text-xs font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                            Matrimonio: {order.coupleNames} ({order.weddingCode})
                          </span>

                          <span className="text-[11px] text-neutral-500 font-mono">
                            Email ricevuta: {order.emailSentToSupplierAt}
                          </span>
                        </div>

                        <h3 className="text-base font-serif-luxury font-bold text-neutral-900">
                          {order.serviceTitle}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1">
                          <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Ospite Richiedente</span>
                            <span className="font-bold text-neutral-900">{order.guestName}</span>
                            <div className="text-[11px] text-neutral-600 font-mono mt-0.5">{order.guestEmail}</div>
                            {order.guestPhone && <div className="text-[11px] text-neutral-500">{order.guestPhone}</div>}
                          </div>

                          <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Data Richiesta & Pax</span>
                            <span className="font-bold text-neutral-900">{order.dateRequested}</span>
                            <div className="text-[11px] text-neutral-600 mt-0.5">Quantità / Pax: {order.participantsOrQuantity}</div>
                          </div>

                          <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
                            <span className="text-purple-700 block text-[10px] uppercase font-semibold">Importo Totale Servizio</span>
                            <span className="text-base font-mono font-bold text-purple-900">€{order.totalAmount}</span>
                            <div className="text-[10px] text-purple-700 mt-0.5">IVA e commissioni concordate incluse</div>
                          </div>
                        </div>

                        {order.guestNotes && (
                          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700">
                            <span className="font-semibold text-neutral-900">Note & Dettagli inseriti dall'ospite:</span>
                            <p className="mt-0.5 italic">{order.guestNotes}</p>
                          </div>
                        )}

                        {/* Riepilogo Metodo di Pagamento Scelto */}
                        {order.paymentMethodChosen && (
                          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                            <div className="font-bold flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Metodo di Pagamento Deciso dal Fornitore:</span>
                              <span className="uppercase font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300">
                                {order.paymentMethodChosen.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-emerald-950/90">{order.paymentNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Azioni del Fornitore */}
                      <div className="flex flex-col gap-2 shrink-0 sm:min-w-[200px]">
                        <button
                          onClick={() => {
                            setSelectedOrderId(isSelectedForAction ? null : order.id);
                            if (order.paymentMethodChosen) {
                              setPaymentChoice(order.paymentMethodChosen);
                            }
                            if (order.paymentNotes) {
                              setPaymentCustomNotes(order.paymentNotes);
                            }
                          }}
                          className="px-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                          <span>{order.paymentMethodChosen ? 'Modifica Metodo Pagamento' : 'Decidi Metodo di Pagamento'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Pannello Espandibile per la Decisione del Pagamento */}
                    {isSelectedForAction && (
                      <div className="mt-5 pt-5 border-t border-neutral-200 space-y-4 bg-neutral-50/60 p-5 rounded-xl">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-600" />
                            <span>Imposta Metodo di Saldo per {order.guestName}</span>
                          </h4>
                          <span className="text-xs text-neutral-500">Importo: <strong>€{order.totalAmount}</strong></span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => setPaymentChoice('DIRECT_AT_CHECKIN')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              paymentChoice === 'DIRECT_AT_CHECKIN'
                                ? 'bg-purple-900 text-white border-purple-900 shadow-2xs font-semibold'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="font-bold">1. Pagamento al Check-in</div>
                            <div className={`text-[11px] mt-1 ${paymentChoice === 'DIRECT_AT_CHECKIN' ? 'text-purple-200' : 'text-neutral-500'}`}>
                              L'ospite salda direttamente in struttura / all'imbarco (contanti o carta).
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentChoice('SUPPLIER_BANK_TRANSFER')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              paymentChoice === 'SUPPLIER_BANK_TRANSFER'
                                ? 'bg-purple-900 text-white border-purple-900 shadow-2xs font-semibold'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="font-bold">2. Bonifico Fornitore</div>
                            <div className={`text-[11px] mt-1 ${paymentChoice === 'SUPPLIER_BANK_TRANSFER' ? 'text-purple-200' : 'text-neutral-500'}`}>
                              Invio IBAN fornitore all'ospite per bonifico anticipato.
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentChoice('SUPPLIER_PAYMENT_LINK')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              paymentChoice === 'SUPPLIER_PAYMENT_LINK'
                                ? 'bg-purple-900 text-white border-purple-900 shadow-2xs font-semibold'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="font-bold">3. Link / POS Digitale</div>
                            <div className={`text-[11px] mt-1 ${paymentChoice === 'SUPPLIER_PAYMENT_LINK' ? 'text-purple-200' : 'text-neutral-500'}`}>
                              Invio link di pagamento carta (Stripe, Nexi o SumUp).
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentChoice('AGENCY_CENTRAL_BILLING')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              paymentChoice === 'AGENCY_CENTRAL_BILLING'
                                ? 'bg-purple-900 text-white border-purple-900 shadow-2xs font-semibold'
                                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="font-bold">4. Voucher AD Marketing</div>
                            <div className={`text-[11px] mt-1 ${paymentChoice === 'AGENCY_CENTRAL_BILLING' ? 'text-purple-200' : 'text-neutral-500'}`}>
                              Addebito centralizzato tramite conto agenzia concierge.
                            </div>
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Note Aggiuntive e Istruzioni per l'Ospite:
                          </label>
                          <input
                            type="text"
                            value={paymentCustomNotes}
                            onChange={(e) => setPaymentCustomNotes(e.target.value)}
                            placeholder="Es. Pagamento entro 7 giorni via bonifico, oppure presentarsi 15 minuti prima alla reception..."
                            className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-hidden"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderId(null)}
                            className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-200 rounded-xl"
                          >
                            Annulla
                          </button>

                          <button
                            type="button"
                            onClick={() => handleConfirmOrderPayment(order.id)}
                            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Invia Conferma e Istruzioni all'Ospite ({order.guestEmail})</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHEDA 3: DATI FORNITORE & COORDINATE BANCARIE                             */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl border border-neutral-200 rounded-2xl bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Profilo Aziendale e Dati per Fatturazione & Saldi
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Questi dati vengono utilizzati per la generazione dei contratti con AD Marketing e per le istruzioni di bonifico trasmesse agli ospiti dei matrimoni.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Ragione Sociale Fornitore</label>
              <input
                type="text"
                value={currentSupplier.name}
                disabled
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Categoria Servizio</label>
              <input
                type="text"
                value={currentSupplier.category}
                disabled
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email per Ricezione Prenotazioni</label>
              <input
                type="email"
                value={currentSupplier.email}
                disabled
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-purple-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Recapito Telefonico Urgenze</label>
              <input
                type="text"
                value={currentSupplier.phone}
                disabled
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Città / Sede Operativa</label>
              <input
                type="text"
                value={currentSupplier.city}
                disabled
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Commissione Riservata ad AD Marketing</label>
              <input
                type="text"
                value={`${currentSupplier.commissionPercent}% (Accordo Partner)`}
                disabled
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-emerald-800 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Note e Convenzioni con l'Agenzia</label>
              <textarea
                value={currentSupplier.notes}
                disabled
                rows={3}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE DI CREAZIONE NUOVO PACCHETTO                                       */}
      {/* ========================================================================= */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700">
                  Nuovo Pacchetto · {currentSupplier.name}
                </span>
                <h3 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-0.5">
                  Pubblica Pacchetto per l'Agenzia Matrimoni
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPackageModal(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Titolo Pacchetto / Esperienza / Servizio *
                </label>
                <input
                  type="text"
                  required
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  placeholder="Es. Pacchetto Suite Sposi & Colazione, oppure Tour In Barca Tramonto Polignano"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Categoria Servizio</label>
                  <select
                    value={newPkgCategory}
                    onChange={(e) => setNewPkgCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl"
                  >
                    <option value="HOTEL">HOTEL & ALLOGGIO</option>
                    <option value="TRANSFER">TRANSFER & NCC</option>
                    <option value="EXPERIENCE">ESPERIENZA & TOUR</option>
                    <option value="BEAUTY_HAIR">TRUCCO & PARRUCCO</option>
                    <option value="CATERING">CATERING & FOOD</option>
                    <option value="OTHER">ALTRO</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tariffa Unitaria (€) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Commissione AD Marketing (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={newPkgCommission}
                    onChange={(e) => setNewPkgCommission(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Disponibilità / Capacità Massima
                </label>
                <input
                  type="text"
                  value={newPkgCapacity}
                  onChange={(e) => setNewPkgCapacity(e.target.value)}
                  placeholder="Es. 20 camere bloccate, oppure Van da 8 posti, oppure Fino a 30 partecipanti"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Descrizione Approfondita del Pacchetto *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newPkgDescription}
                  onChange={(e) => setNewPkgDescription(e.target.value)}
                  placeholder="Descrivi cosa include il pacchetto, i punti di forza, la qualità dei materiali o del veicolo e i benefici per gli ospiti..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl leading-relaxed"
                />
              </div>

              {/* Tag Dettagli Inclusi */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Dettagli & Servizi Inclusi (Punti elenco per l'ospite)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newPkgFeatureText}
                    onChange={(e) => setNewPkgFeatureText(e.target.value)}
                    placeholder="Es. Colazione inclusa, Bottiglia di prosecco, Autista bilingue..."
                    className="flex-1 p-2 bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 bg-neutral-900 text-white font-semibold rounded-xl"
                  >
                    + Aggiungi
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {newPkgFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-900 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 border border-purple-200"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feat)}
                        className="hover:text-rose-600 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Scelta Immagine */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Seleziona Immagine di Copertina
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPkgImageChoice('hotel')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      newPkgImageChoice === 'hotel' ? 'border-purple-600 ring-2 ring-purple-200 font-bold' : 'border-neutral-200'
                    }`}
                  >
                    <img src={hotelSuiteImg} alt="Hotel" className="w-full h-16 object-cover rounded-lg mb-1" />
                    <span>Suite / Dimora</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPkgImageChoice('boat')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      newPkgImageChoice === 'boat' ? 'border-purple-600 ring-2 ring-purple-200 font-bold' : 'border-neutral-200'
                    }`}
                  >
                    <img src={boatTourImg} alt="Barca" className="w-full h-16 object-cover rounded-lg mb-1" />
                    <span>Barca / Mare</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPkgImageChoice('hero')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      newPkgImageChoice === 'hero' ? 'border-purple-600 ring-2 ring-purple-200 font-bold' : 'border-neutral-200'
                    }`}
                  >
                    <img src={heroBanner} alt="Resort" className="w-full h-16 object-cover rounded-lg mb-1" />
                    <span>Masseria / Borgo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Note Riservate per l'Agenzia AD Marketing
                </label>
                <input
                  type="text"
                  value={newPkgAgencyNotes}
                  onChange={(e) => setNewPkgAgencyNotes(e.target.value)}
                  placeholder="Es. Preavviso minimo 72 ore, flessibilità sui cambi nominativo..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl"
                >
                  Annulla
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs"
                >
                  Pubblica Pacchetto nel Catalogo Agenzia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
