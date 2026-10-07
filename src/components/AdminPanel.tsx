import { useState } from 'react';
import { 
  Building2, 
  Car, 
  Sparkles, 
  Users, 
  Plus, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink,
  ShieldCheck,
  Scissors,
  Receipt,
  CreditCard,
  TrendingUp,
  Settings,
  Mail,
  Send,
  Lightbulb,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Package
} from 'lucide-react';
import { 
  WeddingData, 
  HotelItem, 
  TransferItem, 
  ExperienceItem, 
  ExtraServiceItem,
  MasterSupplier,
  SupplierPackage,
  TouristWishRequest,
  ChatMessage,
  PaymentRequest,
  AdminSettings,
  GuestItem
} from '../data/weddingStore';

interface AdminPanelProps {
  weddings: WeddingData[];
  onUpdateWeddings: (updated: WeddingData[]) => void;
  suppliers: MasterSupplier[];
  onUpdateSuppliers: (updated: MasterSupplier[]) => void;
  packages: SupplierPackage[];
  wishRequests: TouristWishRequest[];
  onUpdateWishRequests: (updated: TouristWishRequest[]) => void;
  chatMessages: ChatMessage[];
  onReplyChatMessage: (reply: { weddingCode: string; guestName: string; guestEmail: string; text: string }) => void;
  adminSettings: AdminSettings;
  onUpdateAdminSettings: (updated: AdminSettings) => void;
  paymentRequests: PaymentRequest[];
  onUpdatePaymentRequests: (updated: PaymentRequest[]) => void;
  onLogout: () => void;
  onPreviewAsGuest: (weddingCode: string) => void;
}

