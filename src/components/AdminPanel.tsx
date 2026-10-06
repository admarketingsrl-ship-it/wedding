import { useState } from 'react';
import { 
  Building2, 
  Car, 
  Sparkles, 
  Users, 
  Plus, 
  Share2, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  Plane, 
  MessageCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { WeddingData, HotelItem, TransferItem, ExperienceItem } from '../data/weddingStore';

interface AdminPanelProps {
  weddings: WeddingData[];
  onUpdateWeddings: (updated: WeddingData[]) => void;
  onLogout: () => void;
  onPreviewAsGuest: (weddingCode: string) => void;
}

export default function AdminPanel({ weddings, onUpdateWeddings, onLogout, onPreviewAsGuest }: AdminPanelProps) {
  const [selectedWeddingId, setSelectedWeddingId] = useState<string>(weddings[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'hotels' | 'transfers' | 'experiences' | 'new-wedding'>('whatsapp');
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Stato Generatore WhatsApp
  const [recipientName, setRecipientName] = useState('Eleanor & Jonathan');
  const [inviteLanguage, setInviteLanguage] = useState<'it' | 'en'>('en');

  // Modale / Form Nuovo Hotel
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelStars, setNewHotelStars] = useState(5);
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelDistance, setNewHotelDistance] = useState('');
  const [newHotelRate, setNewHotelRate] = useState(380);
  const [newHotelRoomsBlocked, setNewHotelRoomsBlocked] = useState(20);
  const [newHotelRoomTypeName, setNewHotelRoomTypeName] = useState('Camera Matrimoniale Deluxe');
  const [newHotelGroupCode, setNewHotelGroupCode] = useState('WED-SPECIAL-26');
  const [newHotelDeadline, setNewHotelDeadline] = useState('2026-05-10');

  // Modale / Form Nuovo Transfer
  const [showAddTransfer, setShowAddTransfer] = useState(false);
  const [newTransferTitle, setNewTransferTitle] = useState('');
  const [newTransferType, setNewTransferType] = useState<'AIRPORT_SHUTTLE' | 'PRIVATE_NCC' | 'VENUE_SHUTTLE'>('AIRPORT_SHUTTLE');
  const [newTransferOrigin, setNewTransferOrigin] = useState('');
  const [newTransferDestination, setNewTransferDestination] = useState('');
  const [newTransferSchedule, setNewTransferSchedule] = useState('');
  const [newTransferVehicle, setNewTransferVehicle] = useState('Mercedes Sprinter VIP (16 pax)');
  const [newTransferPrice, setNewTransferPrice] = useState(45);
  const [newTransferCapacity, setNewTransferCapacity] = useState(16);
  const [newTransferIsPaidByCouple, setNewTransferIsPaidByCouple] = useState(false);

  // Modale / Form Nuova Esperienza
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpCategory, setNewExpCategory] = useState<'BOAT_TOUR' | 'WELCOME_PARTY' | 'COOKING_CLASS' | 'WINE_TASTING'>('BOAT_TOUR');
  const [newExpDate, setNewExpDate] = useState('2026-06-19');
  const [newExpTime, setNewExpTime] = useState('17:30 - 20:00');
  const [newExpLocation, setNewExpLocation] = useState('');
  const [newExpPrice, setNewExpPrice] = useState(90);
  const [newExpMaxSpots, setNewExpMaxSpots] = useState(20);
  const [newExpDescription, setNewExpDescription] = useState('');
  const [newExpIsSponsored, setNewExpIsSponsored] = useState(false);

  // Form Nuovo Matrimonio
  const [newWedCode, setNewWedCode] = useState('');
  const [newWedCouples, setNewWedCouples] = useState('');
  const [newWedDate, setNewWedDate] = useState('2026-09-19');
  const [newWedVenue, setNewWedVenue] = useState('');
  const [newWedCity, setNewWedCity] = useState('');

  const currentWedding = weddings.find(w => w.id === selectedWeddingId) || weddings[0];

  // =========================================================================
  // GENERATORE TESTO INVITO WHATSAPP
  // =========================================================================
  const generateWhatsAppMessage = () => {
    if (!currentWedding) return '';

    if (inviteLanguage === 'it') {
      return `✨ *INVITO AL MATRIMONIO DI ${currentWedding.coupleNames.toUpperCase()}* ✨

Gentile *${recipientName || 'Caro Invitato'}*,
Siamo felicissimi di invitarti al nostro matrimonio che si terrà il *${currentWedding.weddingDate}* presso *${currentWedding.venue}* (${currentWedding.city})!

Per agevolare il tuo soggiorno e il viaggio dall'estero, l'agenzia Wedding Concierge ha riservato per i nostri ospiti:
🏨 *Hotel Convenzionati:* Camere bloccate a tariffe speciali negoziate
🚐 *Transfer & Navette:* Collegamenti aeroporto e navetta ufficiale per la cerimonia
🥂 *Esperienze:* Attività sul territorio prima e dopo il matrimonio

Accedi al portale dedicato inserendo il tuo codice:
🔑 *CODICE MATRIMONIO:* \`${currentWedding.weddingCode}\`
🔗 *LINK PORTALE OSPITI:* https://riviera-wedding-concierge.app/?code=${currentWedding.weddingCode}

Per qualsiasi necessità, il concierge dedicato è disponibile su questo numero o via email a ${currentWedding.conciergeEmail}.
Ti aspettiamo con gioia! ❤️`;
    }

    // Default: English
    return `✨ *WEDDING INVITATION: ${currentWedding.coupleNames.toUpperCase()}* ✨

Dear *${recipientName || 'Valued Guest'}*,
We are absolutely delighted to invite you to celebrate our destination wedding on *${currentWedding.weddingDate}* at *${currentWedding.venue}* (${currentWedding.city}, Italy)!

To ensure a seamless stay, our dedicated Wedding Concierge team has organized:
🏨 *Curated Accommodations:* Pre-reserved room blocks at exclusive negotiated rates
🚐 *Airport & Venue Transfers:* Shuttles from Milan airports & wedding day transport
🥂 *Experiences:* Sunset boat cruises, welcome pizza party & local masterclasses

Please access your personalized guest portal to confirm your room and transfers:
🔑 *YOUR WEDDING CODE:* \`${currentWedding.weddingCode}\`
🔗 *GUEST PORTAL LINK:* https://riviera-wedding-concierge.app/?code=${currentWedding.weddingCode}

Should you require any custom assistance, contact our 24/7 concierge at ${currentWedding.conciergeWhatsApp} or ${currentWedding.conciergeEmail}.
We cannot wait to celebrate with you! ❤️`;
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2200);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // =========================================================================
  // GESTIONE HOTEL (Aggiunta)
  // =========================================================================
  const handleSaveHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim()) return;

    const newHotel: HotelItem = {
      id: `hotel-${Date.now()}`,
      name: newHotelName.trim(),
      stars: Number(newHotelStars),
      address: newHotelAddress.trim() || 'Italia',
      distanceToVenue: newHotelDistance.trim() || '10 min navetta per la villa',
      negotiatedRate: Number(newHotelRate),
      currency: 'EUR',
      bookingDeadline: newHotelDeadline,
      groupCode: newHotelGroupCode.trim(),
      roomTypes: [
        {
          id: `rt-${Date.now()}`,
          name: newHotelRoomTypeName.trim() || 'Camera Superior',
          pricePerNight: Number(newHotelRate),
          totalBlocked: Number(newHotelRoomsBlocked),
          availableRooms: Number(newHotelRoomsBlocked),
          maxOccupancy: 2
        }
      ]
    };

    const updatedWeddings = weddings.map(w => {
      if (w.id === currentWedding.id) {
        return {
          ...w,
          hotels: [...w.hotels, newHotel]
        };
      }
      return w;
    });

    onUpdateWeddings(updatedWeddings);
    setShowAddHotel(false);
    // Reset form
    setNewHotelName('');
  };

  // =========================================================================
  // GESTIONE TRASFERIMENTI (Aggiunta)
  // =========================================================================
  const handleSaveTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransferTitle.trim()) return;

    const newTransfer: TransferItem = {
      id: `tr-${Date.now()}`,
      type: newTransferType,
      title: newTransferTitle.trim(),
      origin: newTransferOrigin.trim() || 'Aeroporto Principale',
      destination: newTransferDestination.trim() || 'Hotel Ospiti',
      departureTime: newTransferSchedule.trim() || 'Orario concordato',
      vehicleType: newTransferVehicle.trim(),
      capacity: Number(newTransferCapacity),
      bookedSeats: 0,
      pricePerSeat: newTransferIsPaidByCouple ? 0 : Number(newTransferPrice),
      isPaidByCouple: newTransferIsPaidByCouple
    };

    const updatedWeddings = weddings.map(w => {
      if (w.id === currentWedding.id) {
        return {
          ...w,
          transfers: [...w.transfers, newTransfer]
        };
      }
      return w;
    });

    onUpdateWeddings(updatedWeddings);
    setShowAddTransfer(false);
    setNewTransferTitle('');
  };

  // =========================================================================
  // GESTIONE ESPERIENZE (Aggiunta)
  // =========================================================================
  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim()) return;

    const newExperience: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: newExpTitle.trim(),
      category: newExpCategory,
      eventDate: newExpDate,
      startTime: newExpTime,
      durationHours: 3,
      meetingPoint: newExpLocation.trim() || 'Punto di ritrovo concordato',
      pricePerPerson: newExpIsSponsored ? 0 : Number(newExpPrice),
      isHostSponsored: newExpIsSponsored,
      maxParticipants: Number(newExpMaxSpots),
      bookedParticipants: 0,
      description: newExpDescription.trim() || 'Esperienza esclusiva organizzata dal concierge.'
    };

    const updatedWeddings = weddings.map(w => {
      if (w.id === currentWedding.id) {
        return {
          ...w,
          experiences: [...w.experiences, newExperience]
        };
      }
      return w;
    });

    onUpdateWeddings(updatedWeddings);
    setShowAddExp(false);
    setNewExpTitle('');
  };

  // =========================================================================
  // CREA NUOVO MATRIMONIO
  // =========================================================================
  const handleCreateWedding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWedCode.trim() || !newWedCouples.trim()) return;

    const cleanCode = newWedCode.trim().toUpperCase().replace(/\s+/g, '-');

    const newWedding: WeddingData = {
      id: `wed-${Date.now()}`,
      weddingCode: cleanCode,
      coupleNames: newWedCouples.trim(),
      weddingDate: newWedDate,
      venue: newWedVenue.trim() || 'Villa Storica Panoramica',
      city: newWedCity.trim() || 'Destinazione Italia',
      country: 'Italia',
      bannerImage: currentWedding.bannerImage,
      welcomeMessage: `Benvenuti al nostro matrimonio a ${newWedCity}! Il team concierge è a disposizione per hotel, transfer ed esperienze.`,
      currency: 'EUR',
      conciergeEmail: 'concierge@rivieraweddings.com',
      conciergePhone: '+39 031 998877',
      conciergeWhatsApp: '+393401234567',
      hotels: [],
      transfers: [],
      experiences: [],
      guests: []
    };

    const updatedList = [...weddings, newWedding];
    onUpdateWeddings(updatedList);
    setSelectedWeddingId(newWedding.id);
    setActiveTab('whatsapp');
    setNewWedCode('');
    setNewWedCouples('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Admin Panel */}
      <div className="border border-neutral-200 bg-white p-6 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
            <span>Area Back End Riservata</span>
            <span aria-hidden="true">·</span>
            <span>Staff Agenzia Wedding Concierge</span>
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-neutral-900 mt-1">
            Gestione Proposte & Generatore Inviti
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Seleziona un matrimonio per aggiungere alloggi contrattualizzati, transfer, esperienze e creare il messaggio WhatsApp personalizzato con codice invito.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onPreviewAsGuest(currentWedding.weddingCode)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Vedi Portale come Ospite ({currentWedding.weddingCode})</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
          >
            Esci
          </button>
        </div>
      </div>

      {/* Selettore Matrimonio Attivo */}
      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider shrink-0">
            Matrimonio Attivo:
          </span>
          <select
            value={selectedWeddingId}
            onChange={(e) => setSelectedWeddingId(e.target.value)}
            className="text-xs font-semibold bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-900 focus:outline-hidden"
          >
            {weddings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.coupleNames} — {w.weddingCode} ({w.city})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setActiveTab('new-wedding')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'new-wedding'
              ? 'bg-neutral-900 text-white'
              : 'text-neutral-800 bg-white border border-neutral-300 hover:bg-neutral-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Nuovo Matrimonio</span>
        </button>
      </div>

      {/* Navigazione Tab Back End */}
      <div className="flex items-center gap-1 border-b border-neutral-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'whatsapp'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Generatore Invito WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'hotels'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hotel & Camere ({currentWedding.hotels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'transfers'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Transfer & Navette ({currentWedding.transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors shrink-0 ${
            activeTab === 'experiences'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Esperienze & Party ({currentWedding.experiences.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. GENERATORE INVITO WHATSAPP                                            */}
      {/* ========================================================================= */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonna Sinistra: Configurazione Invito */}
          <div className="lg:col-span-5 border border-neutral-200 rounded-xl bg-white p-6 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                Canale di Notifica Esterno
              </span>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900 mt-0.5">
                Genera Invito WhatsApp con Codice
              </h3>
              <p className="text-xs text-neutral-600 mt-1">
                Genera un messaggio WhatsApp formattato con i dettagli dell'evento e il codice matrimonio univoco per consentire all'ospite di accedere alla sua area riservata.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Nome Destinatario / Ospite
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Es. Eleanor & Jonathan"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Lingua del Messaggio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteLanguage('en')}
                    className={`p-2 rounded-lg font-medium border text-center transition-colors ${
                      inviteLanguage === 'en'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    Inglese (Ospiti Esteri) 🇬🇧
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteLanguage('it')}
                    className={`p-2 rounded-lg font-medium border text-center transition-colors ${
                      inviteLanguage === 'it'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200'
                    }`}
                  >
                    Italiano 🇮🇹
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Dati inclusi automaticamente:</span>
                </div>
                <div>• Sposi: {currentWedding.coupleNames}</div>
                <div>• Data & Luogo: {currentWedding.weddingDate} · {currentWedding.venue}</div>
                <div>• Codice d'accesso: <strong className="font-mono">{currentWedding.weddingCode}</strong></div>
              </div>

              <div className="flex flex-col gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  {copiedMessage ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMessage ? 'Messaggio Copiato!' : 'Copia Testo per WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Invia Direttamente con WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Colonna Destra: Mockup Telefono / Anteprima WhatsApp Balloon */}
          <div className="lg:col-span-7 border border-neutral-800 rounded-2xl bg-neutral-900 text-neutral-100 p-6 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="font-semibold text-neutral-200">Anteprima Schermo WhatsApp</span>
              </div>
              <span className="text-neutral-500 font-mono text-[11px]">Chat con {recipientName || 'Ospite'}</span>
            </div>

            {/* Baloon WhatsApp */}
            <div className="mt-4 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-100 font-sans text-xs leading-relaxed whitespace-pre-wrap shadow-inner">
              {generateWhatsAppMessage()}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-neutral-400">
              <span>L'ospite cliccherà sul link e utilizzerà il codice per accedere al portale.</span>
              <button
                onClick={handleCopyMessage}
                className="text-emerald-400 hover:underline font-medium"
              >
                Copia negli appunti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GESTIONE HOTEL & BLOCCHI CAMERE                                       */}
      {/* ========================================================================= */}
      {activeTab === 'hotels' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
                Hotel e Blocchi Camere per {currentWedding.coupleNames}
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Configura gli alloggi convenzionati con disponibilità limitate e date di scadenza.
              </p>
            </div>

            <button
              onClick={() => setShowAddHotel(!showAddHotel)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddHotel ? 'Chiudi Modulo' : 'Aggiungi Hotel Convenzionato'}</span>
            </button>
          </div>

          {/* Form Nuovo Hotel */}
          {showAddHotel && (
            <form onSubmit={handleSaveHotel} className="p-6 bg-neutral-50 rounded-xl border border-neutral-300 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-neutral-900">Nuovo Hotel Convenzionato</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Nome Struttura</label>
                  <input
                    type="text"
                    required
                    value={newHotelName}
                    onChange={(e) => setNewHotelName(e.target.value)}
                    placeholder="Es. Grand Hotel Victoria Menaggio"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Stelle</label>
                  <select
                    value={newHotelStars}
                    onChange={(e) => setNewHotelStars(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  >
                    <option value={5}>5 Stelle Lusso</option>
                    <option value={4}>4 Stelle Superior</option>
                    <option value={3}>3 Stelle Boutique</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Tariffa Negoziata (€ / notte)</label>
                  <input
                    type="number"
                    value={newHotelRate}
                    onChange={(e) => setNewHotelRate(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-neutral-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Indirizzo & Località</label>
                  <input
                    type="text"
                    value={newHotelAddress}
                    onChange={(e) => setNewHotelAddress(e.target.value)}
                    placeholder="Es. Viale Benedetto Castelli 4, Menaggio"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Distanza dalla Location di Nozze</label>
                  <input
                    type="text"
                    value={newHotelDistance}
                    onChange={(e) => setNewHotelDistance(e.target.value)}
                    placeholder="Es. 10 min navetta o battello"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Camere Bloccate</label>
                  <input
                    type="number"
                    value={newHotelRoomsBlocked}
                    onChange={(e) => setNewHotelRoomsBlocked(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-neutral-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHotel(false)}
                  className="px-3 py-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 text-white font-semibold rounded hover:bg-neutral-800"
                >
                  Salva Hotel
                </button>
              </div>
            </form>
          )}

          {/* Elenco Hotel Esistenti */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWedding.hotels.map((h) => (
              <div key={h.id} className="p-5 border border-neutral-200 rounded-xl bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {h.stars} Stelle · €{h.negotiatedRate}/notte
                  </span>
                  <span className="text-xs font-mono text-neutral-500">Codice: {h.groupCode}</span>
                </div>

                <div>
                  <h4 className="text-base font-serif-luxury font-bold text-neutral-900">{h.name}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{h.address}</p>
                  <p className="text-xs text-neutral-600 mt-1">{h.distanceToVenue}</p>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-xs flex justify-between items-center">
                  <span className="text-neutral-500">Scadenza: {h.bookingDeadline}</span>
                  <span className="font-mono font-bold text-neutral-800">
                    {h.roomTypes[0]?.availableRooms || 0} residue / {h.roomTypes[0]?.totalBlocked || 0} totali
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GESTIONE TRASFERIMENTI                                                */}
      {/* ========================================================================= */}
      {activeTab === 'transfers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
                Piani di Trasferimento per {currentWedding.coupleNames}
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Navette aeroportuali, collegamenti NCC e trasporti dedicati al giorno del matrimonio.
              </p>
            </div>

            <button
              onClick={() => setShowAddTransfer(!showAddTransfer)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddTransfer ? 'Chiudi Modulo' : 'Aggiungi Opzione Transfer'}</span>
            </button>
          </div>

          {/* Form Nuovo Transfer */}
          {showAddTransfer && (
            <form onSubmit={handleSaveTransfer} className="p-6 bg-neutral-50 rounded-xl border border-neutral-300 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-neutral-900">Nuovo Servizio di Trasferimento</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Titolo Servizio</label>
                  <input
                    type="text"
                    required
                    value={newTransferTitle}
                    onChange={(e) => setNewTransferTitle(e.target.value)}
                    placeholder="Es. Navetta Collettiva Aeroporto Bergamo (BGY)"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Tipologia</label>
                  <select
                    value={newTransferType}
                    onChange={(e) => setNewTransferType(e.target.value as any)}
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  >
                    <option value="AIRPORT_SHUTTLE">Navetta Aeroporto di Gruppo</option>
                    <option value="PRIVATE_NCC">NCC Privato con Autista</option>
                    <option value="VENUE_SHUTTLE">Navetta Cerimonia Ufficiale</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Origine / Pick-up</label>
                  <input
                    type="text"
                    value={newTransferOrigin}
                    onChange={(e) => setNewTransferOrigin(e.target.value)}
                    placeholder="Es. Bergamo Orio al Serio (BGY)"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Destinazione</label>
                  <input
                    type="text"
                    value={newTransferDestination}
                    onChange={(e) => setNewTransferDestination(e.target.value)}
                    placeholder="Es. Hotel Convenzionati Lago di Como"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Orari / Partenza</label>
                  <input
                    type="text"
                    value={newTransferSchedule}
                    onChange={(e) => setNewTransferSchedule(e.target.value)}
                    placeholder="Es. 18 Giugno - Ore 14:00 e 18:30"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Prezzo (€ a passeggero)</label>
                  <input
                    type="number"
                    value={newTransferPrice}
                    onChange={(e) => setNewTransferPrice(Number(e.target.value))}
                    disabled={newTransferIsPaidByCouple}
                    className="w-full p-2 bg-white border border-neutral-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Capienza Mezzo (posti)</label>
                  <input
                    type="number"
                    value={newTransferCapacity}
                    onChange={(e) => setNewTransferCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-neutral-300 rounded font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="paidByCouple"
                    checked={newTransferIsPaidByCouple}
                    onChange={(e) => setNewTransferIsPaidByCouple(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="paidByCouple" className="font-medium text-neutral-800">
                    Offerto dagli sposi (Gratuito per ospite)
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTransfer(false)}
                  className="px-3 py-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 text-white font-semibold rounded hover:bg-neutral-800"
                >
                  Salva Transfer
                </button>
              </div>
            </form>
          )}

          {/* Elenco Trasferimenti Esistenti */}
          <div className="space-y-3">
            {currentWedding.transfers.map((t) => (
              <div key={t.id} className="p-4 border border-neutral-200 rounded-xl bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                      {t.type}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">{t.departureTime}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900">{t.title}</h4>
                  <div className="text-xs text-neutral-500">
                    Da: {t.origin} → A: {t.destination} ({t.vehicleType})
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold font-mono text-neutral-900">
                    {t.isPaidByCouple ? 'Incluso (Offerto dagli sposi)' : `€${t.pricePerSeat} / passeggero`}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Capienza: {t.capacity} pax
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GESTIONE ESPERIENZE                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'experiences' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-neutral-900">
                Esperienze & Programma Pre/Post Matrimonio
              </h3>
              <p className="text-xs text-neutral-600 mt-0.5">
                Tour in barca, degustazioni, aperitivi e lezioni di cucina sul territorio per intrattenere gli ospiti stranieri.
              </p>
            </div>

            <button
              onClick={() => setShowAddExp(!showAddExp)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddExp ? 'Chiudi Modulo' : 'Aggiungi Nuova Esperienza'}</span>
            </button>
          </div>

          {/* Form Nuova Esperienza */}
          {showAddExp && (
            <form onSubmit={handleSaveExperience} className="p-6 bg-neutral-50 rounded-xl border border-neutral-300 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-neutral-900">Nuova Esperienza Turistica</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-neutral-700 mb-1">Titolo Esperienza</label>
                  <input
                    type="text"
                    required
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    placeholder="Es. Tour Degustazione Vini Chianti & Cantine Storiche"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Categoria</label>
                  <select
                    value={newExpCategory}
                    onChange={(e) => setNewExpCategory(e.target.value as any)}
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  >
                    <option value="BOAT_TOUR">Tour in Barca / Motoscafo</option>
                    <option value="WELCOME_PARTY">Welcome Party / Pizza Night</option>
                    <option value="COOKING_CLASS">Masterclass di Cucina</option>
                    <option value="WINE_TASTING">Degustazione Vini / Cantina</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Data Evento</label>
                  <input
                    type="date"
                    value={newExpDate}
                    onChange={(e) => setNewExpDate(e.target.value)}
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Orario</label>
                  <input
                    type="text"
                    value={newExpTime}
                    onChange={(e) => setNewExpTime(e.target.value)}
                    placeholder="17:00 - 20:00"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Prezzo (€ a persona)</label>
                  <input
                    type="number"
                    value={newExpPrice}
                    onChange={(e) => setNewExpPrice(Number(e.target.value))}
                    disabled={newExpIsSponsored}
                    className="w-full p-2 bg-white border border-neutral-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Posti Massimi</label>
                  <input
                    type="number"
                    value={newExpMaxSpots}
                    onChange={(e) => setNewExpMaxSpots(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-neutral-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Punto di Ritrovo</label>
                  <input
                    type="text"
                    value={newExpLocation}
                    onChange={(e) => setNewExpLocation(e.target.value)}
                    placeholder="Es. Pontile Principale Tremezzo"
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="sponsoredByCouple"
                    checked={newExpIsSponsored}
                    onChange={(e) => setNewExpIsSponsored(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="sponsoredByCouple" className="font-medium text-neutral-800">
                    Offerta dagli Sposi (Gratuita per gli invitati)
                  </label>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-medium text-neutral-700 mb-1">Descrizione dell'Attività</label>
                  <textarea
                    rows={2}
                    value={newExpDescription}
                    onChange={(e) => setNewExpDescription(e.target.value)}
                    placeholder="Dettagli per l'ospite, abbigliamento consigliato, cibi serviti..."
                    className="w-full p-2 bg-white border border-neutral-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExp(false)}
                  className="px-3 py-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 text-white font-semibold rounded hover:bg-neutral-800"
                >
                  Salva Esperienza
                </button>
              </div>
            </form>
          )}

          {/* Elenco Esperienze Esistenti */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWedding.experiences.map((exp) => (
              <div key={exp.id} className="p-5 border border-neutral-200 rounded-xl bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {exp.eventDate} · {exp.startTime}
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-900">
                    {exp.isHostSponsored ? 'Gratuito (Sposi)' : `€${exp.pricePerPerson} / persona`}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-serif-luxury font-bold text-neutral-900">{exp.title}</h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{exp.description}</p>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-xs flex justify-between items-center text-neutral-500">
                  <span>Ritrovo: {exp.meetingPoint}</span>
                  <span className="font-mono font-bold text-neutral-800">
                    {exp.bookedParticipants} / {exp.maxParticipants} iscritti
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CREAZIONE NUOVO MATRIMONIO                                            */}
      {/* ========================================================================= */}
      {activeTab === 'new-wedding' && (
        <div className="max-w-2xl mx-auto border border-neutral-200 rounded-2xl bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Configurazione Nuovo Evento
            </span>
            <h3 className="text-xl font-serif-luxury font-bold text-neutral-900 mt-0.5">
              Crea un Nuovo Destination Wedding
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Imposta il codice invito univoco che gli ospiti useranno per accedere alla propria area personalizzata.
            </p>
          </div>

          <form onSubmit={handleCreateWedding} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Nomi della Coppia di Sposi
              </label>
              <input
                type="text"
                required
                value={newWedCouples}
                onChange={(e) => setNewWedCouples(e.target.value)}
                placeholder="Es. Charlotte De Clare & Oliver Vance"
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-900 mb-1">
                Codice Matrimonio (per il login ospite)
              </label>
              <input
                type="text"
                required
                value={newWedCode}
                onChange={(e) => setNewWedCode(e.target.value.toUpperCase())}
                placeholder="Es. CHARLOTTE-OLIVER-2026"
                className="w-full p-3 font-mono font-bold uppercase text-sm bg-amber-50/50 border-2 border-amber-300 rounded-lg text-neutral-900"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Questo codice sarà incorporato automaticamente nei messaggi WhatsApp di invito.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Data Evento</label>
                <input
                  type="date"
                  value={newWedDate}
                  onChange={(e) => setNewWedDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Location / Villa</label>
                <input
                  type="text"
                  value={newWedVenue}
                  onChange={(e) => setNewWedVenue(e.target.value)}
                  placeholder="Es. Villa San Michele"
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Città / Regione</label>
                <input
                  type="text"
                  value={newWedCity}
                  onChange={(e) => setNewWedCity(e.target.value)}
                  placeholder="Es. Fiesole, Firenze"
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                Annulla
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                Crea Matrimonio & Genera Invito
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
