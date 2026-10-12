import { useState, useEffect } from 'react';
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
  Package,
  Heart,
  Calendar,
  MapPin,
  Key,
  Globe,
  Trash2,
  RotateCcw,
  Sliders,
  Tag,
  Clock,
  Edit3
} from 'lucide-react';
import heroBanner from '../assets/images/wedding_concierge_hero_1791309110090.jpg';
import hotelSuiteImg from '../assets/images/wedding_hotel_suite_1791309120679.jpg';
import boatTourImg from '../assets/images/wedding_boat_experience_1791309131765.jpg';
import { 
  WeddingData, 
  HotelItem, 
  RoomTypeItem,
  TransferItem, 
  ExperienceItem, 
  ExtraServiceItem,
  MasterSupplier,
  SupplierPackage,
  SupplierBookingOrder,
  TouristWishRequest,
  ChatMessage,
  PaymentRequest,
  AdminSettings,
  GuestItem
} from '../data/weddingStore';

interface AdminPanelProps {
  weddings: WeddingData[];
  onUpdateWeddings: (updated: WeddingData[]) => void;
  onResetToDemoWedding?: () => void;
  suppliers: MasterSupplier[];
  onUpdateSuppliers: (updated: MasterSupplier[]) => void;
  packages: SupplierPackage[];
  bookingOrders?: SupplierBookingOrder[];
  onUpdateBookingOrders?: (updated: SupplierBookingOrder[]) => void;
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
  onResetToDemoWedding,
  suppliers,
  onUpdateSuppliers,
  packages,
  bookingOrders = [],
  onUpdateBookingOrders,
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

  // Cancellazione matrimonio di test (permette di ripulire i test lasciando solo i matrimoni voluti)
  const handleDeleteWedding = (weddingId: string) => {
    if (weddings.length <= 1) {
      alert("Impossibile eliminare l'unico matrimonio rimasto. Mantieni almeno un matrimonio attivo per i test.");
      return;
    }
    const target = weddings.find(w => w.id === weddingId);
    const confirmMsg = `Vuoi davvero eliminare il matrimonio di "${target?.coupleNames || weddingId}"? Questa azione è irreversibile.`;
    if (!window.confirm(confirmMsg)) return;

    const remaining = weddings.filter(w => w.id !== weddingId);
    onUpdateWeddings(remaining);
    if (selectedWeddingId === weddingId) {
      setSelectedWeddingId(remaining[0].id);
    }
  };

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

  // Matrimonio selezionato
  const currentWedding = weddings.find(w => w.id === selectedWeddingId) || weddings[0];

  // Sincronizza o imposta automaticamente l'ospite selezionato nella chat se non è ancora impostato
  useEffect(() => {
    if (!selectedChatGuestEmail) {
      // Se ci sono messaggi scambiati di recente, seleziona l'ultimo ospite che ha scritto
      if (chatMessages.length > 0) {
        const last = chatMessages[chatMessages.length - 1];
        if (last && last.guestEmail) {
          setSelectedChatGuestEmail(last.guestEmail);
          return;
        }
      }
      if (currentWedding?.guests && currentWedding.guests.length > 0) {
        setSelectedChatGuestEmail(currentWedding.guests[0].email);
      }
    }
  }, [chatMessages, currentWedding, selectedChatGuestEmail]);

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