export default function AdminPanel({
  weddings,
  onUpdateWeddings,
  suppliers,
  onUpdateSuppliers,
  packages,
  wishRequests,
  onUpdateWishRequests,
  chatMessages,
  onReplyChatMessage,
  adminSettings,
  onUpdateAdminSettings,
  paymentRequests,
  onUpdatePaymentRequests,
  onLogout,
  onPreviewAsGuest
}: AdminPanelProps) {
  const [selectedWeddingId, setSelectedWeddingId] = useState<string>(weddings[0]?.id || '');
  const [activeTab, setActiveTab] = useState<
    'whatsapp' | 'guests-summary' | 'accounting' | 'payments' | 'suppliers' | 'supplier-packages' | 'hotels' | 'transfers' | 'experiences' | 'services' | 'wishes' | 'chat' | 'settings' | 'new-wedding'
  >('whatsapp');

  const [packageImportedNotice, setPackageImportedNotice] = useState<string | null>(null);

  const [copiedMessage, setCopiedMessage] = useState(false);
  const [recipientName, setRecipientName] = useState('Eleanor & Jonathan');
  const [inviteLanguage, setInviteLanguage] = useState<'it' | 'en'>('it');

  // Filtro ospiti per tabella riepilogo
  const [guestSearch, setGuestSearch] = useState('');
  const [guestPaymentFilter, setGuestPaymentFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'FREE'>('ALL');

  // Stato Modulo Generazione Richiesta Pagamento
  const [selectedGuestForPayment, setSelectedGuestForPayment] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(180);
  const [paymentNote, setPaymentNote] = useState('Saldo transfer privato aeroporto e servizi selezionati');
  const [copiedPaymentEmail, setCopiedPaymentEmail] = useState(false);

  // Risposta chat di Valeria
  const [chatReplyText, setChatReplyText] = useState('');
  const [selectedChatGuestEmail, setSelectedChatGuestEmail] = useState<string>('');

  // Modale / Form Nuovo Fornitore Master
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [newSupName, setNewSupName] = useState('');
  const [newSupCat, setNewSupCat] = useState<'HOTEL' | 'TRANSFER' | 'EXPERIENCE' | 'BEAUTY_HAIR' | 'OTHER'>('HOTEL');
  const [newSupCity, setNewSupCity] = useState('');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupRate, setNewSupRate] = useState(250);
  const [newSupCommission, setNewSupCommission] = useState(15);

  // Form Nuovo Hotel
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [selectedSupplierForHotel, setSelectedSupplierForHotel] = useState<string>('');
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelStars, setNewHotelStars] = useState(5);
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelRate, setNewHotelRate] = useState(380);
  const [newHotelRoomsBlocked, setNewHotelRoomsBlocked] = useState(20);
  const [newHotelDeadline, setNewHotelDeadline] = useState('2026-07-15');

  // Form Nuovo Transfer
  const [showAddTransfer, setShowAddTransfer] = useState(false);
  const [newTransferTitle, setNewTransferTitle] = useState('');
  const [newTransferType, setNewTransferType] = useState<'AIRPORT_SHUTTLE' | 'PRIVATE_NCC' | 'VENUE_SHUTTLE'>('AIRPORT_SHUTTLE');
  const [newTransferPrice, setNewTransferPrice] = useState(35);
  const [newTransferIsPaidByCouple, setNewTransferIsPaidByCouple] = useState(false);

  // Form Nuova Esperienza
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpPrice, setNewExpPrice] = useState(80);
  const [newExpIsSponsored, setNewExpIsSponsored] = useState(false); // Esperienza offerta dagli sposi gratis!
  const [newExpDate, setNewExpDate] = useState('2026-09-11');
  const [newExpTime, setNewExpTime] = useState('18:00');

  // Form Impostazioni Email Notifiche
  const [currentNotificationEmail, setCurrentNotificationEmail] = useState(adminSettings.adminNotificationEmail);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Matrimonio selezionato
  const currentWedding = weddings.find(w => w.id === selectedWeddingId) || weddings[0];

  // Conteggio messaggi chat non letti
  const unreadMessagesCount = chatMessages.filter(m => !m.readByAdmin).length;

  // =========================================================================
  // 1. GENERATORE MESSAGGIO WHATSAPP (DAGLI SPOSI AI LORO OSPITI)
  // =========================================================================
  const generateWeddingWhatsAppMessage = () => {
    if (!currentWedding) return '';

    if (inviteLanguage === 'it') {
      return `✨ *Un messaggio speciale da ${currentWedding.coupleNames.toUpperCase()}* ✨

Carissimi *${recipientName || 'Amici e Parenti'}*,
Siamo al settimo cielo all'idea di avervi con noi in Puglia per festeggiare il nostro matrimonio il *${currentWedding.weddingDate}* presso *${currentWedding.venue}* (${currentWedding.city})! 💍

Per aiutarvi a organizzare comodamente il vostro soggiorno e il vostro viaggio, abbiamo messo a vostra disposizione la nostra piattaforma concierge dedicata:
🌟 *APULIAN WEDDING CONCIERGE*
Curata dalla nostra assistente personale *Valeria*, vi permetterà di:
🏨 Scegliere liberamente se soggiornare nei nostri hotel convenzionati
🚐 Prenotare navette aeroporto da Bari o Brindisi (o muovervi in autonomia)
🥂 Partecipare alle esperienze e alla festa pugliese che abbiamo organizzato per voi
💄 Prenotare trucco, parrucchiere o babysitting per la cerimonia

👉 *Accedi al portale con il nostro codice:*
🔑 *Codice Matrimonio:* \`${currentWedding.weddingCode}\`
🔗 *Link Diretto:* https://apulian-wedding-concierge.app/?code=${currentWedding.weddingCode}

Per qualsiasi richiesta o consiglio per la vacanza, potrete chattare direttamente con Valeria nel portale.
Non vediamo l'ora di abbracciarvi e festeggiare insieme! ❤️`;
    }

    // Versione Inglese per Ospiti Internazionali
    return `✨ *A special message from ${currentWedding.coupleNames.toUpperCase()}* ✨

Dearest *${recipientName || 'Friends & Family'}*,
We cannot wait to celebrate our destination wedding with you in Puglia on *${currentWedding.weddingDate}* at *${currentWedding.venue}* (${currentWedding.city}, Italy)! 💍

To make your journey and stay seamless and stress-free, we have partnered with our dedicated hospitality team to offer you:
🌟 *APULIAN WEDDING CONCIERGE*
Managed by our private assistant *Valeria*, the platform allows you to freely:
🏨 Reserve rooms at our pre-negotiated boutique hotels (or stay wherever you prefer)
🚐 Book airport shuttles from Bari/Brindisi or private chauffeur vans
🥂 Join our curated welcome parties and authentic experiences
💄 Book ceremony hair styling, makeup artists or English-speaking babysitters

👉 *Access your guest portal here:*
🔑 *Wedding Code:* \`${currentWedding.weddingCode}\`
🔗 *Direct Link:* https://apulian-wedding-concierge.app/?code=${currentWedding.weddingCode}

Feel free to message Valeria directly in the portal chat for any custom request or travel tip.
We cannot wait to toast together under the Puglian stars! ❤️`;
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWeddingWhatsAppMessage());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(generateWeddingWhatsAppMessage());
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // =========================================================================
  // 2. SALVATAGGIO NUOVO FORNITORE MASTER
  // =========================================================================
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim()) return;

    const newSup: MasterSupplier = {
      id: `sup-${Date.now()}`,
      name: newSupName.trim(),
      category: newSupCat,
      city: newSupCity.trim() || 'Puglia',
      contactPerson: newSupContact.trim(),
      email: newSupEmail.trim(),
      phone: newSupPhone.trim(),
      standardRate: Number(newSupRate),
      commissionPercent: Number(newSupCommission),
      notes: 'Fornitore aggiunto dal pannello amministrazione.'
    };

    onUpdateSuppliers([...suppliers, newSup]);
    setShowAddSupplier(false);
    setNewSupName('');
  };

  // =========================================================================
  // 2B. IMPORTA PACCHETTO FORNITORE NEL MATRIMONIO ATTIVO
  // =========================================================================
  const handleImportPackageToWedding = (pkg: SupplierPackage) => {
    const updated = weddings.map(w => {
      if (w.id === currentWedding.id) {
        if (pkg.category === 'HOTEL') {
          const newHotel: HotelItem = {
            id: `hotel-imp-${Date.now()}`,
            name: `${pkg.supplierName} - ${pkg.title}`,
            stars: 5,
            address: 'Puglia, Italia',
            distanceToVenue: 'Sede convenzionata',
            negotiatedRate: pkg.pricePerUnit,
            currency: 'EUR',
            bookingDeadline: '2026-07-31',
            groupCode: `WED-${w.weddingCode.substring(0, 5)}`,
            supplierId: pkg.supplierId,
            image: pkg.image,
            roomTypes: [
              {
                id: `rt-imp-${Date.now()}`,
                name: pkg.title,
                pricePerNight: pkg.pricePerUnit,
                totalBlocked: 20,
                availableRooms: 20,
                maxOccupancy: 2
              }
            ]
          };
          return { ...w, hotels: [...w.hotels, newHotel] };
        } else if (pkg.category === 'TRANSFER') {
          const newTr: TransferItem = {
            id: `tr-imp-${Date.now()}`,
            type: 'AIRPORT_SHUTTLE',
            title: `${pkg.supplierName}: ${pkg.title}`,
            origin: 'Bari (BRI) o Brindisi (BDS)',
            destination: w.venue,
            departureTime: 'Orario concordato su volo',
            vehicleType: 'Mercedes Luxury Van',
            capacity: 16,
            bookedSeats: 0,
            pricePerSeat: pkg.pricePerUnit,
            isPaidByCouple: false,
            supplierId: pkg.supplierId
          };
          return { ...w, transfers: [...w.transfers, newTr] };
        } else if (pkg.category === 'EXPERIENCE') {
          const newExp: ExperienceItem = {
            id: `exp-imp-${Date.now()}`,
            title: pkg.title,
            category: 'BOAT_TOUR',
            eventDate: w.weddingDate,
            startTime: '17:30 - 20:00',
            durationHours: 3,
            meetingPoint: 'Punto di ritrovo concordato',
            pricePerPerson: pkg.pricePerUnit,
            isHostSponsored: false,
            maxParticipants: 25,
            bookedParticipants: 0,
            description: pkg.description,
            supplierId: pkg.supplierId,
            image: pkg.image
          };
          return { ...w, experiences: [...w.experiences, newExp] };
        } else {
          // BEAUTY_HAIR o ALTRO
          const newSrv: ExtraServiceItem = {
            id: `srv-imp-${Date.now()}`,
            title: pkg.title,
            category: pkg.category === 'BEAUTY_HAIR' ? 'MAKEUP' : 'HAIR_STYLING',
            price: pkg.pricePerUnit,
            isPaidByCouple: false,
            duration: '45 min',
            description: pkg.description,
            providerName: pkg.supplierName
          };
          return { ...w, extraServices: [...(w.extraServices || []), newSrv] };
        }
      }
      return w;
    });

    onUpdateWeddings(updated);
    setPackageImportedNotice(`Pacchetto "${pkg.title}" di ${pkg.supplierName} importato con successo nel matrimonio di ${currentWedding.coupleNames}!`);
    setTimeout(() => setPackageImportedNotice(null), 4000);
  };

  // =========================================================================
  // 3. AGGIUNGI HOTEL DAL DATABASE O NUOVO
  // =========================================================================
  const handleSaveHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim()) return;

    const newHotel: HotelItem = {
      id: `hotel-${Date.now()}`,
      name: newHotelName.trim(),
      stars: Number(newHotelStars),
      address: newHotelAddress.trim() || 'Puglia, Italia',
      distanceToVenue: '10 min dalla cerimonia',
      negotiatedRate: Number(newHotelRate),
      currency: 'EUR',
      bookingDeadline: newHotelDeadline,
      groupCode: `WED-${currentWedding.weddingCode.substring(0, 5)}`,
      supplierId: selectedSupplierForHotel || undefined,
      roomTypes: [
        {
          id: `rt-${Date.now()}`,
          name: 'Camera Deluxe Masseria',
          pricePerNight: Number(newHotelRate),
          totalBlocked: Number(newHotelRoomsBlocked),
          availableRooms: Number(newHotelRoomsBlocked),
          maxOccupancy: 2
        }
      ]
    };

    const updated = weddings.map(w => {
      if (w.id === currentWedding.id) {
        return { ...w, hotels: [...w.hotels, newHotel] };
      }
      return w;
    });

    onUpdateWeddings(updated);
    setShowAddHotel(false);
    setNewHotelName('');
  };

  // =========================================================================
  // 4. GENERATORE EMAIL RICHIESTA PAGAMENTO
  // =========================================================================
  const handleGeneratePaymentRequest = () => {
    if (!selectedGuestForPayment) return;
    const guest = currentWedding.guests.find(g => g.email === selectedGuestForPayment);
    if (!guest) return;

    const newPayReq: PaymentRequest = {
      id: `pay-${Date.now()}`,
      weddingCode: currentWedding.weddingCode,
      guestName: guest.name,
      guestEmail: guest.email,
      amount: Number(paymentAmount),
      currency: 'EUR',
      items: [
        { description: paymentNote, amount: Number(paymentAmount) }
      ],
      status: 'SENT',
      sentAt: new Date().toISOString().split('T')[0],
      paymentMethod: 'STRIPE_LINK',
      invoiceCode: `INV-${Date.now().toString().substring(7)}`
    };

    onUpdatePaymentRequests([...paymentRequests, newPayReq]);
  };

  const getPaymentEmailText = () => {
    const guest = currentWedding.guests.find(g => g.email === selectedGuestForPayment) || currentWedding.guests[0];
    if (!guest) return '';

    return `Oggetto: Conferma Servizi e Ricevuta Pagamento - Matrimonio ${currentWedding.coupleNames} | Apulian Wedding Concierge

Gentile ${guest.name},
Grazie per aver scelto i servizi di assistenza di Apulian Wedding Concierge (AD Marketing) per il matrimonio di ${currentWedding.coupleNames}.

Di seguito il riepilogo delle voci selezionate per il vostro soggiorno:
• Descrizione: ${paymentNote}
• Importo Totale: €${paymentAmount} (IVA inclusa)

Per completare la prenotazione definitiva e confermare i transfer/servizi con i nostri fornitori, vi preghiamo di effettuare il pagamento entro 5 giorni lavorativi tramite uno dei seguenti metodi:

1) CARTA DI CREDITO / ONLINE (Immediato e Sicuro con Stripe):
👉 ${adminSettings.stripePaymentLink}

2) BONIFICO BANCARIO:
• Intestatario: ${adminSettings.agencyLegalName}
• Banca: Unicredit Banca
• IBAN: ${adminSettings.defaultIban}
• BIC/SWIFT: ${adminSettings.defaultBic}
• Causale: SALDO SERVIZI ${guest.name.toUpperCase()} - ${currentWedding.weddingCode}

Una volta ricevuto il saldo, il vostro voucher definitivo sarà aggiornato come "PAGATO".
A disposizione per qualsiasi necessità!

Valeria & Team Concierge AD Marketing
Palagianello (TA) - Puglia
Tel: ${adminSettings.agencyPhone} | Email: ${adminSettings.adminNotificationEmail}`;
  };

  const handleCopyPaymentEmail = () => {
    navigator.clipboard.writeText(getPaymentEmailText());
    setCopiedPaymentEmail(true);
    setTimeout(() => setCopiedPaymentEmail(false), 2000);
  };

  // Rispondi al messaggio ospite in chat
  const handleSendChatReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatReplyText.trim() || !selectedChatGuestEmail) return;

    const guest = currentWedding.guests.find(g => g.email === selectedChatGuestEmail);

    onReplyChatMessage({
      weddingCode: currentWedding.weddingCode,
      guestName: guest?.name || 'Ospite',
      guestEmail: selectedChatGuestEmail,
      text: chatReplyText.trim()
    });

    setChatReplyText('');
  };

  // Salva email notifiche
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAdminSettings({
      ...adminSettings,
      adminNotificationEmail: currentNotificationEmail.trim()
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Calcoli Contabilità
  const totalGrossRevenue = weddings.reduce((acc, w) => {
    const weddingTotal = w.guests.reduce((gAcc, g) => gAcc + (g.totalAmountDue || 0), 0);
    return acc + weddingTotal;
  }, 0);

  const totalPaidRevenue = weddings.reduce((acc, w) => {
    const weddingTotal = w.guests
      .filter(g => g.paymentStatus === 'PAID')
      .reduce((gAcc, g) => gAcc + (g.totalAmountDue || 0), 0);
    return acc + weddingTotal;
  }, 0);

  const agencyEstimatedCommission = Math.round(totalGrossRevenue * 0.18); // Stima 18% commissione agenzia AD Marketing

  return (
    <div className="space-y-6">
      {/* Top Banner Back Office */}
      <div className="border border-neutral-200 bg-white p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
            <span>Area Riservata Direzionale</span>
            <span aria-hidden="true">·</span>
            <span>AD Marketing · Palagianello (TA)</span>
          </div>
          <h1 className="text-2xl font-serif-luxury font-bold text-neutral-900 mt-1">
            Apulian Wedding Concierge · Back Office
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Gestisci inviti WhatsApp sposi, catalogo fornitori, riepilogo scelte ospiti, chat interna con Valeria e analisi contabilità ricavi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onPreviewAsGuest(currentWedding.weddingCode)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Anteprima Ospite ({currentWedding.weddingCode})</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
          >
            Esci
          </button>
        </div>
      </div>

      {/* Selettore Matrimonio Attivo */}
      <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider shrink-0">
            Matrimonio in Lavorazione:
          </span>
          <select
            value={selectedWeddingId}
            onChange={(e) => setSelectedWeddingId(e.target.value)}
            className="text-xs font-semibold bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 focus:outline-hidden"
          >
            {weddings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.coupleNames} — {w.weddingCode} ({w.city})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {unreadMessagesCount > 0 && (
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-lg animate-pulse"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{unreadMessagesCount} Nuovi Messaggi Chat Valeria</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('new-wedding')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'new-wedding'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nuovo Matrimonio</span>
          </button>
        </div>
      </div>

      {/* Navigazione Moduli Back End */}
      <div className="flex items-center gap-1 border-b border-neutral-200 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'whatsapp' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Invito WhatsApp Sposi</span>
        </button>

        <button
          onClick={() => setActiveTab('guests-summary')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'guests-summary' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>Riepilogo Scelte Ospiti ({currentWedding.guests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accounting')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'accounting' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Contabilità & Analisi Ricavi</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'payments' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-400" />
          <span>Richieste di Pagamento</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'suppliers' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-purple-400" />
          <span>Database Fornitori Master ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supplier-packages')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'supplier-packages' ? 'bg-purple-900 text-white font-semibold shadow-2xs' : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
          }`}
        >
          <Package className="w-4 h-4 text-purple-400" />
          <span>Pacchetti Fornitori ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'hotels' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <span>Hotel Matrimonio ({currentWedding.hotels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'transfers' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <span>Transfer ({currentWedding.transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'experiences' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <span>Esperienze ({currentWedding.experiences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishes')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'wishes' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Desideri Ospiti ({wishRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'chat' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-500" />
          <span>Chat Valeria {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors shrink-0 ${
            activeTab === 'settings' ? 'bg-neutral-900 text-white font-semibold shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Email & Info AD Marketing</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. INVITO WHATSAPP DEGLI SPOSI PER I PROPRI OSPITI                        */}
      {/* ========================================================================= */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Messaggio dagli Sposi
              </span>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 mt-0.5">
                Invito Ufficiale con Accesso Concierge
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Questo messaggio viene inviato dagli sposi ({currentWedding.coupleNames}) ai loro invitati per informarli che possono usufruire gratuitamente della piattaforma <strong>Apulian Wedding Concierge</strong> e dell'assistente Valeria per organizzare hotel, navette ed esperienze.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Nome Ospite / Famiglia Ricevente
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Es. Eleanor & Jonathan"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Lingua Messaggio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteLanguage('it')}
                    className={`p-2 rounded-xl font-medium border text-center transition-colors cursor-pointer ${
                      inviteLanguage === 'it' ? 'bg-neutral-900 text-white border-neutral-900 font-semibold' : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    Italiano 🇮🇹
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteLanguage('en')}
                    className={`p-2 rounded-xl font-medium border text-center transition-colors cursor-pointer ${
                      inviteLanguage === 'en' ? 'bg-neutral-900 text-white border-neutral-900 font-semibold' : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    Inglese (Ospiti Esteri) 🇬🇧
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Dati inclusi automaticamente:</span>
                </div>
                <div>• Sposi: {currentWedding.coupleNames}</div>
                <div>• Luogo & Data: {currentWedding.venue} ({currentWedding.city}) · {currentWedding.weddingDate}</div>
                <div>• Codice d'accesso: <strong className="font-mono">{currentWedding.weddingCode}</strong></div>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMessage ? 'Testo Copiato!' : 'Copia Messaggio per WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Apri e Invia su WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 border border-neutral-800 rounded-2xl bg-neutral-900 text-neutral-100 p-6 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="font-semibold text-neutral-200">Anteprima Schermo WhatsApp</span>
              </div>
              <span className="text-neutral-500 font-mono text-[11px]">Messaggio dagli Sposi a {recipientName || 'Invitato'}</span>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-100 font-sans text-xs leading-relaxed whitespace-pre-wrap shadow-inner">
              {generateWeddingWhatsAppMessage()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RIEPILOGO COMPLETO OSPITI LOGGATI E SCELTE FATTE                       */}
      {/* ========================================================================= */}
      {activeTab === 'guests-summary' && (
        <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Riepilogo Scelte Ospiti · {currentWedding.coupleNames}
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Quadro analitico in tempo reale di tutti gli ospiti loggati, hotel e camere scelte, transfer aeroportuali e servizi richiesti.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cerca ospite o paese..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <select
                value={guestPaymentFilter}
                onChange={(e) => setGuestPaymentFilter(e.target.value as any)}
                className="text-xs bg-neutral-50 border border-neutral-300 rounded-xl px-2.5 py-1.5"
              >
                <option value="ALL">Tutti gli Stati</option>
                <option value="PAID">Saldati</option>
                <option value="PENDING">In Attesa Saldo</option>
                <option value="FREE">Solo Servizi Gratuiti</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-700 font-semibold border-b border-neutral-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Ospite</th>
                  <th className="py-3 px-3">Alloggio Selezionato</th>
                  <th className="py-3 px-3">Transfer & Volo</th>
                  <th className="py-3 px-3">Esperienze</th>
                  <th className="py-3 px-3">Servizi Beauty / Extra</th>
                  <th className="py-3 px-3 text-right">Totale Dovuto</th>
                  <th className="py-3 px-3 text-center">Stato Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {currentWedding.guests
                  .filter(g => {
                    const matchText = g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
                                      g.country.toLowerCase().includes(guestSearch.toLowerCase());
                    const matchStatus = guestPaymentFilter === 'ALL' || g.paymentStatus === guestPaymentFilter;
                    return matchText && matchStatus;
                  })
                  .map((g) => (
                    <tr key={g.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                          <span>{g.flag}</span>
                          <span>{g.name}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">{g.email}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{g.country}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-neutral-800">{g.hotelBooked}</div>
                        <div className="text-[11px] text-neutral-500">{g.roomType}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-neutral-800">{g.transferBooked}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{g.flight}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          {g.experiences.map((exp, idx) => (
                            <div key={idx} className="text-[11px] text-neutral-700">• {exp}</div>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {g.extraServices && g.extraServices.length > 0 ? (
                          <div className="space-y-0.5">
                            {g.extraServices.map((srv, idx) => (
                              <div key={idx} className="text-[11px] text-purple-700">• {srv}</div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Nessun servizio extra</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900">
                        €{g.totalAmountDue}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {g.paymentStatus === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Saldato
                          </span>
                        ) : g.paymentStatus === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            In Sospeso
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600">
                            Gratuito (Sposi)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SEZIONE CONTABILITÀ & ANALISI DEI RICAVI                                */}
      {/* ========================================================================= */}
      {activeTab === 'accounting' && (
        <div className="space-y-6">
          <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Analisi Ricavi e Contabilità Wedding Concierge
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Monitoraggio finanziario dei ricavi generati da hotel, transfer, esperienze e servizi beauty per matrimonio e periodo dell'anno.
              </p>
            </div>

            {/* Metriche Finanziarie Schede */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Transato Lordo Ospiti
                </span>
                <div className="text-2xl font-mono font-bold text-neutral-900">
                  €{totalGrossRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-500">Tutti i matrimoni attivi</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Totale Incassato Effettivo
                </span>
                <div className="text-2xl font-mono font-bold text-emerald-700">
                  €{totalPaidRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">Bonifici & Carte saldate</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Commissioni Nette AD Marketing (18%)
                </span>
                <div className="text-2xl font-mono font-bold text-amber-700">
                  €{agencyEstimatedCommission.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-500">Margine concierge stimato</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Spesa Media per Ospite
                </span>
                <div className="text-2xl font-mono font-bold text-neutral-900">
                  €225
                </div>
                <div className="text-[11px] text-neutral-500">Esclusi servizi offerti dagli sposi</div>
              </div>
            </div>

            {/* Breakdown per Matrimonio e Periodo dell'Anno */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-neutral-200">
              {/* Ricavi per Matrimonio */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Ricavi per Matrimonio</span>
                </h3>

                <div className="space-y-2 text-xs">
                  {weddings.map((w) => {
                    const wedTotal = w.guests.reduce((acc, g) => acc + (g.totalAmountDue || 0), 0);
                    return (
                      <div key={w.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-neutral-900">{w.coupleNames}</div>
                          <div className="text-neutral-500 text-[11px]">{w.weddingDate} · {w.city}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-neutral-900">€{wedTotal}</div>
                          <div className="text-[11px] text-neutral-500">{w.guests.length} ospiti registrati</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Analisi per Periodo dell'Anno */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Stagionalità & Periodo dell'Anno</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-neutral-900">Settembre (Alta Stagione Puglia)</div>
                      <div className="text-neutral-500 text-[11px]">Borgo Egnazia, Masserie Valle d'Itria</div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">€545 (65% del totale)</span>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-neutral-900">Giugno (Inizio Estate)</div>
                      <div className="text-neutral-500 text-[11px]">Matrimoni Lago di Como & Salento</div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">€250 (35% del totale)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RICHIESTE DI PAGAMENTO (GENERATORE EMAIL SALDO)                        */}
      {/* ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Generatore Email Richiesta di Pagamento
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Produci un'email formattata con coordinate bancarie o link Stripe per incassare i servizi a pagamento scelti dagli ospiti.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Configurazione Richiesta */}
            <div className="lg:col-span-5 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Seleziona Ospite
                </label>
                <select
                  value={selectedGuestForPayment}
                  onChange={(e) => {
                    setSelectedGuestForPayment(e.target.value);
                    const g = currentWedding.guests.find(item => item.email === e.target.value);
                    if (g) {
                      setPaymentAmount(g.totalAmountDue || 150);
                    }
                  }}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                >
                  <option value="">-- Seleziona un ospite --</option>
                  {currentWedding.guests.map((g) => (
                    <option key={g.id} value={g.email}>
                      {g.name} ({g.email}) — Totale: €{g.totalAmountDue}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Importo da Richiedere (€)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Voci e Servizi Inclusi
                </label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCopyPaymentEmail}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                >
                  {copiedPaymentEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPaymentEmail ? 'Email Copiata!' : 'Copia Testo Email per l\'Ospite'}</span>
                </button>
              </div>
            </div>

            {/* Anteprima Email */}
            <div className="lg:col-span-7 p-5 bg-neutral-950 text-neutral-200 rounded-2xl border border-neutral-800 text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-md">
              {getPaymentEmailText() || 'Seleziona un ospite dal menu a sinistra per generare l\'email di pagamento.'}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DATABASE FORNITORI MASTER                                              */}
      {/* ========================================================================= */}
      {activeTab === 'suppliers' && (
        <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Database Master Fornitori & Hotel
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Archivio centralizzato di hotel, masserie, aziende NCC, cantine e truccatori. Quando crei un matrimonio, il sistema ti proporrà automaticamente i fornitori registrati qui.
              </p>
            </div>

            <button
              onClick={() => setShowAddSupplier(!showAddSupplier)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddSupplier ? 'Chiudi' : 'Nuovo Fornitore Master'}</span>
            </button>
          </div>

          {showAddSupplier && (
            <form onSubmit={handleSaveSupplier} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-300 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-neutral-900">Registra Fornitore nel Database</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nome Fornitore / Hotel</label>
                  <input
                    type="text"
                    required
                    value={newSupName}
                    onChange={(e) => setNewSupName(e.target.value)}
                    placeholder="Es. Masseria San Domenico"
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Categoria</label>
                  <select
                    value={newSupCat}
                    onChange={(e) => setNewSupCat(e.target.value as any)}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xl"
                  >
                    <option value="HOTEL">Hotel / Resort / Masseria</option>
                    <option value="TRANSFER">Transfer Aeroporto / NCC</option>
                    <option value="EXPERIENCE">Gite in Barca / Tour Enogastronomici</option>
                    <option value="BEAUTY_HAIR">Make-up Artist / Parrucchiere</option>
                    <option value="OTHER">Altro Servizio</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Città / Località</label>
                  <input
                    type="text"
                    value={newSupCity}
                    onChange={(e) => setNewSupCity(e.target.value)}
                    placeholder="Es. Savelletri di Fasano (BR)"
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Referente / Contatto</label>
                  <input
                    type="text"
                    value={newSupContact}
                    onChange={(e) => setNewSupContact(e.target.value)}
                    placeholder="Es. Silvia Melpignano"
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newSupEmail}
                    onChange={(e) => setNewSupEmail(e.target.value)}
                    placeholder="booking@masseria.it"
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Telefono</label>
                  <input
                    type="text"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    placeholder="+39 080 ..."
                    className="w-full p-2 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  className="px-3 py-1.5 text-neutral-700 hover:bg-neutral-200 rounded-xl"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800"
                >
                  Salva nel Database
                </button>
              </div>
            </form>
          )}

          {/* Griglia Fornitori Registrati */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-800">
                    {s.category}
                  </span>
                  <span className="font-mono text-neutral-500">Comm: {s.commissionPercent}%</span>
                </div>

                <h3 className="font-bold text-sm text-neutral-900">{s.name}</h3>
                <p className="text-neutral-500">{s.city} · {s.contactPerson}</p>
                <div className="text-[11px] text-neutral-600 font-mono">{s.phone} | {s.email}</div>
                <p className="text-[11px] text-neutral-500 italic pt-1">{s.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5B. PACCHETTI INSERITI DAI FORNITORI PARTNER (DISPONIBILI PER I MATRIMONI)*/}
      {/* ========================================================================= */}
      {activeTab === 'supplier-packages' && (
        <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">
                Offerte & Proposte Fornitori
              </span>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-0.5">
                Pacchetti Inseriti dai Fornitori Partner ({packages.length})
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Questi pacchetti sono stati creati direttamente dalle aziende partner (hotel, masserie, compagnie NCC, skipper). Con 1 click puoi <strong>importarli e abilitarli per il matrimonio di {currentWedding.coupleNames}</strong>.
              </p>
            </div>

            <div className="text-xs p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 font-semibold self-start sm:self-auto">
              Destinazione Attiva: {currentWedding.coupleNames} ({currentWedding.weddingCode})
            </div>
          </div>

          {packageImportedNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{packageImportedNotice}</span>
            </div>
          )}

          {packages.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-50 border border-neutral-200 text-neutral-500 text-xs">
              Nessun pacchetto attualmente disponibile dai fornitori partner.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between hover:border-neutral-300 transition-all"
                >
                  <div>
                    {pkg.image && (
                      <div className="h-40 w-full bg-neutral-900 relative overflow-hidden">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-neutral-900">
                            {pkg.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-700 text-white">
                            Comm: {pkg.commissionPercent}% AD Marketing
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <div className="text-base font-serif-luxury font-bold leading-tight">{pkg.title}</div>
                          <div className="text-xs text-purple-200 font-mono mt-0.5">€{pkg.pricePerUnit} / unità</div>
                        </div>
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      {!pkg.image && (
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                              {pkg.category}
                            </span>
                            <h3 className="text-base font-serif-luxury font-bold text-neutral-900 mt-1">{pkg.title}</h3>
                          </div>
                          <span className="text-sm font-mono font-bold text-purple-900">€{pkg.pricePerUnit}</span>
                        </div>
                      )}

                      <div className="text-xs text-neutral-500 font-medium flex items-center justify-between">
                        <span>Fornitore: <strong className="text-neutral-900">{pkg.supplierName}</strong></span>
                        <span className="font-mono text-[11px] text-neutral-400">{pkg.supplierEmail}</span>
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="text-xs bg-neutral-50 p-2 rounded-lg border border-neutral-200 text-neutral-700">
                        <span>Capacità / Blocco: <strong>{pkg.capacityOrAvailability}</strong></span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                          Elementi inclusi nel pacchetto:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.includedFeatures.map((f, i) => (
                            <span key={i} className="text-[11px] bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 text-purple-600" />
                              <span>{f}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {pkg.notesForAgency && (
                        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900">
                          <span className="font-semibold block text-[10px] uppercase text-amber-700">Note Fornitore per l'Agenzia:</span>
                          <span>{pkg.notesForAgency}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Data inserimento: {pkg.createdAt}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleImportPackageToWedding(pkg)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Importa nel Matrimonio Attivo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DESIDERI OSPITI & RICHIESTE SU MISURA                                  */}
      {/* ========================================================================= */}
      {activeTab === 'wishes' && (
        <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Desideri & Proposte su Misura Inviate dagli Ospiti
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Richieste speciali dei turisti (es. noleggio Vespe, passeggiate a cavallo, barche private). Da qui puoi impacchettarle, definire il prezzo e inviare la proposta.
            </p>
          </div>

          <div className="space-y-4">
            {wishRequests.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs">
                Nessuna richiesta speciale ricevuta al momento.
              </div>
            ) : (
              wishRequests.map((wish) => (
                <div key={wish.id} className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {wish.status === 'PROPOSAL_READY' ? 'Proposta Pronta' : 'Nuova Richiesta Ricevuta'}
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900 mt-1">{wish.title}</h3>
                    </div>
                    <div className="text-right text-[11px] text-neutral-500">
                      <div>Inviato da: <strong>{wish.guestName}</strong> ({wish.guestEmail})</div>
                      <div>Data richiesta: {wish.preferredDate || 'Flessibile'} · {wish.participantsCount} pax</div>
                    </div>
                  </div>

                  <p className="text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-neutral-200">
                    "{wish.description}"
                  </p>

                  {wish.agencyNotes && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                      <strong>Note operative Agenzia AD Marketing:</strong> {wish.agencyNotes}
                      {wish.proposedCost && <div className="mt-1 font-mono font-bold">Costo proposto all'ospite: €{wish.proposedCost}</div>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CHAT ASSISTENZA CON VALERIA & NOTIFICHE STAFF                          */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Centrale Chat Assistente Valeria
              </h2>
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              Messaggi scambiati tra gli ospiti e Valeria. Quando un ospite scrive, lo staff di AD Marketing viene notificato immediatamente sapendo già il matrimonio e l'identità dell'ospite.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Elenco Conversazioni per Ospite */}
            <div className="lg:col-span-4 border border-neutral-200 rounded-2xl bg-neutral-50 p-3 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block px-2">
                Conversazioni Attive
              </span>

              {currentWedding.guests.map((g) => {
                const guestMsgs = chatMessages.filter(m => m.guestEmail.toLowerCase() === g.email.toLowerCase());
                const lastMsg = guestMsgs[guestMsgs.length - 1];
                const isSelected = selectedChatGuestEmail === g.email;

                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedChatGuestEmail(g.email)}
                    className={`w-full text-left p-3 rounded-xl transition-colors cursor-pointer ${
                      isSelected ? 'bg-white shadow-2xs border border-neutral-300' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-neutral-900">{g.name}</span>
                      <span className="text-[10px] text-neutral-400">{g.flag}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : 'Nessun messaggio recente'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Area Dettaglio Chat & Risposta */}
            <div className="lg:col-span-8 border border-neutral-200 rounded-2xl bg-white p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
                <div>
                  <span className="font-bold text-neutral-900">
                    Chat con: {selectedChatGuestEmail || 'Seleziona un ospite dalla lista a sinistra'}
                  </span>
                  <div className="text-[11px] text-neutral-500">
                    Matrimonio: {currentWedding.coupleNames} ({currentWedding.weddingCode})
                  </div>
                </div>
              </div>

              {/* Messaggi */}
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-neutral-50 rounded-xl">
                {chatMessages
                  .filter(m => m.guestEmail.toLowerCase() === selectedChatGuestEmail.toLowerCase())
                  .map((m) => {
                    const isValeria = m.sender === 'valeria';
                    return (
                      <div key={m.id} className={`flex ${isValeria ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                          isValeria ? 'bg-emerald-800 text-white' : 'bg-white border border-neutral-200 text-neutral-900'
                        }`}>
                          <div className={`text-[10px] font-semibold ${isValeria ? 'text-emerald-200' : 'text-neutral-500'}`}>
                            {isValeria ? 'Valeria (Concierge)' : m.guestName}
                          </div>
                          <p>{m.text}</p>
                          <div className={`text-[9px] text-right ${isValeria ? 'text-emerald-300' : 'text-neutral-400'}`}>
                            {m.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Form Risposta Valeria */}
              <form onSubmit={handleSendChatReply} className="flex gap-2">
                <input
                  type="text"
                  value={chatReplyText}
                  onChange={(e) => setChatReplyText(e.target.value)}
                  placeholder="Scrivi la risposta di Valeria per l'ospite..."
                  className="flex-1 text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!selectedChatGuestEmail}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
                >
                  Invia Risposta
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. IMPOSTAZIONI EMAIL NOTIFICHE & DATI AZIENDALI AD MARKETING             */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto border border-neutral-200 rounded-2xl bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Impostazioni Notifiche & Dati Agenzia AD Marketing
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Configura l'indirizzo email a cui vengono inviati automaticamente tutti i voucher e le notifiche di prenotazione ospiti.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Impostazioni salvate con successo! I prossimi voucher saranno inviati a questo indirizzo.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Indirizzo Email Notifiche Amministrazione (Destinatario Voucher)
              </label>
              <input
                type="email"
                required
                value={currentNotificationEmail}
                onChange={(e) => setCurrentNotificationEmail(e.target.value)}
                placeholder="info@admarketing.it"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Ogni volta che un ospite genera o invia il proprio voucher, una copia conforme viene recapitata qui.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <h3 className="font-bold text-xs text-neutral-900">Dati Legali e Sede (AD Marketing - Palagianello)</h3>
              <div className="grid grid-cols-2 gap-3 text-neutral-600">
                <div>
                  <span className="font-semibold block text-neutral-800">Ragione Sociale:</span>
                  <span>{adminSettings.agencyLegalName}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-800">Partita IVA / C.F.:</span>
                  <span className="font-mono">{adminSettings.agencyVat}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-800">Sede Legale:</span>
                  <span>{adminSettings.agencyAddress}, {adminSettings.agencyCity}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-800">Telefono Centrale:</span>
                  <span>{adminSettings.agencyPhone}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Salva Nuove Impostazioni
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
