import { useState, useMemo } from 'react';
import { 
  Building2, 
  Car, 
  Sparkles, 
  Check, 
  MapPin, 
  Plane, 
  ShieldCheck, 
  Download, 
  Info, 
  MessageCircle, 
  LogOut,
  Send,
  Scissors,
  HelpCircle,
  Lightbulb,
  Clock,
  Printer,
  MailCheck,
  CheckCircle2,
  Calendar,
  Heart,
  Camera,
  Bell,
  Gift,
  Sun,
  Utensils,
  Compass,
  ShoppingCart,
  Users,
  ExternalLink,
  Calculator,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  XCircle,
  FileText,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { 
  WeddingData, 
  HotelItem, 
  TransferItem, 
  ExperienceItem, 
  ExtraServiceItem,
  TouristWishRequest,
  ChatMessage,
  MasterSupplier,
  SupplierBookingOrder
} from '../data/weddingStore';

interface GuestPortalProps {
  weddingData: WeddingData;
  guestInfo: {
    name: string;
    email: string;
    weddingCode: string;
    provider: 'google' | 'apple' | 'email';
    country?: string;
  };
  adminNotificationEmail: string;
  suppliers: MasterSupplier[];
  onLogout: () => void;
  chatMessages: ChatMessage[];
  onSendMessage: (msg: { text: string; guestName: string; guestEmail: string; weddingCode: string }) => void;
  onSendWish: (wish: { title: string; description: string; preferredDate: string; participantsCount: number; budgetRange: string }) => void;
  onConfirmBookingToSuppliers?: (orders: SupplierBookingOrder[]) => void;
}

export default function GuestPortal({ 
  weddingData, 
  guestInfo, 
  adminNotificationEmail,
  suppliers,
  onLogout,
  chatMessages,
  onSendMessage,
  onSendWish,
  onConfirmBookingToSuppliers
}: GuestPortalProps) {
  // Navigazione libera tra sezioni: nessun vincolo sequenziale obbligatorio!
  const [activeTab, setActiveTab] = useState<'couple-info' | 'hotels' | 'transfers' | 'experiences' | 'services' | 'wishes' | 'chat' | 'itinerary'>('couple-info');

  // Selezione Hotel (Opzionale: l'ospite può non volere l'hotel!)
  const [wantsHotel, setWantsHotel] = useState<boolean>(true);
  const [selectedHotelId, setSelectedHotelId] = useState<string>(weddingData.hotels[0]?.id || '');
  const [selectedRoomTypeName, setSelectedRoomTypeName] = useState<string>(
    weddingData.hotels[0]?.roomTypes[0]?.name || ''
  );
  const [checkIn, setCheckIn] = useState('2026-09-10');
  const [checkOut, setCheckOut] = useState('2026-09-13');
  const [hotelSpecialRequests, setHotelSpecialRequests] = useState('');

  // Selezione Transfer (Opzionale: l'ospite può viaggiare in autonomia!)
  const [wantsTransfer, setWantsTransfer] = useState<boolean>(true);
  const [selectedTransferId, setSelectedTransferId] = useState<string>(weddingData.transfers[0]?.id || '');
  const [flightNumber, setFlightNumber] = useState('Ryanair FR7082');
  const [flightArrivalDate, setFlightArrivalDate] = useState('2026-09-11 10:45');
  const [luggageCount, setLuggageCount] = useState(2);

  // Selezione Esperienze (Multi-selezione libera: include quelle offerte gratis dagli sposi e quelle extra)
  const [selectedExperienceIds, setSelectedExperienceIds] = useState<string[]>(() => {
    // Di default preseleziona l'esperienza offerta dagli sposi (welcome party) se presente
    const sponsored = weddingData.experiences.find(e => e.isHostSponsored);
    return sponsored ? [sponsored.id] : [];
  });

  // Selezione Servizi Extra (Trucco, Parrucco, Babysitting, etc.)
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Modulo Nuova Richiesta / Desiderio Ospite
  const [wishTitle, setWishTitle] = useState('');
  const [wishDescription, setWishDescription] = useState('');
  const [wishDate, setWishDate] = useState('2026-09-14');
  const [wishParticipants, setWishParticipants] = useState(2);
  const [wishBudget, setWishBudget] = useState('€150 - €300');
  const [wishSuccessMessage, setWishSuccessMessage] = useState(false);

  // Input Chat con Valeria
  const [newChatMessage, setNewChatMessage] = useState('');

  // Stato Invio Voucher Email
  const [emailSentStatus, setEmailSentStatus] = useState<{ sent: boolean; message: string; timestamp?: string } | null>(null);

  // Stato Calcolatore Booking Engine Struttura / Booking.com
  const [calcAdults, setCalcAdults] = useState<number>(2);
  const [calcChildren, setCalcChildren] = useState<number>(0);
  const [calcRoomsCount, setCalcRoomsCount] = useState<number>(1);
  const [isQueryingBookingEngine, setIsQueryingBookingEngine] = useState<boolean>(false);
  const [calculatedQuote, setCalculatedQuote] = useState<{
    hotelId: string;
    hotelName: string;
    roomType: string;
    nights: number;
    pricePerNight: number;
    totalAmount: number;
    available: boolean;
    directBookingUrl: string;
    sourceName: string;
  } | null>(null);

  // Stato Scheda Prenotazione Confermata dall'Ospite (Riepilogo Opzioni con modifica, annulla, aggiungi)
  const [confirmedBookingCard, setConfirmedBookingCard] = useState<{
    id: string;
    confirmedAt: string;
    status: 'CONFERMATO' | 'IN_GESTIONE' | 'MODIFICATO' | 'ANNULLATO';
    items: {
      category: 'HOTEL' | 'TRANSFER' | 'EXPERIENCE' | 'SERVICE';
      title: string;
      details: string;
      cost: number;
      freeByCouple?: boolean;
      cancellationPolicy: string;
      canCancel: boolean;
      canModify: boolean;
      deadlineDate: string;
    }[];
    totalDue: number;
  } | null>(() => {
    try {
      const saved = localStorage.getItem(`guest_confirmed_booking_${weddingData.weddingCode}_${guestInfo.email}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const currentHotel = wantsHotel ? weddingData.hotels.find(h => h.id === selectedHotelId) : null;
  const currentTransfer = wantsTransfer ? weddingData.transfers.find(t => t.id === selectedTransferId) : null;

  // Toggle Esperienza
  const toggleExperience = (id: string) => {
    if (selectedExperienceIds.includes(id)) {
      setSelectedExperienceIds(selectedExperienceIds.filter(item => item !== id));
    } else {
      setSelectedExperienceIds([...selectedExperienceIds, id]);
    }
  };

  // Toggle Servizio
  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter(item => item !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Invio messaggio in chat a Valeria
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    onSendMessage({
      text: newChatMessage.trim(),
      guestName: guestInfo.name,
      guestEmail: guestInfo.email,
      weddingCode: weddingData.weddingCode
    });
    setNewChatMessage('');
  };

  // Invio richiesta desiderio
  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishTitle.trim() || !wishDescription.trim()) return;

    onSendWish({
      title: wishTitle.trim(),
      description: wishDescription.trim(),
      preferredDate: wishDate,
      participantsCount: Number(wishParticipants),
      budgetRange: wishBudget
    });

    setWishSuccessMessage(true);
    setWishTitle('');
    setWishDescription('');
    setTimeout(() => setWishSuccessMessage(false), 5000);
  };

  // Calcolo notti di soggiorno
  const calculateNights = () => {
    try {
      const dIn = new Date(checkIn);
      const dOut = new Date(checkOut);
      const diffTime = dOut.getTime() - dIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  // Interroga il booking engine della struttura o Booking.com per calcolo rapido e disponibilità
  const handleQueryBookingEngine = (hotel: HotelItem) => {
    setIsQueryingBookingEngine(true);
    const nights = calculateNights();
    
    // Tasso base camera selezionata o prima disponibile
    const currentRt = hotel.roomTypes.find(rt => rt.name === selectedRoomTypeName) || hotel.roomTypes[0];
    const baseRate = currentRt ? currentRt.pricePerNight : hotel.negotiatedRate;
    
    // Supplemento occupanti extra oltre 2 adulti (+20% per persona extra)
    const extraOccupants = Math.max(0, (calcAdults + calcChildren) - 2);
    const extraMultiplier = 1 + (extraOccupants * 0.2);
    const effectiveRatePerNight = Math.round(baseRate * extraMultiplier * calcRoomsCount);
    const totalCost = effectiveRatePerNight * nights;

    // Costruzione URL diretto verso il booking engine interno o Booking.com
    let directUrl = hotel.websiteUrl;
    let sourceName = 'Booking Engine Diretto Struttura';

    if (hotel.websiteUrl) {
      // Parametri query di prenotazione passati al booking engine dell'hotel
      directUrl = `${hotel.websiteUrl}?checkin=${checkIn}&checkout=${checkOut}&adults=${calcAdults}&children=${calcChildren}&rooms=${calcRoomsCount}&code=${encodeURIComponent(hotel.groupCode || weddingData.weddingCode)}`;
      sourceName = `Booking Engine Ufficiale (${hotel.name})`;
    } else {
      // In assenza di booking engine proprio, collega a Booking.com
      const checkinDate = new Date(checkIn);
      const checkoutDate = new Date(checkOut);
      directUrl = `https://www.booking.com/searchresults.it.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.address)}&checkin_year=${checkinDate.getFullYear()}&checkin_month=${checkinDate.getMonth() + 1}&checkin_monthday=${checkinDate.getDate()}&checkout_year=${checkoutDate.getFullYear()}&checkout_month=${checkoutDate.getMonth() + 1}&checkout_monthday=${checkoutDate.getDate()}&group_adults=${calcAdults}&group_children=${calcChildren}&no_rooms=${calcRoomsCount}`;
      sourceName = 'Booking.com (Servizio Esterno Partner)';
    }

    setTimeout(() => {
      setCalculatedQuote({
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomType: currentRt ? currentRt.name : 'Camera Matrimoniale',
        nights,
        pricePerNight: effectiveRatePerNight,
        totalAmount: totalCost,
        available: true,
        directBookingUrl: directUrl,
        sourceName
      });
      setIsQueryingBookingEngine(false);
    }, 700);
  };

  // Opziona la struttura con il preventivo calcolato
  const handleSelectCalculatedQuote = () => {
    if (!calculatedQuote) return;
    setSelectedHotelId(calculatedQuote.hotelId);
    setSelectedRoomTypeName(calculatedQuote.roomType);
    setWantsHotel(true);
  };

  // Conferma definitiva e invio scelte (Crea o Aggiorna la Scheda Opzioni Scelte con Restrizioni Admin)
  const handleConfirmAndSendChoices = () => {
    const timestamp = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const fullDate = new Date().toISOString().split('T')[0];

    const items: {
      category: 'HOTEL' | 'TRANSFER' | 'EXPERIENCE' | 'SERVICE';
      title: string;
      details: string;
      cost: number;
      freeByCouple?: boolean;
      cancellationPolicy: string;
      canCancel: boolean;
      canModify: boolean;
      deadlineDate: string;
    }[] = [];

    // 1. Hotel
    if (wantsHotel && currentHotel) {
      items.push({
        category: 'HOTEL',
        title: `${currentHotel.name} - ${selectedRoomTypeName}`,
        details: `Check-in: ${checkIn} | Check-out: ${checkOut} (${calculateNights()} notti) · ${calcAdults} Adulti, ${calcChildren} Ragazzi`,
        cost: currentHotel.negotiatedRate * calculateNights(),
        freeByCouple: false,
        cancellationPolicy: `Restrizione Amministratore: Cancellazione gratuita fino al ${currentHotel.bookingDeadline || '15 Luglio 2026'}. Successivamente è trattenuta la prima notte.`,
        canCancel: true,
        canModify: true,
        deadlineDate: currentHotel.bookingDeadline || '2026-07-15'
      });
    }

    // 2. Transfer
    if (wantsTransfer && currentTransfer) {
      items.push({
        category: 'TRANSFER',
        title: currentTransfer.title,
        details: `Volo ${flightNumber} del ${flightArrivalDate} · ${luggageCount} Bagagli`,
        cost: currentTransfer.isPaidByCouple ? 0 : currentTransfer.pricePerSeat * 2,
        freeByCouple: currentTransfer.isPaidByCouple,
        cancellationPolicy: 'Restrizione Amministratore: Modifica orario consentita fino a 48h prima del volo. Cancellazione gratuita entro 7 giorni.',
        canCancel: true,
        canModify: true,
        deadlineDate: '2026-09-04'
      });
    }

    // 3. Esperienze
    selectedExperienceIds.forEach(id => {
      const exp = weddingData.experiences.find(e => e.id === id);
      if (exp) {
        items.push({
          category: 'EXPERIENCE',
          title: exp.title,
          details: `${exp.eventDate} alle ore ${exp.startTime} · ${exp.meetingPoint}`,
          cost: exp.isHostSponsored ? 0 : exp.pricePerPerson * 2,
          freeByCouple: exp.isHostSponsored,
          cancellationPolicy: exp.isHostSponsored 
            ? 'Esperienza offerta dagli sposi: comunicare disdetta con almeno 3 giorni di anticipo per liberare i posti ad altri ospiti.'
            : 'Restrizione Amministratore: Rimborsabile al 100% se annullata entro 5 giorni prima dell\'evento per rispetto dei fornitori locali.',
          canCancel: true,
          canModify: false,
          deadlineDate: '2026-09-05'
        });
      }
    });

    // 4. Servizi Extra
    selectedServiceIds.forEach(id => {
      const srv = weddingData.extraServices.find(s => s.id === id);
      if (srv) {
        items.push({
          category: 'SERVICE',
          title: srv.title,
          details: `${srv.providerName} (${srv.duration}) - Servizio in camera`,
          cost: srv.isPaidByCouple ? 0 : srv.price,
          freeByCouple: srv.isPaidByCouple,
          cancellationPolicy: 'Restrizione Amministratore: Orario concordato con la truccatrice/parrucchiere; modifiche consentite solo in base agli slot residui dell\'agenda.',
          canCancel: true,
          canModify: true,
          deadlineDate: '2026-09-08'
        });
      }
    });

    const newCard = {
      id: `conf-${Date.now()}`,
      confirmedAt: `${fullDate} ${timestamp}`,
      status: 'CONFERMATO' as const,
      items,
      totalDue: calculateTotalDue()
    };

    setConfirmedBookingCard(newCard);
    try {
      localStorage.setItem(`guest_confirmed_booking_${weddingData.weddingCode}_${guestInfo.email}`, JSON.stringify(newCard));
    } catch {
      // Ignora errori storage
    }

    // Esegui anche notifica email e ordini fornitori
    handleSendVoucherEmail();

    // Sposta l'utente sulla visualizzazione della scheda confermata
    setActiveTab('itinerary');
  };

  // Annulla una voce confermata in base alle restrizioni
  const handleCancelConfirmedItem = (category: string, title: string) => {
    if (!confirmedBookingCard) return;

    if (category === 'HOTEL') {
      setWantsHotel(false);
    } else if (category === 'TRANSFER') {
      setWantsTransfer(false);
    } else if (category === 'EXPERIENCE') {
      const exp = weddingData.experiences.find(e => e.title === title);
      if (exp) {
        setSelectedExperienceIds(prev => prev.filter(id => id !== exp.id));
      }
    } else if (category === 'SERVICE') {
      const srv = weddingData.extraServices.find(s => s.title === title);
      if (srv) {
        setSelectedServiceIds(prev => prev.filter(id => id !== srv.id));
      }
    }

    const updatedItems = confirmedBookingCard.items.filter(it => it.title !== title);
    const updatedCard = {
      ...confirmedBookingCard,
      items: updatedItems,
      status: 'MODIFICATO' as const,
      totalDue: calculateTotalDue()
    };
    setConfirmedBookingCard(updatedCard);
    try {
      localStorage.setItem(`guest_confirmed_booking_${weddingData.weddingCode}_${guestInfo.email}`, JSON.stringify(updatedCard));
    } catch {}
  };

  // Calcolo totale da saldare per servizi a pagamento
  const calculateTotalDue = () => {
    let total = 0;
    // Transfer (se a pagamento)
    if (wantsTransfer && currentTransfer && !currentTransfer.isPaidByCouple) {
      total += currentTransfer.pricePerSeat;
    }
    // Esperienze (solo quelle non offerte dagli sposi)
    selectedExperienceIds.forEach(id => {
      const exp = weddingData.experiences.find(e => e.id === id);
      if (exp && !exp.isHostSponsored) {
        total += exp.pricePerPerson;
      }
    });
    // Servizi extra
    selectedServiceIds.forEach(id => {
      const srv = weddingData.extraServices.find(s => s.id === id);
      if (srv && !srv.isPaidByCouple) {
        total += srv.price;
      }
    });
    return total;
  };

  // Test e invio effettivo voucher via email e notifica ai Fornitori Partner
  const handleSendVoucherEmail = () => {
    const timestamp = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const orders: SupplierBookingOrder[] = [];
    const notifiedSuppliersList: string[] = [];

    // 1. Hotel Partner
    if (wantsHotel && currentHotel) {
      const sup = suppliers.find(s => s.id === currentHotel.supplierId || s.name.toLowerCase().includes('borgo') || s.category === 'HOTEL') || suppliers[0];
      const hotelOrder: SupplierBookingOrder = {
        id: `ord-hotel-${Date.now()}`,
        supplierId: sup.id,
        supplierName: sup.name,
        supplierEmail: sup.email,
        weddingCode: weddingData.weddingCode,
        coupleNames: weddingData.coupleNames,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: '+39 340 1234567',
        serviceTitle: `${currentHotel.name} - ${selectedRoomTypeName}`,
        serviceCategory: 'HOTEL',
        dateRequested: `${checkIn} al ${checkOut}`,
        participantsOrQuantity: 1,
        totalAmount: currentHotel.negotiatedRate * 3,
        currency: 'EUR',
        guestNotes: hotelSpecialRequests || 'Nessuna preferenza specificata',
        status: 'RECEIVED',
        emailSentToSupplierAt: `${new Date().toISOString().split('T')[0]} ${timestamp}`
      };
      orders.push(hotelOrder);
      notifiedSuppliersList.push(`${sup.name} (${sup.email})`);
    }

    // 2. Transfer / NCC Partner
    if (wantsTransfer && currentTransfer) {
      const sup = suppliers.find(s => s.id === currentTransfer.supplierId || s.category === 'TRANSFER') || suppliers[3];
      const transferOrder: SupplierBookingOrder = {
        id: `ord-tr-${Date.now()}`,
        supplierId: sup.id,
        supplierName: sup.name,
        supplierEmail: sup.email,
        weddingCode: weddingData.weddingCode,
        coupleNames: weddingData.coupleNames,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: '+39 340 1234567',
        serviceTitle: currentTransfer.title,
        serviceCategory: 'TRANSFER',
        dateRequested: flightArrivalDate,
        participantsOrQuantity: 2,
        totalAmount: currentTransfer.isPaidByCouple ? 0 : currentTransfer.pricePerSeat * 2,
        currency: 'EUR',
        guestNotes: `Volo: ${flightNumber}, Valigie: ${luggageCount}`,
        status: 'RECEIVED',
        emailSentToSupplierAt: `${new Date().toISOString().split('T')[0]} ${timestamp}`
      };
      orders.push(transferOrder);
      if (!notifiedSuppliersList.some(s => s.includes(sup.name))) {
        notifiedSuppliersList.push(`${sup.name} (${sup.email})`);
      }
    }

    // 3. Esperienze Partner
    selectedExperienceIds.forEach(id => {
      const exp = weddingData.experiences.find(e => e.id === id);
      if (exp) {
        const sup = suppliers.find(s => s.id === exp.supplierId || s.category === 'EXPERIENCE') || suppliers[4];
        const expOrder: SupplierBookingOrder = {
          id: `ord-exp-${Date.now()}-${id}`,
          supplierId: sup.id,
          supplierName: sup.name,
          supplierEmail: sup.email,
          weddingCode: weddingData.weddingCode,
          coupleNames: weddingData.coupleNames,
          guestName: guestInfo.name,
          guestEmail: guestInfo.email,
          guestPhone: '+39 340 1234567',
          serviceTitle: exp.title,
          serviceCategory: 'EXPERIENCE',
          dateRequested: `${exp.eventDate} ore ${exp.startTime}`,
          participantsOrQuantity: 2,
          totalAmount: exp.isHostSponsored ? 0 : exp.pricePerPerson * 2,
          currency: 'EUR',
          guestNotes: exp.isHostSponsored ? 'Offerto con affetto dagli sposi (Gratuito)' : 'Servizio a pagamento',
          status: 'RECEIVED',
          emailSentToSupplierAt: `${new Date().toISOString().split('T')[0]} ${timestamp}`
        };
        orders.push(expOrder);
        if (!notifiedSuppliersList.some(s => s.includes(sup.name))) {
          notifiedSuppliersList.push(`${sup.name} (${sup.email})`);
        }
      }
    });

    // 4. Servizi Extra Beauty / Acconciatura Partner
    selectedServiceIds.forEach(id => {
      const srv = weddingData.extraServices.find(s => s.id === id);
      if (srv) {
        const sup = suppliers.find(s => s.category === 'BEAUTY_HAIR') || suppliers[5];
        const srvOrder: SupplierBookingOrder = {
          id: `ord-srv-${Date.now()}-${id}`,
          supplierId: sup.id,
          supplierName: sup.name,
          supplierEmail: sup.email,
          weddingCode: weddingData.weddingCode,
          coupleNames: weddingData.coupleNames,
          guestName: guestInfo.name,
          guestEmail: guestInfo.email,
          guestPhone: '+39 340 1234567',
          serviceTitle: srv.title,
          serviceCategory: 'BEAUTY_HAIR',
          dateRequested: 'Giorno Cerimonia in Masseria',
          participantsOrQuantity: 1,
          totalAmount: srv.price,
          currency: 'EUR',
          guestNotes: 'Servizio richiesto direttamente in camera',
          status: 'RECEIVED',
          emailSentToSupplierAt: `${new Date().toISOString().split('T')[0]} ${timestamp}`
        };
        orders.push(srvOrder);
        if (!notifiedSuppliersList.some(s => s.includes(sup.name))) {
          notifiedSuppliersList.push(`${sup.name} (${sup.email})`);
        }
      }
    });

    // Notifica Fornitori
    if (orders.length > 0 && onConfirmBookingToSuppliers) {
      onConfirmBookingToSuppliers(orders);
    }

    const suppliersNotice = notifiedSuppliersList.length > 0
      ? `Notifica di prenotazione trasmessa via email anche ai Fornitori Partner: ${notifiedSuppliersList.join(', ')}. I fornitori riceveranno l'ordine sulla propria casella e definiranno la modalità di saldo.`
      : '';

    setEmailSentStatus({
      sent: true,
      timestamp,
      message: `Voucher inviato con successo all'ospite (${guestInfo.email}) e trasmesso alla centrale operativa AD Marketing (${adminNotificationEmail}). ${suppliersNotice}`
    });
  };

  // Stampa Voucher
  const handlePrintVoucher = () => {
    window.print();
  };

  // Filtra i messaggi di questa specifica conversazione con l'ospite
  const guestChatHistory = chatMessages.filter(
    m => m.weddingCode === weddingData.weddingCode && 
        (m.guestEmail.toLowerCase() === guestInfo.email.toLowerCase() || m.guestName === guestInfo.name)
  );

  return (
    <div className="space-y-6">
      {/* Banner Intestazione Invitato */}
      <div className="border border-neutral-200 rounded-2xl p-6 md:p-8 bg-white shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
              <span>Apulian Wedding Concierge</span>
              <span aria-hidden="true">·</span>
              <span>Puglia & Destination Wedding</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900 mt-1">
              Benvenuto, {guestInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Sei invitato al matrimonio di <strong className="text-neutral-900">{weddingData.coupleNames}</strong> a {weddingData.venue} ({weddingData.city}).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Assistente Valeria (Online)</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Esci</span>
            </button>
          </div>
        </div>

        {/* Messaggio Personalizzato degli Sposi */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Messaggio dagli Sposi per te:</span>
            <p className="leading-relaxed text-amber-950/90 italic">
              "{weddingData.welcomeMessage}"
            </p>
          </div>
        </div>

        {/* Avvisi in Evidenza Pubblicati dagli Sposi */}
        {weddingData.broadcastAnnouncements && weddingData.broadcastAnnouncements.length > 0 && (
          <div className="space-y-2">
            {weddingData.broadcastAnnouncements.map((ann) => (
              <div 
                key={ann.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                  ann.urgent 
                    ? 'bg-rose-50 border-rose-200 text-rose-950' 
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <Bell className={`w-4 h-4 shrink-0 mt-0.5 ${ann.urgent ? 'text-rose-600' : 'text-amber-700'}`} />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    {ann.urgent && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-600 text-white uppercase">
                        Urgente dagli Sposi
                      </span>
                    )}
                    <span className="font-bold">{ann.title}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">• {ann.date}</span>
                  </div>
                  <p className="leading-relaxed">{ann.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pulsanti Navigazione Adattivi alla larghezza dello schermo (Nessuno scorrimento orizzontale, 100% responsive e carini) */}
        <div className="border-t border-neutral-100 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {/* 1. Dagli Sposi */}
            <button
              onClick={() => setActiveTab('couple-info')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'couple-info' 
                  ? 'bg-rose-900 text-white font-semibold shadow-xs border-rose-950 ring-2 ring-rose-900/20' 
                  : 'text-rose-900 hover:text-rose-950 hover:bg-rose-100/70 bg-rose-50/80 border-rose-200/70'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'couple-info' ? 'bg-white/15' : 'bg-rose-100 text-rose-800'}`}>
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-semibold">Dagli Sposi</span>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'couple-info' ? 'text-rose-200' : 'text-rose-700'}`}>Guida nozze</span>
              </div>
            </button>

            {/* 2. Hotel & Soggiorno */}
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'hotels' 
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-neutral-50/90 border-neutral-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'hotels' ? 'bg-white/15' : 'bg-neutral-200/60 text-neutral-800'}`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="block text-xs font-semibold">Hotel</span>
                  {wantsHotel && currentHotel && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Selezionato" />
                  )}
                </div>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'hotels' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {wantsHotel && currentHotel ? 'Opzionato' : 'Convenzioni'}
                </span>
              </div>
            </button>

            {/* 3. Transfer Aeroporto */}
            <button
              onClick={() => setActiveTab('transfers')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'transfers' 
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-neutral-50/90 border-neutral-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'transfers' ? 'bg-white/15' : 'bg-neutral-200/60 text-neutral-800'}`}>
                <Car className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="block text-xs font-semibold">Transfer</span>
                  {wantsTransfer && currentTransfer && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Selezionato" />
                  )}
                </div>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'transfers' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Navette & NCC
                </span>
              </div>
            </button>

            {/* 4. Esperienze & Party */}
            <button
              onClick={() => setActiveTab('experiences')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'experiences' 
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-neutral-50/90 border-neutral-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'experiences' ? 'bg-white/15' : 'bg-neutral-200/60 text-neutral-800'}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="block text-xs font-semibold">Esperienze</span>
                  {selectedExperienceIds.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                      {selectedExperienceIds.length}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'experiences' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Feste & Tour
                </span>
              </div>
            </button>

            {/* 5. Trucco & Parrucco */}
            <button
              onClick={() => setActiveTab('services')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'services' 
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-neutral-50/90 border-neutral-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'services' ? 'bg-white/15' : 'bg-neutral-200/60 text-neutral-800'}`}>
                <Scissors className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="block text-xs font-semibold">Beauty</span>
                  {selectedServiceIds.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                      {selectedServiceIds.length}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'services' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Trucco & Capelli
                </span>
              </div>
            </button>

            {/* 6. Desideri su Misura */}
            <button
              onClick={() => setActiveTab('wishes')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'wishes' 
                  ? 'bg-neutral-900 text-white font-semibold shadow-xs border-black ring-2 ring-neutral-900/20' 
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 bg-neutral-50/90 border-neutral-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'wishes' ? 'bg-white/15' : 'bg-amber-100 text-amber-700'}`}>
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-semibold">Desideri</span>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'wishes' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Su Misura
                </span>
              </div>
            </button>

            {/* 7. Chat Valeria */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'chat' 
                  ? 'bg-emerald-800 text-white font-semibold shadow-xs border-emerald-900 ring-2 ring-emerald-800/20' 
                  : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/70 bg-emerald-50/80 border-emerald-200/70'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'chat' ? 'bg-white/15' : 'bg-emerald-100 text-emerald-800'}`}>
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block text-xs font-semibold">Valeria</span>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'chat' ? 'text-emerald-200' : 'text-emerald-700'}`}>
                  Chat Concierge
                </span>
              </div>
            </button>

            {/* 8. Riepilogo Scelte */}
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 p-2.5 rounded-xl transition-all active:scale-95 cursor-pointer text-center sm:text-left border ${
                activeTab === 'itinerary' 
                  ? 'bg-amber-600 text-white font-semibold shadow-xs border-amber-700 ring-2 ring-amber-600/20' 
                  : 'text-amber-900 hover:text-amber-950 hover:bg-amber-100/70 bg-amber-50/80 border-amber-200/70'
              }`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${activeTab === 'itinerary' ? 'bg-white/15' : 'bg-amber-100 text-amber-800'}`}>
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <span className="block text-xs font-semibold">Riepilogo</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${activeTab === 'itinerary' ? 'bg-white text-amber-800' : 'bg-amber-700 text-white'}`}>
                    {selectedExperienceIds.length + selectedServiceIds.length + (wantsHotel ? 1 : 0) + (wantsTransfer ? 1 : 0)}
                  </span>
                </div>
                <span className={`text-[10px] hidden sm:block ${activeTab === 'itinerary' ? 'text-amber-100' : 'text-amber-700'}`}>
                  €{calculateTotalDue()} saldo
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEZIONE 0: DAGLI SPOSI (FOTO, TIMELINE, DRESS CODE & GUIDA VIAGGIO)      */}
      {/* ========================================================================= */}
      {activeTab === 'couple-info' && (
        <div className="space-y-6">
          {/* Card Dettagli & Dress Code */}
          <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                La Nostra Festa in Puglia
              </span>
              <h2 className="text-2xl font-serif-luxury font-bold text-neutral-900 mt-2">
                {weddingData.coupleNames} · Informazioni & Dettagli
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-2">
                <span>🗓 {new Date(weddingData.weddingDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>•</span>
                <span>📍 {weddingData.venue}, {weddingData.city}</span>
                <span>•</span>
                <span>🔑 Codice: <strong className="font-mono text-neutral-800">{weddingData.weddingCode}</strong></span>
              </div>
            </div>

            {/* Dress code & Note di stile */}
            {weddingData.dressCode && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Dress Code & Stile Suggerito dagli Sposi:</span>
                </span>
                <p className="text-amber-900 leading-relaxed">
                  {weddingData.dressCode}
                </p>
              </div>
            )}

            {/* Storia */}
            {weddingData.story && (
              <div className="text-xs text-neutral-600 leading-relaxed italic bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                "{weddingData.story}"
              </div>
            )}
          </div>

          {/* Programma Nozze / Timeline della Giornata */}
          {weddingData.schedule && weddingData.schedule.length > 0 && (
            <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-4">
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Programma del Nostro Matrimonio</span>
              </h3>
              <div className="space-y-2.5">
                {weddingData.schedule.map((ev) => (
                  <div key={ev.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start sm:items-center gap-3">
                    <span className="px-2.5 py-1 rounded bg-neutral-900 text-white font-mono text-xs font-bold shrink-0">
                      {ev.time}
                    </span>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                        <span>{ev.title}</span>
                        <span className="text-[11px] font-normal text-neutral-500">📍 {ev.location}</span>
                      </div>
                      {ev.description && (
                        <div className="text-[11px] text-neutral-600 mt-0.5">{ev.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Galleria Foto Caricata dagli Sposi */}
          {weddingData.galleryPhotos && weddingData.galleryPhotos.length > 0 && (
            <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-4">
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-rose-600" />
                <span>Galleria Fotografica della Nostra Storia in Puglia</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {weddingData.galleryPhotos.map((photo) => (
                  <div key={photo.id} className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 group">
                    <div className="aspect-4/3 overflow-hidden">
                      <img 
                        src={photo.url} 
                        alt={photo.caption || 'Foto sposi'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {photo.caption && (
                      <div className="p-2.5 bg-white text-[11px] font-semibold text-neutral-800 truncate border-t border-neutral-100">
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schede Informazioni Secondarie per il Viaggio */}
          {weddingData.secondaryInfo && weddingData.secondaryInfo.length > 0 && (
            <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-4">
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600" />
                <span>Guida Utile & Informazioni Pratiche per il Soggiorno</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weddingData.secondaryInfo.map((sec) => (
                  <div key={sec.id} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                    <span className="text-xs font-bold text-neutral-900 block">
                      {sec.title}
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE 1: HOTEL & ALLOGGIO (OPZIONALE!)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'hotels' && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Hotel e Dimore Convenzionate
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Tariffe speciali riservate agli invitati. Non hai l'obbligo di selezionare un hotel: puoi alloggiare liberamente dove preferisci.
              </p>
            </div>

            {/* Switch: Voglio un hotel convenzionato vs Ho già un alloggio */}
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-lg text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setWantsHotel(true)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${wantsHotel ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'}`}
              >
                Prenota Hotel
              </button>
              <button
                type="button"
                onClick={() => setWantsHotel(false)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${!wantsHotel ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'}`}
              >
                Ho già un alloggio autonomo
              </button>
            </div>
          </div>

          {!wantsHotel ? (
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900">Alloggio Autonomo Selezionato</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Perfetto! Non è richiesta alcuna prenotazione alberghiera tramite il nostro concierge. Potrai comunque usufruire dei transfer, delle esperienze e dei servizi make-up.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weddingData.hotels.map((h) => {
                  const isSelected = selectedHotelId === h.id;
                  return (
                    <div
                      key={h.id}
                      onClick={() => {
                        setSelectedHotelId(h.id);
                        setSelectedRoomTypeName(h.roomTypes[0]?.name || '');
                      }}
                      className={`cursor-pointer rounded-xl border-2 p-5 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50/60 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
                            {h.stars} Stelle · €{h.negotiatedRate} / notte
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>

                        <h3 className="text-base font-serif-luxury font-bold text-neutral-900">{h.name}</h3>
                        <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{h.address}</span>
                        </p>
                        <p className="text-xs text-neutral-600 italic">{h.distanceToVenue}</p>
                        {h.websiteUrl && (
                          <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2">
                            <a 
                              href={h.websiteUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                            >
                              <span>Booking Engine Ufficiale</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHotelId(h.id);
                                handleQueryBookingEngine(h);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-black bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200 cursor-pointer"
                            >
                              <Calculator className="w-3 h-3 text-neutral-600" />
                              <span>Calcolo Rapido Prezzo</span>
                            </button>
                          </div>
                        )}
                        {!h.websiteUrl && (
                          <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2">
                            <a 
                              href={`https://www.booking.com/searchresults.it.html?ss=${encodeURIComponent(h.name)}`}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 hover:text-sky-950 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200"
                            >
                              <span>Verifica su Booking.com</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedHotelId(h.id);
                                handleQueryBookingEngine(h);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-black bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200 cursor-pointer"
                            >
                              <Calculator className="w-3 h-3 text-neutral-600" />
                              <span>Calcolo Rapido Booking.com</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Scelta Tipologia Camere */}
                      <div className="mt-4 pt-4 border-t border-neutral-200/80 space-y-2 text-xs">
                        <span className="font-semibold text-neutral-700 block text-[11px] uppercase tracking-wider">
                          Tipologie nel Blocco Riservato:
                        </span>
                        {h.roomTypes.map((rt) => (
                          <label key={rt.id} className="flex items-center gap-2 p-2 bg-white rounded border border-neutral-200 cursor-pointer">
                            <input
                              type="radio"
                              name="roomType"
                              checked={selectedRoomTypeName === rt.name}
                              onChange={() => setSelectedRoomTypeName(rt.name)}
                            />
                            <div className="flex-1 flex justify-between">
                              <span>{rt.name}</span>
                              <span className="font-mono font-bold text-neutral-900">€{rt.pricePerNight} / notte</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Date di Soggiorno & Calcolatore Rapido Booking Engine */}
              <div className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                  <div>
                    <span className="font-bold text-neutral-900 flex items-center gap-1.5 text-sm">
                      <Calculator className="w-4 h-4 text-emerald-700" />
                      <span>Calcolo Rapido Costo Camera & Interrogazione Booking Engine</span>
                    </span>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Specifica numero di ospiti e periodo: il sistema interroga il booking engine della struttura (o Booking.com) ed elabora il preventivo in tempo reale con facoltà di opzionare la struttura.
                    </p>
                  </div>
                  {currentHotel && (
                    <span className="text-[11px] font-semibold text-neutral-700 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shrink-0">
                      Hotel Selezionato: <strong>{currentHotel.name}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Check-In</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Check-Out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Adulti</label>
                    <select
                      value={calcAdults}
                      onChange={(e) => setCalcAdults(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Adult{num === 1 ? 'o' : 'i'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Ragazzi / Bambini</label>
                    <select
                      value={calcChildren}
                      onChange={(e) => setCalcChildren(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden"
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} Ragazz{num === 1 ? 'o' : 'i'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={isQueryingBookingEngine || !currentHotel}
                      onClick={() => currentHotel && handleQueryBookingEngine(currentHotel)}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isQueryingBookingEngine ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Interrogazione...</span>
                        </>
                      ) : (
                        <>
                          <Calculator className="w-3.5 h-3.5" />
                          <span>Interroga Booking Engine</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Box Risultato Preventivo & Disponibilità Booking Engine */}
                {calculatedQuote && (
                  <div className="p-4 rounded-xl bg-white border-2 border-emerald-600/60 shadow-xs space-y-3 mt-3 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-neutral-900 text-xs">
                          Disponibilità Verificata: {calculatedQuote.hotelName} ({calculatedQuote.sourceName})
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Tariffa Garantita Convenzionata Nozze
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Durata:</span>
                        <strong className="text-neutral-900">{calculatedQuote.nights} Notti</strong>
                        <span className="text-[10px] text-neutral-400 block">({checkIn} → {checkOut})</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Ospiti:</span>
                        <strong className="text-neutral-900">{calcAdults} Adulti, {calcChildren} Ragazzi</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Costo per Notte:</span>
                        <strong className="text-neutral-900">€{calculatedQuote.pricePerNight}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Totale Preventivato:</span>
                        <strong className="text-emerald-700 text-sm font-mono">€{calculatedQuote.totalAmount}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                      <a
                        href={calculatedQuote.directBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-neutral-900 underline"
                      >
                        <span>Apri pagina prenotazione esterna ({calculatedQuote.sourceName})</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={handleSelectCalculatedQuote}
                        className="w-full sm:w-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Opziona Questa Struttura nel Riepilogo</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Richieste Speciali per l'Hotel (Note camera, culla, arrivo tardivo...)
                  </label>
                  <input
                    type="text"
                    value={hotelSpecialRequests}
                    onChange={(e) => setHotelSpecialRequests(e.target.value)}
                    placeholder="Es. Letto matrimoniale, culla per bebè, piano alto, arrivo serale..."
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <span className="text-xs text-neutral-500">
              Puoi passare liberamente alle altre sezioni in alto senza perdere i dati.
            </span>
            <button
              onClick={() => setActiveTab('transfers')}
              className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Vai ai Transfer Aeroporto →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE 2: TRANSFER & NAVETTE AEROPORTO (OPZIONALE!)                      */}
      {/* ========================================================================= */}
      {activeTab === 'transfers' && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
                Transfer Aeroportuali & Navette Nozze
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Collegamenti dagli aeroporti di Bari (BRI) e Brindisi (BDS) fino alle masserie, oltre alla navetta ufficiale per la cerimonia.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-lg text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setWantsTransfer(true)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${wantsTransfer ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'}`}
              >
                Richiedi Transfer
              </button>
              <button
                type="button"
                onClick={() => setWantsTransfer(false)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${!wantsTransfer ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'}`}
              >
                Mi sposterò in autonomia
              </button>
            </div>
          </div>

          {!wantsTransfer ? (
            <div className="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-semibold text-neutral-900">Nessun Transfer Richiesto</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Hai scelto di spostarti in autonomia (es. noleggio auto o auto propria). Potrai comunque salire a bordo della navetta ufficiale offerta per la festa nuziale!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {weddingData.transfers.map((t) => {
                  const isSelected = selectedTransferId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTransferId(t.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                        isSelected ? 'border-neutral-900 bg-neutral-50/60' : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded">
                            {t.type}
                          </span>
                          <span className="text-xs font-mono font-bold text-neutral-900">
                            {t.isPaidByCouple ? 'Gratuito (Offerto dagli sposi)' : `€${t.pricePerSeat} / persona`}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold text-neutral-900">{t.title}</h3>
                        <p className="text-xs text-neutral-600">
                          Tratta: {t.origin} → {t.destination} ({t.vehicleType})
                        </p>
                        <p className="text-xs text-neutral-500 font-mono">Orari partenze: {t.departureTime}</p>
                      </div>

                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dettagli Volo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Compagnia & Numero Volo</label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Es. Ryanair FR7082"
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Giorno & Orario di Arrivo</label>
                  <input
                    type="text"
                    value={flightArrivalDate}
                    onChange={(e) => setFlightArrivalDate(e.target.value)}
                    placeholder="Es. 11 Settembre - 10:45"
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Numero Valigie</label>
                  <input
                    type="number"
                    value={luggageCount}
                    onChange={(e) => setLuggageCount(Number(e.target.value))}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setActiveTab('hotels')}
              className="text-xs text-neutral-600 hover:text-neutral-900"
            >
              ← Torna agli Hotel
            </button>
            <button
              onClick={() => setActiveTab('experiences')}
              className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Vai alle Esperienze & Party →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE 3: ESPERIENZE (OFFERTE GRATIS DAGLI SPOSI E SU RICHIESTA)        */}
      {/* ========================================================================= */}
      {activeTab === 'experiences' && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Esperienze, Tour & Eventi Conviviali
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Abbiamo selezionato per te le migliori attività per vivere la magia della Puglia. Le serate offerte dagli sposi sono contrassegnate come <strong>gratuite</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {weddingData.experiences.map((exp) => {
              const isSelected = selectedExperienceIds.includes(exp.id);
              return (
                <div
                  key={exp.id}
                  onClick={() => toggleExperience(exp.id)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    isSelected ? 'border-neutral-900 bg-neutral-50/60' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">
                        {exp.eventDate} · {exp.startTime}
                      </span>
                      {exp.isHostSponsored ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>Offerto con affetto dagli Sposi (Gratuito)</span>
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-xs text-neutral-900">
                          €{exp.pricePerPerson} / persona
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-serif-luxury font-bold text-neutral-900">{exp.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{exp.description}</p>
                    
                    <div className="text-[11px] text-neutral-500 pt-1 flex items-center gap-4">
                      <span>Ritrovo: {exp.meetingPoint}</span>
                      {exp.dressCode && <span>Dress code: {exp.dressCode}</span>}
                    </div>
                  </div>

                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setActiveTab('transfers')}
              className="text-xs text-neutral-600 hover:text-neutral-900"
            >
              ← Torna ai Transfer
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Vai ai Servizi Trucco & Parrucco →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE 4: SERVIZI BEAUTY & STYLING (TRUCCO, PARRUCCHIERE, BABYSITTING)  */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900">
              Servizi di Bellezza, Styling & Assistenza
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Desideri un make-up artist direttamente in camera, un parrucchiere specializzato o una babysitter durante il matrimonio? Puoi richiederli qui.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weddingData.extraServices.map((srv) => {
              const isSelected = selectedServiceIds.includes(srv.id);
              return (
                <div
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected ? 'border-neutral-900 bg-neutral-50/60 shadow-xs' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded">
                        €{srv.price} · {srv.duration}
                      </span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-neutral-900 pt-1">{srv.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{srv.description}</p>
                    <p className="text-[11px] text-neutral-400">Operatore: {srv.providerName}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
            <button
              onClick={() => setActiveTab('experiences')}
              className="text-xs text-neutral-600 hover:text-neutral-900"
            >
              ← Torna alle Esperienze
            </button>
            <button
              onClick={() => setActiveTab('wishes')}
              className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Hai un Desiderio Speciale? →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE 5: DESIDERI & RICHIESTE SU MISURA DELL'OSPITE TURISTA            */}
      {/* ========================================================================= */}
      {activeTab === 'wishes' && (
        <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Bespoke Puglia Experience
            </span>
            <h2 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-1">
              Esprimi un Desiderio per la Tua Vacanza in Puglia
            </h2>
            <p className="text-xs text-neutral-600 mt-1">
              Vuoi noleggiare una Vespa vintage, prenotare un giro a cavallo in spiaggia, una cena privata in un trullo o un tour in elicottero? Scrivi la tua idea: Valeria e il team di AD Marketing la trasformeranno in una proposta su misura per te!
            </p>
          </div>

          {wishSuccessMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                La tua richiesta è stata inviata a Valeria! La analizzeremo subito e ti invieremo una proposta personalizzata con tutti i dettagli.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmitWish} className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Titolo dell'Attività Desiderata
              </label>
              <input
                type="text"
                required
                value={wishTitle}
                onChange={(e) => setWishTitle(e.target.value)}
                placeholder="Es. Noleggio Vespa vintage per tour tra i trulli di Alberobello"
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Descrivici nei dettagli cosa ti piacerebbe fare
              </label>
              <textarea
                rows={3}
                required
                value={wishDescription}
                onChange={(e) => setWishDescription(e.target.value)}
                placeholder="Es. Vorremmo esplorare la Valle d'Itria in autonomia il 14 Settembre. Saremo in due e vorremmo la consegna direttamente in masseria con caschi inclusi..."
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Data Preferita</label>
                <input
                  type="date"
                  value={wishDate}
                  onChange={(e) => setWishDate(e.target.value)}
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Partecipanti</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={wishParticipants}
                  onChange={(e) => setWishParticipants(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Budget Indicativo</label>
                <input
                  type="text"
                  value={wishBudget}
                  onChange={(e) => setWishBudget(e.target.value)}
                  placeholder="Es. €100 - €200"
                  className="w-full p-2 bg-white border border-neutral-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Invia Desiderio al Concierge</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE 6: ASSISTENZA & CHAT INTERNA CON VALERIA                         */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="border border-neutral-200 rounded-2xl bg-white shadow-xs overflow-hidden flex flex-col h-[560px]">
          {/* Header Chat */}
          <div className="p-4 bg-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center font-bold text-sm">
                V
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <span>Valeria · Assistente Dedicata</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-emerald-200">
                  Concierge per il matrimonio di {weddingData.coupleNames} · AD Marketing
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] text-emerald-200">
              Notifica diretta allo staff attiva
            </div>
          </div>

          {/* Area Messaggi */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/60">
            {guestChatHistory.length === 0 ? (
              <div className="p-4 rounded-xl bg-white border border-neutral-200 max-w-md text-xs text-neutral-700 space-y-1">
                <div className="font-bold text-emerald-900">Valeria:</div>
                <p>
                  "Ciao {guestInfo.name}! Sono Valeria, la tua assistente personale per il matrimonio di {weddingData.coupleNames} a {weddingData.venue}. Scrivimi pure per qualsiasi dubbio su alloggi, orari delle navette, transfer o consigli sulle bellezze della Puglia. Riceverò subito la tua notifica!"
                </p>
              </div>
            ) : (
              guestChatHistory.map((m) => {
                const isGuest = m.sender === 'guest';
                return (
                  <div
                    key={m.id}
                    className={`flex ${isGuest ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm rounded-2xl p-3.5 text-xs shadow-2xs space-y-1 ${
                        isGuest
                          ? 'bg-neutral-900 text-white rounded-br-none'
                          : 'bg-white border border-neutral-200 text-neutral-900 rounded-bl-none'
                      }`}
                    >
                      <div className={`text-[10px] font-semibold ${isGuest ? 'text-neutral-400' : 'text-emerald-700'}`}>
                        {isGuest ? 'Tu' : 'Valeria (Concierge)'}
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      <div className={`text-[9px] text-right ${isGuest ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Form Invio Messaggio */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              placeholder={`Scrivi un messaggio a Valeria...`}
              className="flex-1 text-xs p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Invia</span>
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEZIONE 7: RIEPILOGO, SCHEDA SCELTE CONFERMATE & GESTIONE RESTRIZIONI    */}
      {/* ========================================================================= */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {/* Se l'ospite ha già una scheda confermata, mostra la Scheda Opzioni Scelte con restrizioni admin */}
          {confirmedBookingCard && (
            <div className="border-2 border-emerald-600 rounded-2xl p-6 sm:p-8 bg-white shadow-md space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Scheda Opzioni Scelte & Confermate</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      ID: {confirmedBookingCard.id} · Confermato il {confirmedBookingCard.confirmedAt}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-1.5">
                    Riepilogo Scelte Ufficiale per {guestInfo.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    confirmedBookingCard.status === 'CONFERMATO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    confirmedBookingCard.status === 'MODIFICATO' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-neutral-100 text-neutral-700'
                  }`}>
                    Stato: {confirmedBookingCard.status}
                  </span>
                </div>
              </div>

              {/* Elenco Servizi Scelti con Restrizioni Imposte dall'Amministratore */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Voci Prenotate & Condizioni di Modifica/Cancellazione:
                </h3>

                {confirmedBookingCard.items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-200">
                    Tutte le scelte precedenti sono state annullate o rimosse. Puoi selezionare nuovi servizi dalle schede dedicate.
                  </div>
                ) : (
                  confirmedBookingCard.items.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-600 mr-2">
                            {item.category}
                          </span>
                          <strong className="text-sm text-neutral-900">{item.title}</strong>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-neutral-900">
                            {item.freeByCouple ? 'Gratuito (Regalo Sposi)' : `€${item.cost}`}
                          </span>
                        </div>
                      </div>

                      <p className="text-neutral-600 text-[11px]">{item.details}</p>

                      {/* Box Restrizioni Imposte dall'Amministratore */}
                      <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-semibold">{item.cancellationPolicy}</span>
                        </div>
                      </div>

                      {/* Azioni per Voce (Cambia, Annulla, Regole) */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200/60">
                        <span className="text-[10px] text-neutral-400">
                          Termine ultimo policy: {item.deadlineDate}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.category === 'HOTEL') setActiveTab('hotels');
                              else if (item.category === 'TRANSFER') setActiveTab('transfers');
                              else if (item.category === 'EXPERIENCE') setActiveTab('experiences');
                              else setActiveTab('services');
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium text-neutral-700 hover:text-black bg-white rounded border border-neutral-300 hover:bg-neutral-50 cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Cambia</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCancelConfirmedItem(item.category, item.title)}
                            className="px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:text-rose-900 bg-rose-50 rounded border border-rose-200 hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Annulla Servizio</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Azioni Globali Scheda (Aggiungi Servizi, Riconferma, Stampa) */}
              <div className="p-4 rounded-xl bg-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Totale Saldo Servizi Selezionati:</span>
                  <span className="text-lg font-mono font-bold text-neutral-900">
                    €{calculateTotalDue()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('experiences')}
                    className="px-3 py-2 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 rounded-xl border border-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Aggiungi Altri Servizi / Esperienze</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmAndSendChoices}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aggiorna & Re-Invia Scheda Opzioni</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scheda Riepilogo Standard con Pulsante "Conferma e Invia" */}
          <div className="border border-neutral-200 rounded-2xl p-6 sm:p-8 bg-white shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Riepilogo Scelte & Voucher di Soggiorno</span>
                </div>
                <h2 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-1">
                  Itinerario per {guestInfo.name}
                </h2>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Codice Voucher</div>
                <div className="text-sm font-mono font-bold text-neutral-900">
                  {weddingData.weddingCode}-{guestInfo.name.substring(0, 3).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Dettagli Selezionati */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* 1. Alloggio */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Alloggio</span>
                </span>
                <div className="text-sm font-bold text-neutral-900">
                  {wantsHotel && currentHotel ? currentHotel.name : 'Nessun hotel convenzionato'}
                </div>
                {wantsHotel && currentHotel ? (
                  <>
                    <div className="text-neutral-600">{selectedRoomTypeName}</div>
                    <div className="text-neutral-500 text-[11px] pt-1">
                      Check-in: {checkIn} · Check-out: {checkOut}
                    </div>
                  </>
                ) : (
                  <div className="text-neutral-500 italic">Hai scelto di alloggiare in autonomia.</div>
                )}
              </div>

              {/* 2. Trasferimento */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Trasferimento</span>
                </span>
                <div className="text-sm font-bold text-neutral-900">
                  {wantsTransfer && currentTransfer ? currentTransfer.title : 'Nessun transfer richiesto'}
                </div>
                {wantsTransfer && currentTransfer ? (
                  <>
                    <div className="text-neutral-600 font-mono">Volo: {flightNumber}</div>
                    <div className="text-neutral-500 text-[11px] pt-1">
                      Arrivo: {flightArrivalDate} · {luggageCount} Valigie
                    </div>
                  </>
                ) : (
                  <div className="text-neutral-500 italic">Ti sposterai in autonomia.</div>
                )}
              </div>

              {/* 3. Esperienze & Servizi */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Attività & Servizi ({selectedExperienceIds.length + selectedServiceIds.length})</span>
                </span>
                <div className="space-y-0.5 text-neutral-700 pt-1">
                  {selectedExperienceIds.map(id => {
                    const exp = weddingData.experiences.find(e => e.id === id);
                    return exp ? (
                      <div key={id} className="flex justify-between items-center text-[11px]">
                        <span>• {exp.title}</span>
                        <span className="font-bold text-neutral-900">
                          {exp.isHostSponsored ? 'Gratuito (Sposi)' : `€${exp.pricePerPerson}`}
                        </span>
                      </div>
                    ) : null;
                  })}

                  {selectedServiceIds.map(id => {
                    const srv = weddingData.extraServices.find(s => s.id === id);
                    return srv ? (
                      <div key={id} className="flex justify-between items-center text-[11px]">
                        <span>• {srv.title}</span>
                        <span className="font-bold text-neutral-900">€{srv.price}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Riepilogo Costi per i Servizi a Pagamento */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block">Totale Servizi Selezionati a Pagamento:</span>
                <span className="text-lg font-mono font-bold text-neutral-900">
                  €{calculateTotalDue()}
                </span>
                <span className="text-[11px] text-neutral-500 ml-2">
                  (Le esperienze offerte dagli sposi sono completamente gratuite)
                </span>
              </div>

              <div className="text-right text-[11px] text-neutral-500">
                Riceverai le istruzioni di pagamento via email dall'amministrazione AD Marketing.
              </div>
            </div>

            {/* Risultato Test Invio Email */}
            {emailSentStatus && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <MailCheck className="w-4 h-4 text-emerald-700" />
                  <span>Test Invio Email Riuscito alle ore {emailSentStatus.timestamp}</span>
                </div>
                <p>{emailSentStatus.message}</p>
                <div className="text-[11px] text-emerald-800 font-mono">
                  Destinatario Ospite: {guestInfo.email} | Copia Amministrazione: {adminNotificationEmail}
                </div>
              </div>
            )}

            {/* Azioni: Pulsante "Conferma e Invia" + Stampa & Modifica */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => setActiveTab('hotels')}
                className="text-xs text-neutral-600 hover:text-neutral-900 font-medium"
              >
                ← Torna alle sezioni per modificare
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintVoucher}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Stampa Riepilogo</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndSendChoices}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Conferma e Invia Scelte</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finestra di Riepilogo Sempre Attiva in Basso (Carrello della spesa in tempo reale) */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-neutral-300 p-3 sm:p-4 shadow-2xl z-50 flex items-center justify-between md:px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-500">
              Riepilogo Scelte in Tempo Reale:
            </div>
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>Totale a Saldo:</span>
              <span className="font-mono text-emerald-800 text-base">€{calculateTotalDue()}</span>
              <span className="text-[11px] font-normal text-neutral-500 hidden sm:inline">
                ({selectedExperienceIds.length + selectedServiceIds.length + (wantsHotel ? 1 : 0) + (wantsTransfer ? 1 : 0)} voci selezionate)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== 'itinerary' && (
            <button
              onClick={() => setActiveTab('itinerary')}
              className="px-4 py-2 text-xs font-semibold text-neutral-800 hover:text-black bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              Vedi Riepilogo
            </button>
          )}

          <button 
            onClick={handleConfirmAndSendChoices} 
            className="px-4 sm:px-6 py-2 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Conferma e Invia</span>
          </button>
        </div>
      </div>
    </div>
  );
}