  // Form Nuovo Hotel & Booking Engine
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [selectedSupplierForHotel, setSelectedSupplierForHotel] = useState<string>('');
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelStars, setNewHotelStars] = useState(5);
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelDistance, setNewHotelDistance] = useState('8 min con navetta gratuita dalla masseria');
  const [newHotelRate, setNewHotelRate] = useState(380);
  const [newHotelRoomsBlocked, setNewHotelRoomsBlocked] = useState(20);
  const [newHotelDeadline, setNewHotelDeadline] = useState('2026-07-15');
  const [newHotelEmail, setNewHotelEmail] = useState('');
  const [newHotelPhone, setNewHotelPhone] = useState('+39 080 ');
  const [newHotelContactPerson, setNewHotelContactPerson] = useState('');
  const [newHotelWebsiteUrl, setNewHotelWebsiteUrl] = useState('');
  const [newHotelBookingEngineType, setNewHotelBookingEngineType] = useState<'DIRECT_ENGINE' | 'BOOKING_COM'>('DIRECT_ENGINE');
  const [newHotelPerk, setNewHotelPerk] = useState('Negoziato per voi dall\'Agenzia: Colazione pugliese gourmet inclusa e benvenuto in camera');
  const [newHotelRoomTypeName, setNewHotelRoomTypeName] = useState('Camera Matrimoniale Deluxe');
  const [hotelEmailModalData, setHotelEmailModalData] = useState<{
    hotelName: string;
    email: string;
    password: string;
    loginUrl: string;
    sentAt: string;
    bookingEngineUrl: string;
    contactPerson: string;
  } | null>(null);
  const [copiedHotelEmail, setCopiedHotelEmail] = useState(false);
  const [hotelSuccessNotice, setHotelSuccessNotice] = useState<string | null>(null);

  // Stato Modifica Prezzi & Quotazioni Hotel da parte dell'Agenzia
  const [editingHotelForPrices, setEditingHotelForPrices] = useState<HotelItem | null>(null);
  const [editHotelNegotiatedRate, setEditHotelNegotiatedRate] = useState<number>(380);
  const [editHotelPricingNotes, setEditHotelPricingNotes] = useState<string>('');
  const [editHotelRoomTypes, setEditHotelRoomTypes] = useState<RoomTypeItem[]>([]);
  const [showAddRoomTypeInEdit, setShowAddRoomTypeInEdit] = useState(false);
  const [newEditRtName, setNewEditRtName] = useState('');
  const [newEditRtPrice, setNewEditRtPrice] = useState<number>(380);
  const [newEditRtRooms, setNewEditRtRooms] = useState<number>(10);
  const [newEditRtOccupancy, setNewEditRtOccupancy] = useState<number>(2);

  // Stato Conferma Ufficiale Quotazione Hotel per Ospite con Email e Richiesta Saldo
  const [confirmingHotelQuoteOrder, setConfirmingHotelQuoteOrder] = useState<{
    orderId?: string;
    guestName: string;
    guestEmail: string;
    hotelName: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    estimatedPrice: number;
    officialPrice?: number;
    guestNotes?: string;
  } | null>(null);
  const [quoteOfficialAmount, setQuoteOfficialAmount] = useState<number>(360);
  const [quotePaymentMethod, setQuotePaymentMethod] = useState<'STRIPE_LINK' | 'BANK_TRANSFER_IBAN'>('STRIPE_LINK');
  const [quotePaymentNotes, setQuotePaymentNotes] = useState<string>('Saldo soggiorno hotel convenzionato nozze. Caparra confirmatoria del 30% entro 5 giorni lavorativi.');
  const [officialQuoteSuccessModal, setOfficialQuoteSuccessModal] = useState<{
    guestName: string;
    guestEmail: string;
    hotelName: string;
    roomType: string;
    amount: number;
    dates: string;
    sentAt: string;
    invoiceCode: string;
  } | null>(null);

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

  // Form Creazione / Configurazione Nuovo Matrimonio (Richiesta utente)
  const [newWedCoupleNames, setNewWedCoupleNames] = useState('');
  const [newWedDate, setNewWedDate] = useState('2026-09-26');
  const [newWedVenue, setNewWedVenue] = useState('Masseria San Domenico, Savelletri di Fasano');
  const [newWedCity, setNewWedCity] = useState('Valle d\'Itria, Puglia');
  const [newWedCode, setNewWedCode] = useState('');
  const [newWedCoupleEmail, setNewWedCoupleEmail] = useState('');
  const [newWedCouplePassword, setNewWedCouplePassword] = useState('sposi2026');
  const [newWedDressCode, setNewWedDressCode] = useState('Puglia Summer Chic & Casual Elegance (Lino, seta e tonalità chiare)');
  const [newWedStory, setNewWedStory] = useState('Ci siamo innamorati della magia della Puglia e non vediamo l\'ora di celebrare il nostro amore insieme a tutti voi!');
  const [newWedWelcomeMessage, setNewWedWelcomeMessage] = useState(
    'Cari amici e parenti, siamo felicissimi di accogliervi in Puglia! Per aiutarvi a vivere al meglio il vostro viaggio, abbiamo messo a vostra disposizione la piattaforma Apulian Wedding Concierge curata dal team di Valeria. Potrete prenotare i nostri hotel convenzionati, i transfer dagli aeroporti e scoprire tutte le esperienze speciali pensate per voi!'
  );
  const [newWedSelectedSuppliers, setNewWedSelectedSuppliers] = useState<string[]>(['sup-borgo', 'sup-masseria-torre', 'sup-masseria-san-domenico']);
  const [newWedIncludeTransfers, setNewWedIncludeTransfers] = useState(true);
  const [newWedIncludeExperiences, setNewWedIncludeExperiences] = useState(true);
  const [newWedIncludeServices, setNewWedIncludeServices] = useState(true);
  const [newWedSuccessNotice, setNewWedSuccessNotice] = useState<string | null>(null);
  const [newWedError, setNewWedError] = useState('');

  // Conteggio messaggi chat non letti
  const unreadMessagesCount = chatMessages.filter(m => !m.readByAdmin).length;

  // =========================================================================
  // 0. CREAZIONE & IMPOSTAZIONE NUOVO MATRIMONIO
  // =========================================================================
  const handleCreateNewWedding = (e: React.FormEvent) => {
    e.preventDefault();
    setNewWedError('');

    if (!newWedCoupleNames.trim()) {
      setNewWedError('Inserisci i nomi degli sposi (es. Mario Rossi & Giulia Bianchi).');
      return;
    }
    if (!newWedVenue.trim()) {
      setNewWedError('Inserisci la location o masseria del matrimonio.');
      return;
    }

    // Genera codice nozze univoco se non specificato
    let finalCode = newWedCode.trim().toUpperCase();
    if (!finalCode) {
      const namesPart = newWedCoupleNames
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2 && w !== 'AND' && w !== 'CON' && w !== 'ET')
        .slice(0, 2)
        .join('-');
      const year = new Date(newWedDate).getFullYear() || 2026;
      finalCode = `${namesPart || 'SPOSI'}-${year}`;
    }

    // Se esiste già, aggiungi un suffisso numerico
    if (weddings.some(w => w.weddingCode.toUpperCase() === finalCode.toUpperCase())) {
      finalCode = `${finalCode}-${Date.now().toString().slice(-3)}`;
    }

    // Associa gli hotel selezionati dal database master
    const selectedHotelsList: HotelItem[] = suppliers
      .filter(s => s.category === 'HOTEL' && newWedSelectedSuppliers.includes(s.id))
      .map(s => ({
        id: `hotel-${s.id}-${Date.now()}`,
        name: s.name,
        stars: s.stars || 5,
        address: s.address || s.city,
        distanceToVenue: 'Convenzione garantita nozze',
        negotiatedRate: s.standardRate || 400,
        currency: 'EUR',
        bookingDeadline: '2026-07-31',
        groupCode: finalCode,
        supplierId: s.id,
        websiteUrl: s.websiteUrl || `https://www.booking.com/searchresults.it.html?ss=${encodeURIComponent(s.name)}`,
        bookingEngineType: s.bookingEngineType || 'DIRECT_ENGINE',
        negotiatedPerk: s.negotiatedPerk || 'Negoziato per voi dall\'Agenzia: Tariffa convenzionata e colazione pugliese inclusa',
        pricingManagedByAgency: true,
        agencyPricingNotes: 'Tariffa di riferimento registrata dalla scheda fornitore. Lo staff dell\'agenzia valuterà i giorni e confermerà la quotazione finale.',
        roomTypes: s.roomTypes || [
          {
            id: `rt-${s.id}-1`,
            name: 'Camera Matrimoniale Deluxe',
            pricePerNight: s.standardRate || 400,
            totalBlocked: 20,
            availableRooms: 20,
            maxOccupancy: 2
          }
        ]
      }));

    // Se nessun hotel è stato spuntato, assegna almeno il primo disponibile
    if (selectedHotelsList.length === 0) {
      const defaultSup = suppliers.find(s => s.category === 'HOTEL') || suppliers[0];
      if (defaultSup) {
        selectedHotelsList.push({
          id: `hotel-def-${Date.now()}`,
          name: defaultSup.name,
          stars: defaultSup.stars || 5,
          address: defaultSup.address || defaultSup.city,
          distanceToVenue: 'Sede convenzionata nozze',
          negotiatedRate: defaultSup.standardRate || 450,
          currency: 'EUR',
          bookingDeadline: '2026-07-31',
          groupCode: finalCode,
          supplierId: defaultSup.id,
          websiteUrl: defaultSup.websiteUrl,
          bookingEngineType: defaultSup.bookingEngineType || 'DIRECT_ENGINE',
          pricingManagedByAgency: true,
          agencyPricingNotes: 'Tariffa di riferimento registrata dalla scheda fornitore. Lo staff dell\'agenzia valuterà i giorni e confermerà la quotazione finale.',
          roomTypes: defaultSup.roomTypes || [
            {
              id: `rt-def-1`,
              name: 'Camera Deluxe Matrimoniale',
              pricePerNight: defaultSup.standardRate || 450,
              totalBlocked: 15,
              availableRooms: 15,
              maxOccupancy: 2
            }
          ]
        });
      }
    }

    // Navette transfer predefinite
    const transfersList: TransferItem[] = newWedIncludeTransfers ? [
      {
        id: `tr-${Date.now()}-1`,
        type: 'AIRPORT_SHUTTLE',
        title: 'Navetta Collettiva Aeroporto Bari (BRI) → Savelletri / Fasano',
        origin: 'Aeroporto di Bari (BRI)',
        destination: newWedVenue.trim(),
        departureTime: 'Orari coordinati con i voli degli invitati',
        vehicleType: 'Mercedes Sprinter VIP 16 posti',
        capacity: 16,
        bookedSeats: 0,
        pricePerSeat: 35,
        isPaidByCouple: false,
        supplierId: 'sup-ncc-puglia',
        negotiatedPerk: 'Autista bilingue con cartello nomi sposi al gate arrivi'
      },
      {
        id: `tr-${Date.now()}-2`,
        type: 'PRIVATE_NCC',
        title: 'Transfer Privato Esclusivo NCC (Bari / Brindisi)',
        origin: 'Bari o Brindisi Aeroporto',
        destination: 'Hotel / Masseria',
        departureTime: 'Su misura H24',
        vehicleType: 'Mercedes Classe V Luxury',
        capacity: 7,
        bookedSeats: 0,
        pricePerSeat: 180,
        isPaidByCouple: false,
        supplierId: 'sup-ncc-puglia'
      }
    ] : [];

    // Esperienze
    const experiencesList: ExperienceItem[] = newWedIncludeExperiences ? [
      {
        id: `exp-${Date.now()}-1`,
        title: 'Festa Tradizionale Pugliese con Pizzica e Panzerotti',
        category: 'WELCOME_PARTY',
        eventDate: newWedDate,
        startTime: '19:30',
        durationHours: 4,
        meetingPoint: 'Aia Storica della Masseria',
        pricePerPerson: 0,
        isHostSponsored: true,
        maxParticipants: 150,
        bookedParticipants: 0,
        dressCode: newWedDressCode.trim(),
        description: 'Festa di benvenuto per tutti gli ospiti con panzerotti caldi, mozzarellaro live e tamburellisti di pizzica salentina.',
        image: heroBanner
      },
      {
        id: `exp-${Date.now()}-2`,
        title: 'Tour in Barca & Aperitivo al Tramonto alle Grotte di Polignano a Mare',
        category: 'BOAT_TOUR',
        eventDate: newWedDate,
        startTime: '17:30',
        durationHours: 3,
        meetingPoint: 'Porto Turistico Cala Ponte, Polignano',
        pricePerPerson: 85,
        isHostSponsored: false,
        maxParticipants: 28,
        bookedParticipants: 0,
        description: 'Escursione in barca privata tra le scogliere e le celebri grotte marine di Polignano con calice di vino locale.',
        image: boatTourImg,
        supplierId: 'sup-boat-polignano'
      }
    ] : [];

    // Servizi extra beauty
    const servicesList: ExtraServiceItem[] = newWedIncludeServices ? [
      {
        id: `srv-${Date.now()}-1`,
        title: 'Make-up Professionale Cerimonia in Camera',
        category: 'MAKEUP',
        price: 90,
        isPaidByCouple: false,
        duration: '45 min',
        description: 'Sessione trucco per le invitate con prodotti a lunga tenuta water-resistant.',
        providerName: 'Apulian Bridal & Guest Glam Team'
      },
      {
        id: `srv-${Date.now()}-2`,
        title: 'Acconciatura & Hair Styling Cerimonia',
        category: 'HAIR_STYLING',
        price: 80,
        isPaidByCouple: false,
        duration: '45 min',
        description: 'Piega, raccolto o semiraccolto a domicilio in hotel prima della cerimonia.',
        providerName: 'Apulian Bridal & Guest Glam Team'
      }
    ] : [];

    const newWeddingData: WeddingData = {
      id: `wed-${Date.now()}`,
      weddingCode: finalCode,
      coupleNames: newWedCoupleNames.trim(),
      weddingDate: newWedDate,
      venue: newWedVenue.trim(),
      city: newWedCity.trim(),
      country: 'Italia',
      bannerImage: heroBanner,
      welcomeMessage: newWedWelcomeMessage.trim(),
      currency: 'EUR',
      conciergeEmail: adminSettings.adminNotificationEmail,
      conciergePhone: adminSettings.agencyPhone,
      conciergeWhatsApp: adminSettings.valeriaPhone,
      couplePassword: newWedCouplePassword.trim() || 'sposi2026',
      dressCode: newWedDressCode.trim(),
      story: newWedStory.trim(),
      hotels: selectedHotelsList,
      transfers: transfersList,
      experiences: experiencesList,
      extraServices: servicesList,
      guests: [],
      schedule: [
        { id: `ev-${Date.now()}-1`, time: '17:00', title: 'Cerimonia di Nozze', location: newWedVenue.trim(), description: 'Scambio delle promesse e rito' },
        { id: `ev-${Date.now()}-2`, time: '18:30', title: 'Aperitivo al Tramonto', location: 'Giardino degli Ulivi', description: 'Crudi di mare, mozzarelle e calici di bollicine' },
        { id: `ev-${Date.now()}-3`, time: '20:30', title: 'Cena Placée sotto le Luminarie', location: 'Corte della Masseria', description: 'Banchetto tradizionale pugliese' },
        { id: `ev-${Date.now()}-4`, time: '23:30', title: 'Taglio Torta & Open Bar', location: 'Bordo Piscina', description: 'DJ set e cocktail fino a tarda notte' }
      ],
      secondaryInfo: [
        {
          id: `sec-${Date.now()}-1`,
          title: 'Come Arrivare & Parcheggi',
          category: 'logistics',
          content: `La masseria è situata a ${newWedCity.trim()}. È disponibile un ampio parcheggio interno custodito gratuito per tutti gli ospiti.`
        },
        {
          id: `sec-${Date.now()}-2`,
          title: 'Dress Code & Consigli di Stile',
          category: 'weather',
          content: newWedDressCode.trim()
        }
      ]
    };

    const updatedWeddingsList = [...weddings, newWeddingData];
    onUpdateWeddings(updatedWeddingsList);
    setSelectedWeddingId(newWeddingData.id);

    setNewWedSuccessNotice(
      `🎉 Matrimonio di "${newWeddingData.coupleNames}" impostato con successo! Codice Nozze attivo: ${finalCode}.`
    );

    // Reset campi modulo
    setNewWedCoupleNames('');
    setNewWedCode('');

    // Passa alla scheda whatsapp dove l'invito per i nuovi sposi è già pronto
    setActiveTab('whatsapp');
  };

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
  // 3. AGGIUNGI HOTEL DAL DATABASE O NUOVO & INVIO EMAIL CREDENZIALI
  // =========================================================================
  const handleSaveHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim()) return;

    const hotelId = `hotel-${Date.now()}`;
    const supId = selectedSupplierForHotel || `sup-hotel-${Date.now()}`;
    const cleanHotelEmail = newHotelEmail.trim() || `booking@${newHotelName.toLowerCase().replace(/[^a-z0-9]/g, '')}.it`;
    const hotelPassword = 'fornitore2026';
    const timestampStr = `${new Date().toLocaleDateString('it-IT')} ore ${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;

    // Fallback booking engine URL se non inserito direttamente
    const finalWebsiteUrl = newHotelWebsiteUrl.trim() || 
      (newHotelBookingEngineType === 'BOOKING_COM'
        ? `https://www.booking.com/searchresults.it.html?ss=${encodeURIComponent(newHotelName.trim() + ' ' + newHotelAddress.trim())}`
        : `https://www.${newHotelName.toLowerCase().replace(/[^a-z0-9]/g, '')}.it/booking-engine`);

    const newHotel: HotelItem = {
      id: hotelId,
      name: newHotelName.trim(),
      stars: Number(newHotelStars),
      address: newHotelAddress.trim() || `${currentWedding.city}, Puglia`,
      distanceToVenue: newHotelDistance.trim() || '10 min dalla cerimonia',
      negotiatedRate: Number(newHotelRate),
      currency: 'EUR',
      bookingDeadline: newHotelDeadline,
      groupCode: `WED-${currentWedding.weddingCode.substring(0, 5)}`,
      supplierId: supId,
      websiteUrl: finalWebsiteUrl,
      bookingEngineType: newHotelBookingEngineType,
      negotiatedPerk: newHotelPerk.trim() || 'Negoziato per voi: Tariffa agevolata e colazione pugliese inclusa.',
      roomTypes: [
        {
          id: `rt-${Date.now()}-1`,
          name: newHotelRoomTypeName.trim() || 'Camera Matrimoniale Deluxe',
          pricePerNight: Number(newHotelRate),
          totalBlocked: Number(newHotelRoomsBlocked),
          availableRooms: Number(newHotelRoomsBlocked),
          maxOccupancy: 2
        }
      ]
    };

    // Creazione / Aggiornamento Anagrafica Fornitore Master
    const newHotelSupplier: MasterSupplier = {
      id: supId,
      name: newHotelName.trim(),
      category: 'HOTEL',
      stars: Number(newHotelStars),
      city: newHotelAddress.trim() || currentWedding.city,
      address: newHotelAddress.trim() || `${currentWedding.city}, Puglia`,
      contactPerson: newHotelContactPerson.trim() || 'Direzione Hotel & Ricevimento',
      email: cleanHotelEmail,
      phone: newHotelPhone.trim() || '+39 080 1234567',
      standardRate: Number(newHotelRate),
      commissionPercent: 12,
      notes: `Struttura ricettiva convenzionata per il matrimonio di ${currentWedding.coupleNames} (${currentWedding.weddingCode}).`,
      accessPassword: hotelPassword,
      welcomeEmailSent: true,
      emailSentAt: timestampStr,
      websiteUrl: finalWebsiteUrl,
      bookingEngineType: newHotelBookingEngineType,
      negotiatedPerk: newHotel.negotiatedPerk,
      roomTypes: newHotel.roomTypes
    };

    // Aggiorna fornitore
    const existingSupIndex = suppliers.findIndex(s => s.id === supId);
    let updatedSuppliers = [...suppliers];
    if (existingSupIndex >= 0) {
      updatedSuppliers[existingSupIndex] = newHotelSupplier;
    } else {
      updatedSuppliers = [...updatedSuppliers, newHotelSupplier];
    }
    onUpdateSuppliers(updatedSuppliers);

    // Aggiorna matrimoni
    const updated = weddings.map(w => {
      if (w.id === currentWedding.id) {
        return { ...w, hotels: [...w.hotels, newHotel] };
      }
      return w;
    });
    onUpdateWeddings(updated);

    // Dati per Modale Notifica Email Inviata all'Hotel con credenziali e link
    setHotelEmailModalData({
      hotelName: newHotel.name,
      email: cleanHotelEmail,
      password: hotelPassword,
      loginUrl: 'https://apulian-wedding-concierge.app/?view=login-fornitore',
      sentAt: timestampStr,
      bookingEngineUrl: finalWebsiteUrl,
      contactPerson: newHotelSupplier.contactPerson
    });

    setHotelSuccessNotice(`Hotel "${newHotel.name}" inserito con successo! L'hotel ha ricevuto la mail con le credenziali di accesso al portale e le istruzioni.`);

    setShowAddHotel(false);
    setNewHotelName('');
    setNewHotelAddress('');
    setNewHotelEmail('');
    setNewHotelWebsiteUrl('');
  };

  // Re-invia email con credenziali all'hotel
  const handleResendHotelEmail = (hotel: HotelItem) => {
    const sup = suppliers.find(s => s.id === hotel.supplierId || s.name === hotel.name) || {
      email: `booking@${hotel.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.it`,
      contactPerson: 'Direzione Hotel',
      accessPassword: 'fornitore2026'
    };
    const timestampStr = `${new Date().toLocaleDateString('it-IT')} ore ${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;

    setHotelEmailModalData({
      hotelName: hotel.name,
      email: sup.email,
      password: sup.accessPassword || 'fornitore2026',
      loginUrl: 'https://apulian-wedding-concierge.app/?view=login-fornitore',
      sentAt: timestampStr,
      bookingEngineUrl: hotel.websiteUrl || '',
      contactPerson: sup.contactPerson || 'Direzione Hotel'
    });
  };

  // =========================================================================
  // 3B. GESTIONE TARIFFE & VALUTAZIONE PREZZI HOTEL DA PARTE DELL'AGENZIA
  // =========================================================================
  const handleOpenEditHotelPrices = (hotel: HotelItem) => {
    setEditingHotelForPrices(hotel);
    setEditHotelNegotiatedRate(hotel.negotiatedRate || 350);
    setEditHotelPricingNotes(hotel.agencyPricingNotes || '');
    setEditHotelRoomTypes([...(hotel.roomTypes || [])]);
    setShowAddRoomTypeInEdit(false);
    setNewEditRtName('');
    setNewEditRtPrice(hotel.negotiatedRate || 350);
  };

  const handleSaveEditedHotelPrices = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotelForPrices) return;

    const updatedHotels = currentWedding.hotels.map(h => {
      if (h.id === editingHotelForPrices.id) {
        return {
          ...h,
          negotiatedRate: Number(editHotelNegotiatedRate),
          agencyPricingNotes: editHotelPricingNotes.trim(),
          pricingManagedByAgency: true,
          roomTypes: editHotelRoomTypes
        };
      }
      return h;
    });

    const updatedWeddings = weddings.map(w => {
      if (w.id === currentWedding.id) {
        return { ...w, hotels: updatedHotels };
      }
      return w;
    });

    onUpdateWeddings(updatedWeddings);
    setHotelSuccessNotice(`Prezzi di riferimento e camere per "${editingHotelForPrices.name}" aggiornati con successo dall'agenzia!`);
    setEditingHotelForPrices(null);
    setTimeout(() => setHotelSuccessNotice(null), 4000);
  };

  const handleAddRoomTypeInEdit = () => {
    if (!newEditRtName.trim()) return;
    const newRt: RoomTypeItem = {
      id: `rt-custom-${Date.now()}`,
      name: newEditRtName.trim(),
      pricePerNight: Number(newEditRtPrice),
      totalBlocked: Number(newEditRtRooms),
      availableRooms: Number(newEditRtRooms),
      maxOccupancy: Number(newEditRtOccupancy)
    };
    setEditHotelRoomTypes(prev => [...prev, newRt]);
    setNewEditRtName('');
    setNewEditRtPrice(editHotelNegotiatedRate);
    setShowAddRoomTypeInEdit(false);
  };

  const handleDeleteRoomTypeInEdit = (id: string) => {
    setEditHotelRoomTypes(prev => prev.filter(rt => rt.id !== id));
  };

  // =========================================================================
  // 3C. INVIO CONFERMA UFFICIALE & RICHIESTA PAGAMENTO QUOTAZIONE HOTEL OSPITE
  // =========================================================================
  const handleOpenConfirmHotelQuote = (req: {
    orderId?: string;
    guestName: string;
    guestEmail: string;
    hotelName: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    estimatedPrice: number;
    guestNotes?: string;
  }) => {
    setConfirmingHotelQuoteOrder({
      ...req,
      officialPrice: req.estimatedPrice
    });
    setQuoteOfficialAmount(req.estimatedPrice);
    setQuotePaymentMethod('STRIPE_LINK');
    setQuotePaymentNotes(`Saldo per soggiorno presso ${req.hotelName} (${req.roomType}) dal ${req.checkIn} al ${req.checkOut} (${req.nights} notti). Tariffa ufficiale concordata con l'agenzia AD Marketing.`);
  };

  const handleSendOfficialHotelConfirmation = () => {
    if (!confirmingHotelQuoteOrder) return;
    const timestamp = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const fullDate = new Date().toISOString().split('T')[0];
    const invoiceCode = `INV-HOTEL-${Date.now().toString().substring(7)}`;

    // 1. Crea la richiesta di pagamento formale nel modulo pagamenti
    const newPayReq: PaymentRequest = {
      id: `pay-hotel-${Date.now()}`,
      weddingCode: currentWedding.weddingCode,
      guestName: confirmingHotelQuoteOrder.guestName,
      guestEmail: confirmingHotelQuoteOrder.guestEmail,
      amount: Number(quoteOfficialAmount),
      currency: 'EUR',
      items: [
        {
          description: `Soggiorno ${confirmingHotelQuoteOrder.hotelName} - ${confirmingHotelQuoteOrder.roomType} (${confirmingHotelQuoteOrder.checkIn} → ${confirmingHotelQuoteOrder.checkOut}, ${confirmingHotelQuoteOrder.nights} notti)`,
          amount: Number(quoteOfficialAmount)
        }
      ],
      status: 'SENT',
      sentAt: fullDate,
      paymentMethod: quotePaymentMethod,
      invoiceCode
    };
    onUpdatePaymentRequests([...paymentRequests, newPayReq]);

    // 2. Aggiorna lo stato dell'ordine in bookingOrders
    if (onUpdateBookingOrders && bookingOrders) {
      const updatedOrders = bookingOrders.map(b => {
        if (
          b.id === confirmingHotelQuoteOrder.orderId ||
          (b.guestEmail.toLowerCase() === confirmingHotelQuoteOrder.guestEmail.toLowerCase() && b.serviceCategory === 'HOTEL')
        ) {
          return {
            ...b,
            status: 'CONFIRMED' as const,
            officialQuotedPrice: Number(quoteOfficialAmount),
            officialConfirmationSentAt: `${fullDate} ore ${timestamp}`
          };
        }
        return b;
      });
      onUpdateBookingOrders(updatedOrders);
    }

    // 3. Aggiorna l'ospite nella lista del matrimonio
    const updatedGuests = currentWedding.guests.map(g => {
      if (g.email.toLowerCase() === confirmingHotelQuoteOrder.guestEmail.toLowerCase()) {
        return {
          ...g,
          hotelOfficialPrice: Number(quoteOfficialAmount),
          hotelBookingStatus: 'OFFICIAL_CONFIRMED' as const,
          hotelPaymentSentAt: `${fullDate} ${timestamp}`
        };
      }
      return g;
    });
    const updatedWeddings = weddings.map(w => w.id === currentWedding.id ? { ...w, guests: updatedGuests } : w);
    onUpdateWeddings(updatedWeddings);

    // 4. Mostra modale con la copia dell'email inviata
    setOfficialQuoteSuccessModal({
      guestName: confirmingHotelQuoteOrder.guestName,
      guestEmail: confirmingHotelQuoteOrder.guestEmail,
      hotelName: confirmingHotelQuoteOrder.hotelName,
      roomType: confirmingHotelQuoteOrder.roomType,
      amount: Number(quoteOfficialAmount),
      dates: `${confirmingHotelQuoteOrder.checkIn} → ${confirmingHotelQuoteOrder.checkOut} (${confirmingHotelQuoteOrder.nights} notti)`,
      sentAt: `${fullDate} ore ${timestamp}`,
      invoiceCode
    });

    setConfirmingHotelQuoteOrder(null);
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

      {/* Selettore Matrimonio Attivo & Gestione Eventi */}
      <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span>Matrimonio Attivo:</span>
          </span>
          <select
            value={selectedWeddingId}
            onChange={(e) => setSelectedWeddingId(e.target.value)}
            className="text-xs font-semibold bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
          >
            {weddings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.coupleNames} — {w.weddingCode} ({w.city})
              </option>
            ))}
          </select>

          {/* Pulsante Eliminazione Matrimonio (se ci sono test multipli) */}
          {weddings.length > 1 && (
            <button
              type="button"
              onClick={() => handleDeleteWedding(selectedWeddingId)}
              title="Elimina questo matrimonio di test"
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Elimina</span>
            </button>
          )}

          {/* Pulsante Reset Rapido a 1 Solo Matrimonio Demo */}
          {onResetToDemoWedding && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Vuoi resettare i dati e lasciare unicamente il matrimonio demo di Sophia Rossi & Liam O\'Connor (Puglia)? Tutti i matrimoni di test aggiuntivi creati verranno rimossi.')) {
                  onResetToDemoWedding();
                }
              }}
              title="Ripristina e lascia solo il matrimonio demo"
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Ripristina 1 Matrimonio Demo</span>
            </button>
          )}
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
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs ${
              activeTab === 'new-wedding'
                ? 'bg-rose-900 text-white ring-2 ring-rose-900/30'
                : 'text-neutral-900 bg-amber-400 hover:bg-amber-300 border border-amber-500'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Imposta Nuovo Matrimonio</span>
          </button>
        </div>
      </div>

      {/* Navigazione Moduli Back End: Menu a Pulsanti Adattivo e Responsive (Nessuno scorrimento orizzontale, 100% fruibile da smartphone e desktop) */}
      <div className="pt-1 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {/* 1. Invito WhatsApp */}
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'whatsapp' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'whatsapp' ? 'bg-white/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block text-xs font-semibold truncate">Invito WhatsApp</span>
              <span className={`text-[10px] block truncate ${activeTab === 'whatsapp' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Testo & link sposi
              </span>
            </div>
          </button>

          {/* 2. Riepilogo Ospiti */}
          <button
            onClick={() => setActiveTab('guests-summary')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'guests-summary' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'guests-summary' ? 'bg-white/15 text-sky-300' : 'bg-sky-50 text-sky-700'}`}>
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Scelte Ospiti</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'guests-summary' ? 'bg-sky-400 text-neutral-900' : 'bg-neutral-100 text-neutral-700'}`}>
                  {currentWedding.guests.length}
                </span>
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'guests-summary' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Hotel, voli & transfer
              </span>
            </div>
          </button>

          {/* 3. Contabilità & Ricavi */}
          <button
            onClick={() => setActiveTab('accounting')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'accounting' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'accounting' ? 'bg-white/15 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block text-xs font-semibold truncate">Contabilità</span>
              <span className={`text-[10px] block truncate ${activeTab === 'accounting' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Margini & provvigioni
              </span>
            </div>
          </button>

          {/* 4. Richieste Pagamento */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'payments' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'payments' ? 'bg-white/15 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
              <Receipt className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block text-xs font-semibold truncate">Richieste Saldo</span>
              <span className={`text-[10px] block truncate ${activeTab === 'payments' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Link & bonifici
              </span>
            </div>
          </button>

          {/* 5. Database Fornitori Master */}
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'suppliers' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'suppliers' ? 'bg-white/15 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Fornitori Master</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'suppliers' ? 'bg-purple-400 text-neutral-900' : 'bg-neutral-100 text-neutral-700'}`}>
                  {suppliers.length}
                </span>
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'suppliers' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Anagrafica & email
              </span>
            </div>
          </button>

          {/* 6. Pacchetti Fornitori */}
          <button
            onClick={() => setActiveTab('supplier-packages')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'supplier-packages' 
                ? 'bg-purple-900 text-white font-semibold shadow-xs border-purple-950 ring-2 ring-purple-900/20' 
                : 'text-purple-800 hover:text-purple-950 hover:bg-purple-50 bg-white border-purple-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'supplier-packages' ? 'bg-white/15 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Pacchetti Partner</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'supplier-packages' ? 'bg-white text-purple-900' : 'bg-purple-200 text-purple-800'}`}>
                  {packages.length}
                </span>
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'supplier-packages' ? 'text-purple-200' : 'text-purple-600'}`}>
                Tariffe negoziate
              </span>
            </div>
          </button>

          {/* 7. Hotel Matrimonio */}
          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'hotels' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'hotels' ? 'bg-white/15 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Hotel Nozze</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'hotels' ? 'bg-amber-400 text-neutral-900' : 'bg-neutral-100 text-neutral-700'}`}>
                  {currentWedding.hotels.length}
                </span>
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'hotels' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Convenzioni & link
              </span>
            </div>
          </button>

          {/* 8. Transfer & NCC */}
          <button
            onClick={() => setActiveTab('transfers')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'transfers' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'transfers' ? 'bg-white/15 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
              <Car className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Transfer & NCC</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'transfers' ? 'bg-blue-400 text-neutral-900' : 'bg-neutral-100 text-neutral-700'}`}>
                  {currentWedding.transfers.length}
                </span>
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'transfers' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Navette aeroporto
              </span>
            </div>
          </button>

          {/* 9. Esperienze */}
          <button
            onClick={() => setActiveTab('experiences')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'experiences' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'experiences' ? 'bg-white/15 text-pink-300' : 'bg-pink-50 text-pink-700'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Esperienze</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'experiences' ? 'bg-pink-400 text-neutral-900' : 'bg-neutral-100 text-neutral-700'}`}>
                  {currentWedding.experiences.length}
                </span>
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'experiences' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Tour & feste
              </span>
            </div>
          </button>

          {/* 10. Desideri Ospiti */}
          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'wishes' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'wishes' ? 'bg-white/15 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Desideri Ospiti</span>
                {wishRequests.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'wishes' ? 'bg-amber-400 text-neutral-900' : 'bg-amber-100 text-amber-800'}`}>
                    {wishRequests.length}
                  </span>
                )}
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'wishes' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Richieste su misura
              </span>
            </div>
          </button>

          {/* 11. Chat Valeria */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'chat' 
                ? 'bg-emerald-800 text-white font-semibold shadow-xs border-emerald-950 ring-2 ring-emerald-800/20' 
                : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-50 bg-white border-emerald-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'chat' ? 'bg-white/15 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1">
                <span className="block text-xs font-semibold truncate">Chat Valeria</span>
                {unreadMessagesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-600 text-white animate-pulse">
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] block truncate ${activeTab === 'chat' ? 'text-emerald-200' : 'text-emerald-700'}`}>
                Messaggi diretti ospiti
              </span>
            </div>
          </button>

          {/* 12. Email & Info AD Marketing */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all active:scale-95 cursor-pointer border ${
              activeTab === 'settings' 
                ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-white border-neutral-200 shadow-2xs'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'settings' ? 'bg-white/15 text-neutral-300' : 'bg-neutral-100 text-neutral-700'}`}>
              <Settings className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block text-xs font-semibold truncate">Impostazioni</span>
              <span className={`text-[10px] block truncate ${activeTab === 'settings' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Email agenzia & info
              </span>
            </div>
          </button>
        </div>
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
      {/* 5C. GESTIONE HOTEL, STRUTTURE RICETTIVE & BOOKING ENGINE                  */}
      {/* ========================================================================= */}
      {activeTab === 'hotels' && (
        <div className="border border-neutral-200 rounded-2xl bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Hospitality & Ricettività
              </span>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-0.5">
                Hotel e Dimore Convenzionate · {currentWedding.coupleNames} ({currentWedding.hotels.length})
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Le strutture ricettive possono registrarsi autonomamente oppure essere inserite dallo staff dell'agenzia. Quando inserisci una struttura, <strong>il sistema invia automaticamente una mail all'hotel con le credenziali di accesso, il link al portale fornitore e le istruzioni</strong> per aggiornare i dettagli e verificare il collegamento al booking engine.
              </p>
            </div>

            <button
              onClick={() => setShowAddHotel(!showAddHotel)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddHotel ? 'Chiudi Modulo' : '+ Inserisci Nuova Struttura Hotel'}</span>
            </button>
          </div>

          {/* Notifica successo */}
          {hotelSuccessNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{hotelSuccessNotice}</span>
              </div>
              <button 
                onClick={() => setHotelSuccessNotice(null)}
                className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Modulo Inserimento Struttura Hotel da Back End */}
          {showAddHotel && (
            <form onSubmit={handleSaveHotel} className="p-6 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-5 text-xs">
              <div className="border-b border-amber-200/80 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    Inserisci Nuova Struttura Hotel & Accreditamento Automatico
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    L'hotel riceverà immediatamente una mail con le credenziali (email e password) e il link per accedere alla propria area riservata.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-semibold">
                  Invio email automatico
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Nome Struttura / Hotel</label>
                  <input
                    type="text"
                    required
                    value={newHotelName}
                    onChange={(e) => setNewHotelName(e.target.value)}
                    placeholder="Es. Masseria San Domenico (5★)"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Categoria Stelle</label>
                  <select
                    value={newHotelStars}
                    onChange={(e) => setNewHotelStars(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  >
                    <option value={3}>3 Stelle</option>
                    <option value={4}>4 Stelle Superior</option>
                    <option value={5}>5 Stelle Lusso</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Email Referente Struttura (Per Invio Credenziali)</label>
                  <input
                    type="email"
                    required
                    value={newHotelEmail}
                    onChange={(e) => setNewHotelEmail(e.target.value)}
                    placeholder="booking@masseriasandomenico.it"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Indirizzo & Comune</label>
                  <input
                    type="text"
                    required
                    value={newHotelAddress}
                    onChange={(e) => setNewHotelAddress(e.target.value)}
                    placeholder="Es. Savelletri di Fasano (BR)"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Distanza dal Luogo Cerimonia / Ricevimento</label>
                  <input
                    type="text"
                    value={newHotelDistance}
                    onChange={(e) => setNewHotelDistance(e.target.value)}
                    placeholder="Es. 8 min con navetta gratuita"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Telefono Struttura & Referente</label>
                  <input
                    type="text"
                    value={newHotelPhone}
                    onChange={(e) => setNewHotelPhone(e.target.value)}
                    placeholder="+39 080 4827777 (Silvia Melpignano)"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-800 mb-1">
                    URL Pagina Web Booking Engine Struttura (oppure link Booking.com)
                  </label>
                  <input
                    type="url"
                    value={newHotelWebsiteUrl}
                    onChange={(e) => setNewHotelWebsiteUrl(e.target.value)}
                    placeholder="https://www.masseriasandomenico.it/prenotazioni oppure https://www.booking.com/..."
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono text-neutral-900"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Questo indirizzo web verrà interrogato automaticamente quando l'ospite richiede date e persone nel portale per calcolare il prezzo camera in tempo reale.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Tipologia Servizio Prenotazioni</label>
                  <select
                    value={newHotelBookingEngineType}
                    onChange={(e) => setNewHotelBookingEngineType(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  >
                    <option value="DIRECT_ENGINE">Booking Engine Diretto della Struttura</option>
                    <option value="BOOKING_COM">Pagina Booking.com della Struttura</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Tariffa Convenzionata Base (€ / notte)</label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={newHotelRate}
                    onChange={(e) => setNewHotelRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Nome Tipologia Camera Inclusa</label>
                  <input
                    type="text"
                    value={newHotelRoomTypeName}
                    onChange={(e) => setNewHotelRoomTypeName(e.target.value)}
                    placeholder="Es. Camera Matrimoniale Deluxe con Balcone"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Numero Camere Bloccate per gli Invitati</label>
                  <input
                    type="number"
                    min="1"
                    value={newHotelRoomsBlocked}
                    onChange={(e) => setNewHotelRoomsBlocked(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Dettaglio Speciale "Negoziato per Voi dall'Agenzia" (Mostrato all'ospite)
                  </label>
                  <input
                    type="text"
                    value={newHotelPerk}
                    onChange={(e) => setNewHotelPerk(e.target.value)}
                    placeholder="Es. Negoziato per voi dall'Agenzia: Accesso gratuito alla spa e late check-out garantito"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-amber-200">
                <div className="text-[11px] text-amber-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-800" />
                  <span>
                    Al salvataggio verrà generata e inviata l'email con credenziali temporanee (pwd: <code className="font-mono font-bold">fornitore2026</code>) e link al portale.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddHotel(false)}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-xl cursor-pointer"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Salva Struttura & Invia Email Credenziali</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Banner Ruolo Agenzia nella determinazione dei Prezzi */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">
                  Gestione Prezzi & Quotazioni Riservata allo Staff Agenzia
                </h4>
                <p className="text-amber-900/90 leading-relaxed mt-0.5">
                  La struttura ricettiva ha la possibilità di compilare la scheda con tutti i dettagli e le camere disponibili. 
                  <strong> Il prezzo di riferimento per ciascuna camera viene inserito dall'agenzia</strong>, che in base alla durata del soggiorno e alle date valuterà la prenotazione e invierà all'ospite la conferma ufficiale per il pagamento.
                </p>
              </div>
            </div>
          </div>

          {/* SEZIONE 1: RICHIESTE HOTEL DAGLI OSPITI (PRIMA IPOTESI & CONFERMA UFFICIALE) */}
          <div className="p-5 rounded-2xl bg-neutral-900 text-white space-y-4 shadow-md border border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <h3 className="font-serif-luxury font-bold text-base text-white">
                    Richieste Hotel Ricevute dagli Ospiti ({currentWedding.coupleNames})
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  L'ospite ha inviato una prima ipotesi di prezzo indicativa con "Conferma e Invia". Valuta le date e clicca per inviare la <strong>conferma ufficiale via email con la richiesta di pagamento</strong>.
                </p>
              </div>
            </div>

            {(() => {
              // Estrai richieste sia da bookingOrders sia dalla lista ospiti
              const hotelBookingOrders = (bookingOrders || []).filter(
                b => b.serviceCategory === 'HOTEL' && (b.weddingCode === currentWedding.weddingCode || !b.weddingCode)
              );
              const hotelGuests = currentWedding.guests.filter(
                g => g.hotelBooked && g.hotelBooked !== 'NONE' && g.hotelBooked !== ''
              );

              // Unifica per email per non duplicare
              const requestsMap = new Map<string, {
                orderId?: string;
                guestName: string;
                guestEmail: string;
                hotelName: string;
                roomType: string;
                checkIn: string;
                checkOut: string;
                nights: number;
                estimatedPrice: number;
                officialPrice?: number;
                status: 'RECEIVED' | 'CONFIRMED';
                guestNotes?: string;
                sentAt?: string;
              }>();

              hotelBookingOrders.forEach(bo => {
                const datesParts = (bo.dateRequested || '').split(' al ');
                const checkIn = bo.checkIn || datesParts[0] || '2026-09-10';
                const checkOut = bo.checkOut || datesParts[1] || '2026-09-13';
                const nights = bo.nights || 3;
                requestsMap.set(bo.guestEmail.toLowerCase(), {
                  orderId: bo.id,
                  guestName: bo.guestName,
                  guestEmail: bo.guestEmail,
                  hotelName: bo.serviceTitle.split(' - ')[0] || bo.serviceTitle,
                  roomType: bo.roomType || bo.serviceTitle.split(' - ')[1] || 'Camera Matrimoniale',
                  checkIn,
                  checkOut,
                  nights,
                  estimatedPrice: bo.totalAmount,
                  officialPrice: bo.officialQuotedPrice,
                  status: bo.status === 'CONFIRMED' ? 'CONFIRMED' : 'RECEIVED',
                  guestNotes: bo.guestNotes,
                  sentAt: bo.officialConfirmationSentAt
                });
              });

              hotelGuests.forEach(g => {
                const key = g.email.toLowerCase();
                if (!requestsMap.has(key)) {
                  requestsMap.set(key, {
                    guestName: g.name,
                    guestEmail: g.email,
                    hotelName: g.hotelBooked.split(' - ')[0] || g.hotelBooked,
                    roomType: g.roomType || g.hotelBooked.split(' - ')[1] || 'Camera Deluxe',
                    checkIn: g.checkInDate || '2026-09-10',
                    checkOut: g.checkOutDate || '2026-09-13',
                    nights: g.hotelNights || 3,
                    estimatedPrice: g.hotelEstimatePrice || g.totalAmountDue || 360,
                    officialPrice: g.hotelOfficialPrice,
                    status: g.hotelBookingStatus === 'OFFICIAL_CONFIRMED' ? 'CONFIRMED' : 'RECEIVED',
                    guestNotes: g.hotelSpecialRequests,
                    sentAt: g.hotelPaymentSentAt
                  });
                }
              });

              const allRequests = Array.from(requestsMap.values());

              if (allRequests.length === 0) {
                return (
                  <div className="p-8 text-center bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-2">
                    <Building2 className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p className="text-xs text-neutral-400">
                      Nessuna richiesta hotel inviata ancora dagli ospiti per questo matrimonio.
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Quando un ospite seleziona date e camera ed invia con "Conferma e Invia", la sua prima ipotesi di prezzo apparirà qui pronta per la tua conferma ufficiale.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {allRequests.map((req, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-neutral-700 transition-colors"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{req.guestName}</span>
                          <span className="text-neutral-400 font-mono text-[11px]">&lt;{req.guestEmail}&gt;</span>
                          {req.status === 'CONFIRMED' ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-700 font-semibold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Conferma Ufficiale Inviata</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-400 border border-amber-700 font-semibold text-[10px] flex items-center gap-1 animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span>In Attesa di Valutazione Agenzia</span>
                            </span>
                          )}
                        </div>

                        <div className="text-neutral-300 flex items-center gap-2 flex-wrap text-[11px]">
                          <span className="font-semibold text-amber-300 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{req.hotelName}</span>
                          </span>
                          <span>•</span>
                          <span className="text-neutral-200">Camera: <strong>{req.roomType}</strong></span>
                          <span>•</span>
                          <span className="text-neutral-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-500" />
                            <span>{req.checkIn} → {req.checkOut} ({req.nights} notti)</span>
                          </span>
                        </div>

                        {req.guestNotes && (
                          <div className="text-[11px] text-neutral-400 italic">
                            Note ospite: "{req.guestNotes}"
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                            Prima Ipotesi Ospite:
                          </span>
                          <span className="font-mono font-bold text-sm text-amber-400">
                            €{req.estimatedPrice}
                          </span>
                          {req.officialPrice && (
                            <span className="text-[10px] text-emerald-400 block font-mono">
                              Quotazione Ufficiale: €{req.officialPrice}
                            </span>
                          )}
                        </div>

                        {req.status !== 'CONFIRMED' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenConfirmHotelQuote(req)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Invia Conferma Ufficiale & Pagamento</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenConfirmHotelQuote(req)}
                            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Rivedi / Re-invia Email</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* SEZIONE 2: GRIGLIA HOTEL CONVENZIONATI & GESTIONE PREZZI AGENZIA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif-luxury font-bold text-neutral-900">
                  Strutture Hotel Convenzionate ({currentWedding.hotels.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Clicca su <strong>"Gestisci Prezzi & Quotazioni"</strong> per modificare le tariffe base e delle camere per questo matrimonio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentWedding.hotels.map((h) => {
                const guestsBookedCount = currentWedding.guests.filter(g => 
                  g.hotelBooked && g.hotelBooked.toLowerCase().includes(h.name.toLowerCase().substring(0, 10))
                ).length;

                return (
                  <div 
                    key={h.id}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 space-y-4 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                              {h.stars} Stelle
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                              €{h.negotiatedRate} / notte (Base Agenzia)
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-purple-100 text-purple-900 border border-purple-200">
                              ✓ Prezzi Gestiti da AD Marketing
                            </span>
                          </div>
                          <h3 className="text-base font-serif-luxury font-bold text-neutral-900 mt-1">
                            {h.name}
                          </h3>
                          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span>{h.address} · <span className="italic">{h.distanceToVenue}</span></span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                            {guestsBookedCount} opzioni ospiti
                          </span>
                        </div>
                      </div>

                      {/* Dettaglio Negoziato dall'Agenzia */}
                      {h.negotiatedPerk && (
                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-relaxed">{h.negotiatedPerk}</span>
                        </div>
                      )}

                      {/* Note Valutazione Agenzia */}
                      {h.agencyPricingNotes && (
                        <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950 space-y-1">
                          <span className="font-bold flex items-center gap-1.5 text-[11px] text-purple-900">
                            <Tag className="w-3.5 h-3.5 text-purple-700" />
                            <span>Criteri di Valutazione Giorni & Tariffe Agenzia:</span>
                          </span>
                          <p className="text-[11px] text-purple-900/90 leading-relaxed">
                            {h.agencyPricingNotes}
                          </p>
                        </div>
                      )}

                      {/* Booking Engine Collegato */}
                      <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-800 flex items-center gap-1.5 text-[11px]">
                            <Building2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Booking Engine Collegato:</span>
                          </span>
                          <span className="text-[10px] font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-semibold">
                            {h.bookingEngineType === 'BOOKING_COM' ? 'Booking.com' : 'Engine Ufficiale'}
                          </span>
                        </div>

                        {h.websiteUrl ? (
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100">
                            <a
                              href={h.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-emerald-700 hover:text-emerald-900 underline truncate max-w-[280px] flex items-center gap-1"
                            >
                              <span className="truncate">{h.websiteUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                            <span className="text-[10px] text-emerald-600 font-semibold shrink-0">✓ Connesso</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-neutral-500 italic">
                            Nessun booking engine proprietario: il sistema collegherà la ricerca a Booking.com.
                          </div>
                        )}
                      </div>

                      {/* Tipologie Camere Bloccate e Prezzi Agenzia */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                            Tipologie Camere & Tariffe Agenzia:
                          </span>
                          <span className="text-[10px] text-purple-800 font-mono font-semibold">
                            {h.roomTypes.length} tipolog{h.roomTypes.length === 1 ? 'ia' : 'ie'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {h.roomTypes.map((rt) => (
                            <div key={rt.id} className="p-2 bg-white rounded-lg border border-neutral-200 text-xs flex items-center justify-between">
                              <span className="font-medium text-neutral-800">{rt.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-neutral-500 font-mono">Disponibili: {rt.availableRooms}/{rt.totalBlocked}</span>
                                <span className="font-mono font-bold text-neutral-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-900">
                                  €{rt.pricePerNight} / notte
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Azioni Struttura & Modifica Prezzi Agenzia */}
                    <div className="pt-3 border-t border-neutral-200/80 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditHotelPrices(h)}
                        className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-purple-950 hover:bg-purple-900 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-300" />
                        <span>Gestisci Prezzi & Quotazioni Camere (Staff Agenzia)</span>
                      </button>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleResendHotelEmail(h)}
                          className="px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:text-neutral-950 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-700" />
                          <span>Vedi / Reinvia Email Credenziali</span>
                        </button>

                        <a
                          href={h.websiteUrl || `https://www.booking.com/searchresults.it.html?ss=${encodeURIComponent(h.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Test Booking Engine</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 1: MODIFICA PREZZI & QUOTAZIONI HOTEL DA PARTE DELL'AGENZIA         */}
      {/* ========================================================================= */}
      {editingHotelForPrices && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-300 space-y-5 animate-fade-in text-xs my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-neutral-900">
                    Modifica Prezzi & Quotazioni · {editingHotelForPrices.name}
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Matrimonio: {currentWedding.coupleNames} ({currentWedding.weddingCode})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingHotelForPrices(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedHotelPrices} className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] text-purple-950">
                La struttura compila la scheda e le disponibilità. Qui lo staff agenzia inserisce i <strong>prezzi di riferimento per gli ospiti</strong> e le note di valutazione per i giorni di soggiorno.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Tariffa Base Hotel di Riferimento (€ / notte)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editHotelNegotiatedRate}
                    onChange={(e) => setEditHotelNegotiatedRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono font-bold text-neutral-900"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Usata per calcolare la prima ipotesi di prezzo indicativa per gli ospiti.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Criteri di Valutazione Giorni & Note Agenzia
                  </label>
                  <input
                    type="text"
                    value={editHotelPricingNotes}
                    onChange={(e) => setEditHotelPricingNotes(e.target.value)}
                    placeholder="Es. Minimo 2 notti per il weekend. Sconto 10% per oltre 3 notti."
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Mostrato all'agenzia e come nota trasparente nel riepilogo ospite.
                  </span>
                </div>
              </div>

              {/* Tipologie Camere & Tariffe Specifiche */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-900 text-xs">
                    Tariffe per Singola Tipologia di Camera (€ / notte):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddRoomTypeInEdit(!showAddRoomTypeInEdit)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 cursor-pointer"
                  >
                    + Aggiungi Tipologia Camera
                  </button>
                </div>

                {showAddRoomTypeInEdit && (
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">Nome Camera</label>
                        <input
                          type="text"
                          value={newEditRtName}
                          onChange={(e) => setNewEditRtName(e.target.value)}
                          placeholder="Es. Junior Suite Vista Piscina"
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">Prezzo Notte (€)</label>
                        <input
                          type="number"
                          value={newEditRtPrice}
                          onChange={(e) => setNewEditRtPrice(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral-600 mb-0.5">Camere Bloccate</label>
                        <input
                          type="number"
                          value={newEditRtRooms}
                          onChange={(e) => setNewEditRtRooms(Number(e.target.value))}
                          className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddRoomTypeInEdit(false)}
                        className="px-3 py-1 text-[11px] text-neutral-600"
                      >
                        Annulla
                      </button>
                      <button
                        type="button"
                        onClick={handleAddRoomTypeInEdit}
                        className="px-3 py-1 text-[11px] font-semibold text-white bg-purple-900 rounded-lg cursor-pointer"
                      >
                        Aggiungi Camera
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {editHotelRoomTypes.map((rt, idx) => (
                    <div key={rt.id || idx} className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="min-w-0">
                        <span className="font-semibold text-neutral-900 block">{rt.name}</span>
                        <span className="text-[11px] text-neutral-500">
                          Camere totali: {rt.totalBlocked} • Max persone: {rt.maxOccupancy}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-neutral-500 text-[11px]">Tariffa Agenzia:</span>
                          <input
                            type="number"
                            min="1"
                            value={rt.pricePerNight}
                            onChange={(e) => {
                              const newRate = Number(e.target.value);
                              setEditHotelRoomTypes(prev => prev.map((item, i) => i === idx ? { ...item, pricePerNight: newRate } : item));
                            }}
                            className="w-24 p-1.5 bg-amber-50 border border-amber-300 rounded-lg font-mono font-bold text-amber-950 text-xs text-right"
                          />
                          <span className="text-neutral-600 text-xs font-bold">€ / notte</span>
                        </div>

                        {editHotelRoomTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRoomTypeInEdit(rt.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Rimuovi tipologia"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingHotelForPrices(null)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-xl cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-950 hover:bg-purple-900 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Salva Prezzi & Criteri Agenzia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 2: CONFERMA UFFICIALE QUOTAZIONE HOTEL & INVIO EMAIL SALDO ALL'OSPITE */}
      {/* ========================================================================= */}
      {confirmingHotelQuoteOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-300 space-y-5 animate-fade-in text-xs my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-neutral-900">
                    Invia Conferma Ufficiale Hotel & Richiesta Pagamento
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Destinatario: <strong className="text-neutral-800">{confirmingHotelQuoteOrder.guestName}</strong> ({confirmingHotelQuoteOrder.guestEmail})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmingHotelQuoteOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-neutral-400 text-[10px] uppercase block">Struttura:</span>
                <strong className="text-neutral-900">{confirmingHotelQuoteOrder.hotelName}</strong>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] uppercase block">Camera Scelta:</span>
                <strong className="text-neutral-900">{confirmingHotelQuoteOrder.roomType}</strong>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] uppercase block">Date & Notti:</span>
                <strong className="text-neutral-900">{confirmingHotelQuoteOrder.checkIn} → {confirmingHotelQuoteOrder.checkOut} ({confirmingHotelQuoteOrder.nights}n)</strong>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] uppercase block">Prima Ipotesi Ospite:</span>
                <strong className="text-amber-800 font-mono">€{confirmingHotelQuoteOrder.estimatedPrice}</strong>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Quotazione Esatta Ufficiale Agenzia (€ Saldo Richiesto)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quoteOfficialAmount}
                    onChange={(e) => setQuoteOfficialAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-amber-50 border border-amber-300 rounded-xl font-mono font-bold text-amber-950 text-sm"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    Puoi confermare la prima ipotesi di €{confirmingHotelQuoteOrder.estimatedPrice} o rettificarla in base alla valutazione esatta dei giorni.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Metodo di Pagamento Proposto
                  </label>
                  <select
                    value={quotePaymentMethod}
                    onChange={(e) => setQuotePaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                  >
                    <option value="STRIPE_LINK">Carta di Credito Online (Stripe Diretto)</option>
                    <option value="BANK_TRANSFER_IBAN">Bonifico Bancario su Conto AD Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Note & Istruzioni Saldo per l'Ospite
                </label>
                <textarea
                  rows={2}
                  value={quotePaymentNotes}
                  onChange={(e) => setQuotePaymentNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-800 text-xs"
                />
              </div>

              {/* Anteprima Email */}
              <div className="p-3.5 bg-neutral-950 text-neutral-200 rounded-xl font-mono text-[11px] space-y-1.5 shadow-inner">
                <div className="text-neutral-400 border-b border-neutral-800 pb-1">
                  <strong>Oggetto:</strong> Conferma Ufficiale Prenotazione Hotel & Istruzioni Pagamento - Matrimonio {currentWedding.coupleNames}
                </div>
                <div className="text-neutral-300 pt-1 leading-relaxed">
                  Gentile {confirmingHotelQuoteOrder.guestName},<br />
                  l'agenzia AD Marketing ha valutato la tua richiesta di soggiorno per il matrimonio di {currentWedding.coupleNames}:<br />
                  • <strong>Hotel:</strong> {confirmingHotelQuoteOrder.hotelName} ({confirmingHotelQuoteOrder.roomType})<br />
                  • <strong>Date:</strong> dal {confirmingHotelQuoteOrder.checkIn} al {confirmingHotelQuoteOrder.checkOut} ({confirmingHotelQuoteOrder.nights} notti)<br />
                  • <strong>Quotazione Ufficiale Confermata:</strong> €{quoteOfficialAmount} (IVA inclusa)<br />
                  • <strong>Istruzioni Pagamento:</strong> {quotePaymentNotes}<br />
                  {quotePaymentMethod === 'STRIPE_LINK' 
                    ? `• Link Pagamento Immediato: ${adminSettings.stripePaymentLink}`
                    : `• IBAN Bonifico: ${adminSettings.defaultIban} (Intestato a ${adminSettings.agencyLegalName})`
                  }
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setConfirmingHotelQuoteOrder(null)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-xl cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSendOfficialHotelConfirmation}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Spedisci Conferma Ufficiale & Richiesta Pagamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE 3: SUCCESSO INVIO CONFERMA UFFICIALE & RICEVUTA EMAIL ALL'OSPITE   */}
      {/* ========================================================================= */}
      {officialQuoteSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-300 space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-neutral-900">
                    Email di Conferma Ufficiale Spedita!
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Trasmessa a: <strong className="text-neutral-800">{officialQuoteSuccessModal.guestEmail}</strong> • {officialQuoteSuccessModal.sentAt}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setOfficialQuoteSuccessModal(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-2">
              <p className="font-semibold text-xs">
                La conferma ufficiale con la quotazione esatta e le istruzioni per il pagamento è stata inviata con successo all'ospite.
              </p>
              <div className="text-[11px] space-y-1 text-emerald-800">
                <div>• <strong>Ospite:</strong> {officialQuoteSuccessModal.guestName}</div>
                <div>• <strong>Struttura:</strong> {officialQuoteSuccessModal.hotelName} ({officialQuoteSuccessModal.roomType})</div>
                <div>• <strong>Date:</strong> {officialQuoteSuccessModal.dates}</div>
                <div>• <strong>Importo Quotato Ufficiale:</strong> €{officialQuoteSuccessModal.amount}</div>
                <div>• <strong>Codice Ricevuta:</strong> <span className="font-mono">{officialQuoteSuccessModal.invoiceCode}</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setOfficialQuoteSuccessModal(null)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-xs cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE NOTIFICA: EMAIL CON CREDENZIALI INVIATA ALL'HOTEL                  */}
      {/* ========================================================================= */}
      {hotelEmailModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-300 space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-neutral-900">
                    Email di Accreditamento Inviata alla Struttura Hotel
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Spedita a: <strong className="text-neutral-800 font-mono">{hotelEmailModalData.email}</strong> • {hotelEmailModalData.sentAt}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setHotelEmailModalData(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-neutral-950 text-neutral-100 rounded-xl font-sans text-xs space-y-3 shadow-inner">
              <div className="text-[11px] text-neutral-400 border-b border-neutral-800 pb-2">
                <div><strong>Mittente:</strong> AD Marketing Concierge &lt;info@admarketing.it&gt;</div>
                <div><strong>Destinatario:</strong> {hotelEmailModalData.hotelName} &lt;{hotelEmailModalData.email}&gt;</div>
                <div><strong>Oggetto:</strong> Attivazione Portale Apulian Wedding Concierge - Credenziali di Accesso Struttura Hotel</div>
              </div>

              <div className="space-y-2 text-neutral-200 leading-relaxed font-sans">
                <p>Gentile Direzione di <strong>{hotelEmailModalData.hotelName}</strong>,</p>
                <p>
                  L'agenzia <strong>AD Marketing</strong> vi ha inserito come struttura convenzionata per il matrimonio di <strong>{currentWedding.coupleNames}</strong>.
                </p>
                <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 space-y-1 font-mono text-emerald-300">
                  <div>🔗 <strong>Link di Accesso Portale:</strong> {hotelEmailModalData.loginUrl}</div>
                  <div>👤 <strong>Email di Accesso:</strong> {hotelEmailModalData.email}</div>
                  <div>🔑 <strong>Password Temporanea:</strong> {hotelEmailModalData.password}</div>
                  {hotelEmailModalData.bookingEngineUrl && (
                    <div className="text-neutral-400 text-[11px] pt-1">🌐 <strong>Booking Engine Registrato:</strong> {hotelEmailModalData.bookingEngineUrl}</div>
                  )}
                </div>
                <p className="text-[11px] text-neutral-300">
                  Accedendo all'area fornitore potrete:
                  <br />• Completare o aggiornare le informazioni sulla vostra struttura
                  <br />• Verificare e aggiornare il link al vostro booking engine per il calcolo automatico dei prezzi agli invitati
                  <br />• Visualizzare e gestire le opzioni e le prenotazioni delle camere bloccate
                </p>
                <p className="text-[11px] text-neutral-400 italic">
                  Cordiali saluti,<br />Staff AD Marketing · Palagianello (TA)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-500">
                L'hotel può accedere in qualsiasi momento con queste credenziali dalla home page.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Credenziali Hotel ${hotelEmailModalData.hotelName}: Link: ${hotelEmailModalData.loginUrl} | Email: ${hotelEmailModalData.email} | Pwd: ${hotelEmailModalData.password}`;
                    navigator.clipboard.writeText(text);
                    setCopiedHotelEmail(true);
                    setTimeout(() => setCopiedHotelEmail(false), 2000);
                  }}
                  className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedHotelEmail ? 'Credenziali Copiate!' : 'Copia Credenziali'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHotelEmailModalData(null)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold cursor-pointer"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

              {/* Combina gli ospiti registrati con eventuali ospiti che hanno inviato messaggi in chat */}
              {(() => {
                // Raccogli tutte le email degli ospiti per questo matrimonio o globali che hanno scritto
                const chatGuestMap = new Map<string, { name: string; email: string; flag?: string }>();
                
                // Aggiungi ospiti del matrimonio corrente
                currentWedding.guests.forEach(g => {
                  chatGuestMap.set(g.email.toLowerCase(), { name: g.name, email: g.email, flag: g.flag });
                });

                // Aggiungi eventuali ospiti che hanno scritto in chat ma non erano in lista predefinita
                chatMessages.forEach(m => {
                  if (m.guestEmail && !chatGuestMap.has(m.guestEmail.toLowerCase())) {
                    chatGuestMap.set(m.guestEmail.toLowerCase(), { 
                      name: m.guestName || m.guestEmail, 
                      email: m.guestEmail,
                      flag: '💬'
                    });
                  }
                });

                const allChatGuests = Array.from(chatGuestMap.values());

                return allChatGuests.map((g) => {
                  const guestMsgs = chatMessages.filter(m => m.guestEmail.toLowerCase() === g.email.toLowerCase());
                  const lastMsg = guestMsgs[guestMsgs.length - 1];
                  const hasUnread = guestMsgs.some(m => !m.readByAdmin && m.sender === 'guest');
                  const isSelected = selectedChatGuestEmail.toLowerCase() === g.email.toLowerCase();

                  return (
                    <button
                      key={g.email}
                      onClick={() => setSelectedChatGuestEmail(g.email)}
                      className={`w-full text-left p-3 rounded-xl transition-colors cursor-pointer border ${
                        isSelected 
                          ? 'bg-white shadow-2xs border-emerald-600 ring-1 ring-emerald-600' 
                          : 'border-transparent hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-neutral-900 flex items-center gap-1.5">
                          {hasUnread && <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />}
                          <span>{g.name}</span>
                        </span>
                        <span className="text-[10px] text-neutral-400">{g.flag || '💍'}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : 'Nessun messaggio recente'}
                      </div>
                    </button>
                  );
                });
              })()}
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

      {/* ========================================================================= */}
      {/* 9. IMPOSTA E CONFIGURA NUOVO MATRIMONIO (CREAZIONE DALL'AGENZIA)          */}
      {/* ========================================================================= */}
      {activeTab === 'new-wedding' && (
        <div className="max-w-4xl mx-auto border border-neutral-200 rounded-3xl bg-white p-6 sm:p-10 shadow-sm space-y-8 animate-fade-in text-xs">
          {/* Header */}
          <div className="border-b border-neutral-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-semibold uppercase tracking-wider mb-2">
                <Heart className="w-3.5 h-3.5 text-rose-700 fill-rose-700" />
                <span>Configurazione Nuovo Evento Nozze</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
                Imposta & Configura Nuovo Matrimonio
              </h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                Inserisci i dati della coppia, location, hotel convenzionati e servizi. Il sistema genererà immediatamente il codice nozze univoco, il link per gli sposi e il testo di benvenuto pronto per gli invitati.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              ← Torna al Matrimonio Attivo
            </button>
          </div>

          {newWedSuccessNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{newWedSuccessNotice}</span>
            </div>
          )}

          {newWedError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{newWedError}</span>
            </div>
          )}

          <form onSubmit={handleCreateNewWedding} className="space-y-8">
            {/* Sezione 1: Dati della Coppia & Data */}
            <div className="p-6 bg-neutral-50/70 rounded-2xl border border-neutral-200/90 space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>1. Dati della Coppia di Sposi & Location</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Nomi degli Sposi *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWedCoupleNames}
                    onChange={(e) => {
                      setNewWedCoupleNames(e.target.value);
                      // Suggerisci codice automaticamente
                      if (!newWedCode) {
                        const clean = e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9\s]/g, '')
                          .split(/\s+/)
                          .filter(w => w.length > 2 && w !== 'AND' && w !== 'CON')
                          .slice(0, 2)
                          .join('-');
                        if (clean) setNewWedCode(`${clean}-2026`);
                      }
                    }}
                    placeholder="Es. Chiara Esposito & Matteo Ferri"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-medium focus:ring-2 focus:ring-rose-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Data delle Nozze *
                  </label>
                  <input
                    type="date"
                    required
                    value={newWedDate}
                    onChange={(e) => setNewWedDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-rose-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Codice Nozze Univoco (Per Inviti & Login)
                  </label>
                  <input
                    type="text"
                    value={newWedCode}
                    onChange={(e) => setNewWedCode(e.target.value.toUpperCase())}
                    placeholder="ES: CHIARA-MATTEO-2026"
                    className="w-full p-2.5 bg-white border border-rose-300 rounded-xl font-mono font-bold uppercase text-rose-950 focus:ring-2 focus:ring-rose-800 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Verrà inserito nel link WhatsApp e condiviso con gli ospiti.
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Location / Masseria / Venue Ricevimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWedVenue}
                    onChange={(e) => setNewWedVenue(e.target.value)}
                    placeholder="Es. Masseria San Domenico, Savelletri di Fasano"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-rose-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Comune & Provincia
                  </label>
                  <input
                    type="text"
                    value={newWedCity}
                    onChange={(e) => setNewWedCity(e.target.value)}
                    placeholder="Es. Valle d'Itria, Fasano (BR)"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-rose-800 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Sezione 2: Accesso Riservato Sposi & Dress Code */}
            <div className="p-6 bg-neutral-50/70 rounded-2xl border border-neutral-200/90 space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-600" />
                <span>2. Credenziali Accesso Area Sposi & Stile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Email di Riferimento degli Sposi
                  </label>
                  <input
                    type="email"
                    value={newWedCoupleEmail}
                    onChange={(e) => setNewWedCoupleEmail(e.target.value)}
                    placeholder="chiara.matteo2026@gmail.com"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono focus:outline-hidden"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Usata per comunicazioni dirette e resoconto prenotazioni.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Password di Accesso per l'Area Sposi
                  </label>
                  <input
                    type="text"
                    value={newWedCouplePassword}
                    onChange={(e) => setNewWedCouplePassword(e.target.value)}
                    placeholder="sposi2026"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl font-mono font-bold focus:outline-hidden"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    La coppia accederà inserendo il proprio codice nozze e questa password.
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Dress Code & Note di Stile per gli Invitati
                  </label>
                  <input
                    type="text"
                    value={newWedDressCode}
                    onChange={(e) => setNewWedDressCode(e.target.value)}
                    placeholder="Es. Puglia Summer Chic (Lino, seta e tonalità calde. Scarpe comode per prato)"
                    className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Sezione 3: Messaggio di Benvenuto per gli Invitati */}
            <div className="p-6 bg-neutral-50/70 rounded-2xl border border-neutral-200/90 space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>3. Messaggio di Benvenuto Mostrato agli Invitati</span>
              </h3>
              <p className="text-[11px] text-neutral-500">
                Questo messaggio comparirà nella parte superiore del Portale Ospiti quando gli invitati effettuano l'accesso con il codice nozze.
              </p>
              <textarea
                rows={3}
                value={newWedWelcomeMessage}
                onChange={(e) => setNewWedWelcomeMessage(e.target.value)}
                className="w-full p-3 bg-white border border-neutral-300 rounded-xl focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Sezione 4: Strutture Hotel Convenzionate dal Database Master */}
            <div className="p-6 bg-neutral-50/70 rounded-2xl border border-neutral-200/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span>4. Hotel e Dimore Convenzionate da Abilitare</span>
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Seleziona le strutture dal database fornitori master da rendere opzionabili per gli ospiti di questo matrimonio:
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-neutral-600 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 self-start sm:self-auto">
                  {newWedSelectedSuppliers.length} hotel selezionati
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {suppliers.filter(s => s.category === 'HOTEL').map((sup) => {
                  const isChecked = newWedSelectedSuppliers.includes(sup.id);
                  return (
                    <label
                      key={sup.id}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked 
                          ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300 shadow-2xs' 
                          : 'bg-white border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWedSelectedSuppliers(prev => [...prev, sup.id]);
                          } else {
                            setNewWedSelectedSuppliers(prev => prev.filter(id => id !== sup.id));
                          }
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-amber-700 border-neutral-300 focus:ring-amber-700"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-neutral-900 truncate">{sup.name}</div>
                        <div className="text-[11px] text-neutral-500">{sup.stars}★ · {sup.city}</div>
                        <div className="text-[11px] font-mono text-emerald-800 font-semibold mt-0.5">
                          €{sup.standardRate} / notte
                        </div>
                        {sup.websiteUrl && (
                          <div className="text-[10px] text-emerald-700 truncate mt-1">
                            ✓ Booking engine collegato
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Sezione 5: Moduli & Servizi Aggiuntivi Inclusi */}
            <div className="p-6 bg-neutral-50/70 rounded-2xl border border-neutral-200/90 space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>5. Servizi Aggiuntivi Preconfigurati per gli Ospiti</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newWedIncludeTransfers}
                    onChange={(e) => setNewWedIncludeTransfers(e.target.checked)}
                    className="w-4 h-4 rounded text-neutral-900 border-neutral-300"
                  />
                  <div>
                    <span className="font-semibold block text-neutral-800">Transfer Aeroporto</span>
                    <span className="text-[10px] text-neutral-400">Navette Bari/Brindisi & NCC</span>
                  </div>
                </label>

                <label className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newWedIncludeExperiences}
                    onChange={(e) => setNewWedIncludeExperiences(e.target.checked)}
                    className="w-4 h-4 rounded text-neutral-900 border-neutral-300"
                  />
                  <div>
                    <span className="font-semibold block text-neutral-800">Esperienze Tipiche</span>
                    <span className="text-[10px] text-neutral-400">Pizzica party & barche</span>
                  </div>
                </label>

                <label className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newWedIncludeServices}
                    onChange={(e) => setNewWedIncludeServices(e.target.checked)}
                    className="w-4 h-4 rounded text-neutral-900 border-neutral-300"
                  />
                  <div>
                    <span className="font-semibold block text-neutral-800">Beauty & Parrucco</span>
                    <span className="text-[10px] text-neutral-400">Make-up in camera invitata</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Pulsanti di Azione */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-xl cursor-pointer"
              >
                Annulla e Torna Indietro
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <Plus className="w-4 h-4" />
                <span>Salva e Attiva Questo Matrimonio Ora</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
