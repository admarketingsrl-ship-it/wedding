import heroBanner from '../assets/images/wedding_concierge_hero_1791309110090.jpg';
import hotelSuiteImg from '../assets/images/wedding_hotel_suite_1791309120679.jpg';
import boatTourImg from '../assets/images/wedding_boat_experience_1791309131765.jpg';

export interface RoomTypeItem {
  id: string;
  name: string;
  pricePerNight: number;
  totalBlocked: number;
  availableRooms: number;
  maxOccupancy: number;
}

export interface HotelItem {
  id: string;
  name: string;
  stars: number;
  address: string;
  distanceToVenue: string;
  negotiatedRate: number;
  currency: string;
  roomTypes: RoomTypeItem[];
  bookingDeadline: string;
  groupCode: string;
  supplierId?: string;
  image?: string;
  negotiatedPerk?: string; // Dettaglio speciale "Negoziato per voi" dall'agenzia
  websiteUrl?: string; // Nuova: Collegamento al booking engine della struttura
}

export interface TransferItem {
  id: string;
  type: 'AIRPORT_SHUTTLE' | 'PRIVATE_NCC' | 'VENUE_SHUTTLE';
  title: string;
  origin: string;
  destination: string;
  departureTime: string;
  vehicleType: string;
  capacity: number;
  bookedSeats: number;
  pricePerSeat: number;
  isPaidByCouple: boolean;
  supplierId?: string;
  negotiatedPerk?: string; // Dettaglio speciale "Negoziato per voi" dall'agenzia
}

export interface ExperienceItem {
  id: string;
  title: string;
  category: 'BOAT_TOUR' | 'WELCOME_PARTY' | 'COOKING_CLASS' | 'WINE_TASTING' | 'PIZZICA_NIGHT' | 'OIL_TOUR';
  eventDate: string;
  startTime: string;
  durationHours: number;
  meetingPoint: string;
  pricePerPerson: number;
  isHostSponsored: boolean; // Se true: offerto con affetto dagli sposi, gratuito per gli ospiti!
  maxParticipants: number;
  bookedParticipants: number;
  dressCode?: string;
  description: string;
  supplierId?: string;
  image?: string;
  negotiatedPerk?: string; // Dettaglio speciale "Negoziato per voi" dall'agenzia
}

// Servizi aggiuntivi: Trucco, Parrucchiere, Babysitting, Stireria abiti da cerimonia
export interface ExtraServiceItem {
  id: string;
  title: string;
  category: 'HAIR_STYLING' | 'MAKEUP' | 'BABYSITTING' | 'STEAMING_TAILORING' | 'VINTAGE_CAR';
  price: number;
  isPaidByCouple: boolean; // Alcuni possono essere offerti dagli sposi, altri su richiesta
  duration: string;
  description: string;
  providerName: string;
  negotiatedPerk?: string; // Dettaglio speciale "Negoziato per voi" dall'agenzia
}

export interface GuestItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  flag: string;
  hotelBooked: string; // Se 'NONE' o '' -> non ha prenotato hotel
  roomType: string;
  transferBooked: string; // Se 'NONE' o '' -> autonomo
  flight: string;
  experiences: string[];
  extraServices: string[];
  diet: string;
  status: 'CONFIRMED' | 'PENDING' | 'WAITLIST';
  totalAmountDue: number; // Totale da pagare per i servizi non offerti dagli sposi
  paymentStatus: 'PAID' | 'PENDING' | 'FREE';
  registeredAt: string;
}

// Richieste su misura / desideri dell'ospite da impacchettare in proposta
export interface TouristWishRequest {
  id: string;
  weddingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  title: string;
  description: string;
  preferredDate?: string;
  participantsCount: number;
  budgetRange?: string;
  status: 'RECEIVED' | 'PROPOSAL_READY' | 'CONFIRMED' | 'ARCHIVED';
  agencyNotes?: string;
  proposedCost?: number;
  createdAt: string;
}

// Chat interna con Valeria
export interface ChatMessage {
  id: string;
  weddingCode: string;
  guestName: string;
  guestEmail: string;
  sender: 'guest' | 'valeria';
  text: string;
  timestamp: string;
  readByAdmin: boolean;
}

// Database Master Fornitori & Hotel
export interface MasterSupplier {
  id: string;
  name: string;
  category: 'HOTEL' | 'TRANSFER' | 'EXPERIENCE' | 'BEAUTY_HAIR' | 'OTHER';
  stars?: number;
  city: string;
  contactPerson: string;
  email: string;
  phone: string;
  standardRate: number;
  commissionPercent: number; // % commissione agenzia
  notes: string;
  accessPassword?: string; // Password di accesso assegnata dall'agenzia
  welcomeEmailSent?: boolean; // Stato invio email con credenziali e link
  emailSentAt?: string; // Data e ora invio email con credenziali
}

// Richieste degli sposi per regalare servizi agli ospiti
export interface CoupleGiftRequest {
  id: string;
  weddingCode: string;
  coupleNames: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: 'EXPERIENCE' | 'TRANSFER' | 'EXTRA_SERVICE' | 'HOTEL';
  guestsCount: number;
  unitPrice: number;
  totalEstimatedAmount: number;
  currency: string;
  coupleNotes?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedAt?: string;
  agencyNotes?: string;
}

// Pacchetti creati dai fornitori per l'agenzia matrimoni
export interface SupplierPackage {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  title: string;
  category: 'HOTEL' | 'TRANSFER' | 'EXPERIENCE' | 'BEAUTY_HAIR' | 'CATERING' | 'OTHER';
  description: string;
  pricePerUnit: number;
  currency: string;
  commissionPercent: number; // % riservata ad agenzia AD Marketing
  capacityOrAvailability: string;
  includedFeatures: string[];
  image?: string;
  notesForAgency?: string;
  negotiatedPerk?: string; // Dettaglio speciale "Negoziato per voi" dall'agenzia
  createdAt: string;
}

// Ordini di prenotazione ricevuti dai fornitori sulla propria email
export interface SupplierBookingOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  weddingCode: string;
  coupleNames: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceTitle: string;
  serviceCategory: string;
  dateRequested: string;
  participantsOrQuantity: number;
  totalAmount: number;
  currency: string;
  guestNotes?: string;
  status: 'RECEIVED' | 'CONFIRMED' | 'REJECTED';
  paymentMethodChosen?: 'DIRECT_AT_CHECKIN' | 'SUPPLIER_BANK_TRANSFER' | 'SUPPLIER_PAYMENT_LINK' | 'AGENCY_CENTRAL_BILLING';
  paymentNotes?: string;
  emailSentToSupplierAt: string;
  supplierResponseDate?: string;
}

// Richieste di pagamento generate dall'amministrazione
export interface PaymentRequest {
  id: string;
  weddingCode: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  currency: string;
  items: { description: string; amount: number }[];
  status: 'SENT' | 'PAID' | 'CANCELLED';
  sentAt: string;
  paidAt?: string;
  paymentMethod: 'STRIPE_LINK' | 'BANK_TRANSFER_IBAN';
  invoiceCode: string;
}

export interface AdminSettings {
  adminNotificationEmail: string;
  agencyName: string;
  agencyLegalName: string;
  agencyAddress: string;
  agencyCity: string;
  agencyVat: string;
  agencyPhone: string;
  valeriaPhone: string;
  defaultIban: string;
  defaultBic: string;
  stripePaymentLink: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  description?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface SecondaryInfoSection {
  id: string;
  title: string;
  category: 'logistics' | 'weather' | 'gift' | 'food' | 'tourism' | 'other';
  content: string;
  iconName?: string;
}

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  message: string;
  date: string;
  urgent?: boolean;
}

export interface WeddingData {
  id: string;
  weddingCode: string;
  coupleNames: string;
  weddingDate: string;
  venue: string;
  city: string;
  country: string;
  bannerImage: string;
  welcomeMessage: string;
  currency: string;
  conciergeEmail: string;
  conciergePhone: string;
  conciergeWhatsApp: string;
  couplePassword?: string;
  dressCode?: string;
  story?: string;
  schedule?: ScheduleEvent[];
  galleryPhotos?: GalleryPhoto[];
  secondaryInfo?: SecondaryInfoSection[];
  broadcastAnnouncements?: BroadcastAnnouncement[];
  hotels: HotelItem[];
  transfers: TransferItem[];
  experiences: ExperienceItem[];
  extraServices: ExtraServiceItem[];
  guests: GuestItem[];
  giftRequests?: CoupleGiftRequest[];
}

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  adminNotificationEmail: 'info@admarketing.it',
  agencyName: 'Apulian Wedding Concierge',
  agencyLegalName: 'AD Marketing S.r.l.s.',
  agencyAddress: 'Via Roma, 45',
  agencyCity: 'Palagianello (TA) - Puglia, Italia',
  agencyVat: 'IT03124590731',
  agencyPhone: '+39 099 8887766',
  valeriaPhone: '+39 340 1234567',
  defaultIban: 'IT98 X 03002 03280 000000123456',
  defaultBic: 'UNCRITM1B45',
  stripePaymentLink: 'https://buy.stripe.com/demo_apulian_wedding_concierge'
};

// Database Master Fornitori Registrati
export const INITIAL_SUPPLIERS: MasterSupplier[] = [
  {
    id: 'sup-borgo',
    name: 'Borgo Egnazia Resort & Spa',
    category: 'HOTEL',
    stars: 5,
    city: 'Savelletri di Fasano (BR)',
    contactPerson: 'Dott.ssa Marisa Greco',
    email: 'booking@borgoegnazia.it',
    phone: '+39 080 225500',
    standardRate: 520,
    commissionPercent: 12,
    notes: 'Partner gold per matrimoni esteri di lusso. Camere e ville private.',
    accessPassword: 'fornitore2026',
    welcomeEmailSent: true,
    emailSentAt: '2026-08-10 11:30'
  },
  {
    id: 'sup-masseria-torre',
    name: 'Masseria Torre Coccaro',
    category: 'HOTEL',
    stars: 5,
    city: 'Fasano (BR)',
    contactPerson: 'Vincenzo Muolo',
    email: 'events@torrecoccaro.com',
    phone: '+39 080 4829310',
    standardRate: 460,
    commissionPercent: 15,
    notes: 'Masseria cinquecentesca tra gli ulivi, spiaggia privata Coccaro Beach Club.',
    accessPassword: 'fornitore2026',
    welcomeEmailSent: true,
    emailSentAt: '2026-08-12 14:15'
  },
  {
    id: 'sup-masseria-san-domenico',
    name: 'Masseria San Domenico',
    category: 'HOTEL',
    stars: 5,
    city: 'Savelletri (BR)',
    contactPerson: 'Silvia Melpignano',
    email: 'concierge@masseriasandomenico.com',
    phone: '+39 080 4827777',
    standardRate: 490,
    commissionPercent: 12,
    notes: 'Dimora storica fortificata del XIV secolo, talassoterapia e campo golf 18 buche.',
    accessPassword: 'fornitore2026',
    welcomeEmailSent: true,
    emailSentAt: '2026-08-15 09:45'
  },
  {
    id: 'sup-ncc-puglia',
    name: 'Apulia VIP Transfer & NCC',
    category: 'TRANSFER',
    city: 'Bari / Brindisi',
    contactPerson: 'Pasquale Lisi',
    email: 'info@apuliaviptransfer.it',
    phone: '+39 338 9090123',
    standardRate: 45,
    commissionPercent: 20,
    notes: 'Flotta di 8 Mercedes Sprinter VIP e 12 Classe V Luxury. Conducenti in abito con inglese fluente.',
    accessPassword: 'fornitore2026',
    welcomeEmailSent: true,
    emailSentAt: '2026-08-18 16:00'
  },
  {
    id: 'sup-boat-polignano',
    name: 'Polignano Sea Charters & Riva Yachts',
    category: 'EXPERIENCE',
    city: 'Polignano a Mare (BA)',
    contactPerson: 'Cap. Donato Zaccaria',
    email: 'donato@seacharters.it',
    phone: '+39 347 5544332',
    standardRate: 110,
    commissionPercent: 25,
    notes: 'Barche d\'epoca in mogano e gozzi tipici per tour grotte di Polignano e calici al tramonto.',
    accessPassword: 'fornitore2026',
    welcomeEmailSent: true,
    emailSentAt: '2026-08-20 10:20'
  },
  {
    id: 'sup-beauty-glam',
    name: 'Apulian Bridal & Guest Glam Team',
    category: 'BEAUTY_HAIR',
    city: 'Monopoli & Valle d\'Itria',
    contactPerson: 'Chiara Valente Hair & Makeup',
    email: 'chiara@apulianglam.it',
    phone: '+39 349 7788990',
    standardRate: 120,
    commissionPercent: 18,
    notes: 'Staff di 6 truccatrici e acconciatori disponibili a domicilio in masseria.',
    accessPassword: 'fornitore2026',
    welcomeEmailSent: true,
    emailSentAt: '2026-08-22 17:40'
  }
];

export const INITIAL_WEDDINGS: WeddingData[] = [
  {
    id: 'wed-puglia-2026',
    weddingCode: 'SOPHIA-LIAM-2026',
    coupleNames: 'Sophia Rossi & Liam O\'Connor',
    weddingDate: '2026-09-12',
    venue: 'Borgo Egnazia, Savelletri di Fasano',
    city: 'Valle d\'Itria, Puglia',
    country: 'Italia',
    bannerImage: hotelSuiteImg,
    welcomeMessage: 'Cari amici e parenti, siamo felicissimi di accogliervi in Puglia! Per aiutarvi a vivere al meglio il vostro viaggio, abbiamo messo a vostra disposizione la piattaforma Apulian Wedding Concierge curata dal team di Valeria. Potrete prenotare i nostri hotel convenzionati, i transfer dagli aeroporti di Bari e Brindisi, i servizi di bellezza e godervi le esperienze che abbiamo organizzato per voi!',
    currency: 'EUR',
    conciergeEmail: 'concierge@admarketing.it',
    conciergePhone: '+39 099 8887766',
    conciergeWhatsApp: '+393401234567',
    couplePassword: 'sposi2026',
    dressCode: 'Puglia Chic & Summer Elegance (Tessuti in lino, seta e cotone. Tonalità sabbia, ulivo e bianco panna. Scarpe comode per prato e chianche in pietra)',
    story: 'Ci siamo innamorati della Puglia durante un viaggio on the road tra gli ulivi secolari della Valle d\'Itria nel 2023. Non vedevamo l\'ora di riportarvi tutti qui con noi per celebrare il nostro amore!',
    schedule: [
      { id: 'ev-1', time: '16:30', title: 'Welcome Refreshment & Limonata Pugliese', location: 'Corte degli Aranci', description: 'Accoglienza ospiti con infusi freschi e finger food tipico' },
      { id: 'ev-2', time: '17:15', title: 'Cerimonia tra gli Ulivi Secolari', location: 'Uliveto Storico', description: 'Scambio delle promesse al suono di archi e mandolini' },
      { id: 'ev-3', time: '18:30', title: 'Aperitivo al Tramonto & Isole Gastronomiche', location: 'Piscina & Belvedere', description: 'Mozzarella live show, crudi di mare e calici di Franciacorta e Primitivo' },
      { id: 'ev-4', time: '20:30', title: 'Cena Placée sotto le Luminarie', location: 'Piazza della Corte', description: 'Banchetto pugliese a cura degli chef della masseria' },
      { id: 'ev-5', time: '23:00', title: 'Taglio della Torta Nuziale & Spettacolo', location: 'Giardino dei Melograni', description: 'Millefoglie ai frutti di bosco e spettacolo di luci e scintille' },
      { id: 'ev-6', time: '23:30', title: 'Festa con Pizzica Salentina, Open Bar & DJ Set', location: 'Corte Notturna', description: 'Danze scatenate e cocktail d\'autore fino a tarda notte' }
    ],
    galleryPhotos: [
      { id: 'ph-1', url: hotelSuiteImg, caption: 'La nostra splendida masseria in Valle d\'Itria', uploadedAt: '2026-09-01' },
      { id: 'ph-2', url: boatTourImg, caption: 'Sopralluogo in barca a Polignano a Mare', uploadedAt: '2026-09-05' },
      { id: 'ph-3', url: heroBanner, caption: 'L\'aia illuminata dalle tradizionali luminarie pugliesi', uploadedAt: '2026-09-10' }
    ],
    secondaryInfo: [
      {
        id: 'sec-1',
        title: 'Logistica, Come Arrivare & Parcheggi',
        category: 'logistics',
        content: 'La masseria dista 45 minuti dall\'Aeroporto di Bari e 40 da quello di Brindisi. Per chi arriva in auto a noleggio è presente un ampio parcheggio interno custodito gratuito con servizio Valet. Per chi alloggia negli hotel convenzionati, è attiva la navetta gratuita A/R per la cerimonia e la festa.'
      },
      {
        id: 'sec-2',
        title: 'Clima a Settembre & Abbigliamento Consigliato',
        category: 'weather',
        content: 'A settembre in Puglia le giornate sono magnifiche e calde (26°-29°C), ideali per godersi la piscina e il mare. La sera la brezza può rinfrescare l\'aria (19°-21°C), per cui consigliamo una stola o un coprispalle leggero. Per le signore: consigliamo tacchi larghi o scarpe con zeppa per camminare agevolmente sui ciottoli storici e sul prato.'
      },
      {
        id: 'sec-3',
        title: 'Lista Nozze & Regalo di Nozze',
        category: 'gift',
        content: 'Il regalo più bello è avere ciascuno di voi al nostro fianco in questo giorno indimenticabile! Se desiderate contribuire al nostro viaggio di nozze in Giappone e Polinesia: IBAN IT98 X 03002 03280 000000123456 (Intestato a Sophia Rossi e Liam O\'Connor, causale: Matrimonio Sophia & Liam).'
      },
      {
        id: 'sec-4',
        title: 'Cucina Pugliese, Menù & Intolleranze',
        category: 'food',
        content: 'Tutti i piatti saranno preparati al momento con eccellenze del territorio pugliese. Abbiamo già concordato menù speciali per celiaci, vegetariani, vegani e persone con intolleranze al lattosio o ai crostacei: segnalatecelo all\'ingresso o nella chat con l\'assistente Valeria!'
      },
      {
        id: 'sec-5',
        title: 'I Nostri Luoghi del Cuore da Visitare',
        category: 'tourism',
        content: 'Se vi fermate qualche giorno in Puglia vi consigliamo caldamente: un gelato tra i vicoli a picco sul mare di Polignano, un aperitivo al tramonto tra le mura candide di Ostuni, e una passeggiata tra i trulli storici di Alberobello e Locorotondo.'
      }
    ],
    broadcastAnnouncements: [
      {
        id: 'ann-1',
        title: 'Navette Aeroporto Confermate',
        message: 'Tutte le navette collettive da Bari e Brindisi sono confermate. Vi preghiamo di inserire il codice volo nella scheda Transfer per consentire all\'autista di monitorare eventuali ritardi.',
        date: '10 Settembre 2026',
        urgent: false
      },
      {
        id: 'ann-2',
        title: 'Welcome Party & Dress Code Informale',
        message: 'Per la cena di benvenuto dell\'11 settembre: vestitevi comodi! Ci saranno panzerotti caldi preparati al momento e musicisti di tamburello e pizzica nell\'aia.',
        date: '11 Settembre 2026',
        urgent: true
      }
    ],
    hotels: [
      {
        id: 'hotel-puglia-1',
        name: 'Borgo Egnazia Resort & Spa (5★ Lusso)',
        stars: 5,
        address: 'Contrada Losciale, Fasano (BR)',
        distanceToVenue: 'Sede della cerimonia e ricevimento',
        negotiatedRate: 520,
        currency: 'EUR',
        bookingDeadline: '2026-06-30',
        groupCode: 'SOPHIA-LIAM-PUGLIA',
        supplierId: 'sup-borgo',
        image: hotelSuiteImg,
        websiteUrl: 'https://www.borgoegnazia.it/prenotazioni',
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Bottiglia di Primitivo di Manduria DOC in camera all\'arrivo e Late Check-Out ore 13:00 garantito.',
        roomTypes: [
          {
            id: 'rt-puglia-1',
            name: 'Corte Bella Suite (Vista Ulivi)',
            pricePerNight: 520,
            totalBlocked: 40,
            availableRooms: 16,
            maxOccupancy: 2
          },
          {
            id: 'rt-puglia-2',
            name: 'Borgo Splendida Suite con Giardino',
            pricePerNight: 690,
            totalBlocked: 15,
            availableRooms: 5,
            maxOccupancy: 3
          }
        ]
      },
      {
        id: 'hotel-puglia-2',
        name: 'Masseria Torre Coccaro (5★ Storica)',
        stars: 5,
        address: 'C.da Coccaro 8, Savelletri di Fasano (BR)',
        distanceToVenue: '6 min con navetta dedicata gratuita',
        negotiatedRate: 360,
        currency: 'EUR',
        bookingDeadline: '2026-07-15',
        groupCode: 'PUGLIA-LOVE-26',
        supplierId: 'sup-masseria-torre',
        image: heroBanner,
        websiteUrl: 'https://www.torrecoccaro.com/booking',
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Accesso gratuito alla spiaggia privata Coccaro Beach Club con lettino e telo mare inclusi.',
        roomTypes: [
          {
            id: 'rt-puglia-3',
            name: 'Deluxe Masseria Room',
            pricePerNight: 360,
            totalBlocked: 30,
            availableRooms: 14,
            maxOccupancy: 2
          }
        ]
      }
    ],
    transfers: [
      {
        id: 'tr-puglia-1',
        type: 'AIRPORT_SHUTTLE',
        title: 'Navetta Collettiva Bari Karol Wojtyla (BRI) → Savelletri',
        origin: 'Aeroporto di Bari (BRI)',
        destination: 'Borgo Egnazia & Masseria Torre Coccaro',
        departureTime: '11 Settembre 2026 - Ore 11:30, 15:00 e 19:30',
        vehicleType: 'Mercedes Sprinter VIP 16 posti',
        capacity: 16,
        bookedSeats: 11,
        pricePerSeat: 35,
        isPaidByCouple: false,
        supplierId: 'sup-ncc-puglia',
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Acqua minerale fresca in vettura, salviettina rinfrescante agli agrumi e facchinaggio bagagli incluso.'
      },
      {
        id: 'tr-puglia-2',
        type: 'AIRPORT_SHUTTLE',
        title: 'Navetta Collettiva Brindisi Salento (BDS) → Savelletri',
        origin: 'Aeroporto di Brindisi (BDS)',
        destination: 'Hotel Convenzionati',
        departureTime: '11 Settembre 2026 - Ore 12:30 e 17:00',
        vehicleType: 'Mercedes Sprinter VIP 16 posti',
        capacity: 16,
        bookedSeats: 7,
        pricePerSeat: 30,
        isPaidByCouple: false,
        supplierId: 'sup-ncc-puglia',
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Monitoraggio ritardo voli in tempo reale e attesa gratuita fino a 60 minuti.'
      },
      {
        id: 'tr-puglia-3',
        type: 'PRIVATE_NCC',
        title: 'NCC Privato Dedicato con Autista (Qualsiasi Orario/Aeroporto)',
        origin: 'Bari (BRI) o Brindisi (BDS) Gate Arrivi',
        destination: 'Alloggio Ospite',
        departureTime: 'Personalizzato sul tuo volo effettivo',
        vehicleType: 'Mercedes Classe E o Classe V Luxury',
        capacity: 6,
        bookedSeats: 4,
        pricePerSeat: 180,
        isPaidByCouple: false,
        supplierId: 'sup-ncc-puglia'
      },
      {
        id: 'tr-puglia-4',
        type: 'VENUE_SHUTTLE',
        title: 'Navetta Ufficiale Cerimonia e Ricevimento (A/R)',
        origin: 'Masserie convenzionate',
        destination: 'Piazza del Borgo (Cerimonia e Party)',
        departureTime: '12 Settembre - Partenza ore 16:15 / Ritorno continuativo 00:30-04:00',
        vehicleType: 'Bus Navette VIP',
        capacity: 150,
        bookedSeats: 130,
        pricePerSeat: 0,
        isPaidByCouple: true // OFFERTO DAGLI SPOSI!
      }
    ],
    experiences: [
      {
        id: 'exp-puglia-1',
        title: 'Grande Festa Pugliese tra Luminarie, Panzerotti e Pizzica',
        category: 'WELCOME_PARTY',
        eventDate: '2026-09-11',
        startTime: '19:30 - 23:30',
        durationHours: 4,
        meetingPoint: 'Piazza Centrale del Borgo',
        pricePerPerson: 0,
        isHostSponsored: true, // OFFERTO CON AFFETTO DAGLI SPOSI!
        maxParticipants: 150,
        bookedParticipants: 128,
        dressCode: 'Lino Bianco & Tradizionale Estivo',
        description: 'Serata di benvenuto interamente offerta da Sophia & Liam: forni a vista per focaccia e panzerotti caldi, mozzarellaro dal vivo, vini pugliesi e musica dei suonatori di tamburello e pizzica salentina.',
        image: heroBanner
      },
      {
        id: 'exp-puglia-2',
        title: 'Gita in Barca & Calice al Tramonto tra le Grotte di Polignano a Mare',
        category: 'BOAT_TOUR',
        eventDate: '2026-09-10',
        startTime: '17:30 - 20:00',
        durationHours: 2.5,
        meetingPoint: 'Porto Turistico Cala Ponte, Polignano',
        pricePerPerson: 85,
        isHostSponsored: false,
        maxParticipants: 28,
        bookedParticipants: 21,
        dressCode: 'Resort Chic / Costume da bagno sotto',
        description: 'Escursione privata a bordo di gozzi in legno lungo la costa frastagliata e le spettacolari grotte marine di Polignano a Mare, con bagno al tramonto e calice di Verdeca DOC accompagnato da taralli caldi.',
        supplierId: 'sup-boat-polignano',
        image: boatTourImg,
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Aperitivo al tramonto con taralli caldi, calice di Verdeca DOC e telo mare personalizzato incluso.'
      },
      {
        id: 'exp-puglia-3',
        title: 'Cooking Masterclass: Orecchiette Fatte a Mano & Degustazione Olio EVO',
        category: 'COOKING_CLASS',
        eventDate: '2026-09-13',
        startTime: '11:00 - 14:30',
        durationHours: 3.5,
        meetingPoint: 'Frantoio Ipogeo della Masseria',
        pricePerPerson: 75,
        isHostSponsored: false,
        maxParticipants: 20,
        bookedParticipants: 14,
        dressCode: 'Comodo',
        description: 'Impara l\'antica arte di trascinare le orecchiette insieme alle massaie locali, visita all\'antico frantoio ipogeo e pranzo conviviale sotto il pergolato.',
        image: hotelSuiteImg,
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Grembiule ricamato in lino pugliese in omaggio e ricettario tradizionale in lingua inglese.'
      }
    ],
    extraServices: [
      {
        id: 'srv-makeup-invitata',
        title: 'Trucco Professionale per la Cerimonia (Make-up Artist)',
        category: 'MAKEUP',
        price: 90,
        isPaidByCouple: false,
        duration: '50 min',
        description: 'Make-up a lunga tenuta resistente al caldo estivo, prodotti anallergici di alta gamma applicati direttamente nella tua camera in hotel.',
        providerName: 'Chiara Valente Bridal Glam',
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Fissatore spray professionale long-lasting e kit ritocco rossetto in omaggio.'
      },
      {
        id: 'srv-hair-styling',
        title: 'Acconciatura & Hair Styling Cerimonia',
        category: 'HAIR_STYLING',
        price: 80,
        isPaidByCouple: false,
        duration: '45 min',
        description: 'Piega, chignon o raccolto morbido mediterraneo realizzato su misura dal parrucchiere specializzato in eventi.',
        providerName: 'Chiara Valente Bridal Glam',
        negotiatedPerk: 'Negoziato per voi dall\'Agenzia: Trattamento lucidante alle proteine della seta incluso nella sessione.'
      },
      {
        id: 'srv-babysitting',
        title: 'Servizio Babysitting Bilingue Dedicato',
        category: 'BABYSITTING',
        price: 25,
        isPaidByCouple: false,
        duration: 'Tariffa oraria',
        description: 'Educatrici referenziate parlanti inglese per intrattenere e accudire i tuoi bambini durante la cerimonia o il ricevimento serale.',
        providerName: 'Apulia Kids Care'
      },
      {
        id: 'srv-steaming',
        title: 'Stiratura a Vapore & Cura Abito da Cerimonia',
        category: 'STEAMING_TAILORING',
        price: 35,
        isPaidByCouple: false,
        duration: 'Consegna in 4 ore',
        description: 'Ritiro dell\'abito spiegazzato dal viaggio in valigia, stiratura a vapore professionale e riconsegna impeccabile in camera.',
        providerName: 'Lavanderia Boutique San Domenico'
      }
    ],
    guests: [
      {
        id: 'g-puglia-1',
        name: 'Aidan & Clodagh Murphy',
        email: 'aidan.murphy@dublin.ie',
        phone: '+353 1 496 0000',
        country: 'Irlanda (Dublino)',
        flag: '🇮🇪',
        hotelBooked: 'Borgo Egnazia Resort & Spa (5★ Lusso)',
        roomType: 'Corte Bella Suite (Vista Ulivi)',
        transferBooked: 'Navetta Collettiva Bari Karol Wojtyla (BRI)',
        flight: 'Aer Lingus EI432 (10:45)',
        experiences: ['Grande Festa Pugliese tra Luminarie, Panzerotti e Pizzica', 'Cooking Masterclass: Orecchiette Fatte a Mano'],
        extraServices: ['Trucco Professionale per la Cerimonia (Make-up Artist)'],
        diet: 'Celiachia (Senza glutine)',
        status: 'CONFIRMED',
        totalAmountDue: 200, // 35 transfer + 75 cooking + 90 makeup (hotel pagato a parte o via bonifico)
        paymentStatus: 'PAID',
        registeredAt: '2026-10-02'
      },
      {
        id: 'g-puglia-2',
        name: 'James & Sarah Kensington',
        email: 'james.kensington@londonlaw.co.uk',
        phone: '+44 20 7946 0199',
        country: 'Regno Unito (Londra)',
        flag: '🇬🇧',
        hotelBooked: 'Masseria Torre Coccaro (5★ Storica)',
        roomType: 'Deluxe Masseria Room',
        transferBooked: 'NCC Privato Dedicato con Autista',
        flight: 'British Airways BA2602 (13:15)',
        experiences: ['Grande Festa Pugliese tra Luminarie, Panzerotti e Pizzica', 'Gita in Barca & Calice al Tramonto tra le Grotte di Polignano a Mare'],
        extraServices: ['Acconciatura & Hair Styling Cerimonia'],
        diet: 'Nessuna restrizione',
        status: 'CONFIRMED',
        totalAmountDue: 345, // 180 ncc + 85 boat + 80 hair
        paymentStatus: 'PENDING',
        registeredAt: '2026-10-04'
      },
      {
        id: 'g-puglia-3',
        name: 'François & Héloïse Laurent',
        email: 'f.laurent@paris-media.fr',
        phone: '+33 6 12 34 56 78',
        country: 'Francia (Parigi)',
        flag: '🇫🇷',
        hotelBooked: 'Nessun hotel richiesto (Alloggio privato con amici)',
        roomType: '-',
        transferBooked: 'Autonomo con noleggio auto',
        flight: 'Air France AF1420 (09:30)',
        experiences: ['Grande Festa Pugliese tra Luminarie, Panzerotti e Pizzica'],
        extraServices: [],
        diet: 'Vegetariano',
        status: 'CONFIRMED',
        totalAmountDue: 0, // Solo festa offerta dagli sposi
        paymentStatus: 'FREE',
        registeredAt: '2026-10-05'
      }
    ],
    giftRequests: [
      {
        id: 'gift-req-1',
        weddingCode: 'SOPHIA-LIAM-2026',
        coupleNames: 'Sophia Rossi & Liam O\'Connor',
        serviceId: 'tr-puglia-4',
        serviceTitle: 'Navetta Ufficiale Cerimonia e Ricevimento (A/R)',
        serviceCategory: 'TRANSFER',
        guestsCount: 150,
        unitPrice: 15,
        totalEstimatedAmount: 2250,
        currency: 'EUR',
        coupleNotes: 'Vogliamo regalare il transfer navetta tra le masserie a tutti gli invitati per farli viaggiare in totale relax e sicurezza!',
        status: 'APPROVED',
        requestedAt: '2026-08-15 14:30',
        approvedAt: '2026-08-16 10:00',
        agencyNotes: 'Approvato! Tariffa convenzionata bloccata con flotta bus VIP e autisti bilingue.'
      },
      {
        id: 'gift-req-2',
        weddingCode: 'SOPHIA-LIAM-2026',
        coupleNames: 'Sophia Rossi & Liam O\'Connor',
        serviceId: 'exp-puglia-2',
        serviceTitle: 'Gita in Barca & Calice al Tramonto tra le Grotte di Polignano a Mare',
        serviceCategory: 'EXPERIENCE',
        guestsCount: 25,
        unitPrice: 85,
        totalEstimatedAmount: 2125,
        currency: 'EUR',
        coupleNotes: 'Vorremmo regalare questa escursione al tramonto con calice di benvenuto per i 25 ospiti del nostro wedding party ristretto.',
        status: 'PENDING_APPROVAL',
        requestedAt: '2026-09-05 18:20',
        agencyNotes: 'Preventivo in verifica di disponibilità di 2 gozzi affiancati con Donato Zaccaria.'
      }
    ]
  },
  {
    id: 'wed-como-2026',
    weddingCode: 'EMMA-ALEX-2026',
    coupleNames: 'Emma Watson & Alexander Sterling',
    weddingDate: '2026-06-20',
    venue: 'Villa Balbianello, Tremezzina',
    city: 'Lago di Como & Puglia',
    country: 'Italia',
    bannerImage: heroBanner,
    welcomeMessage: 'Cari amici, benvenuti in Italia! Siamo felicissimi di festeggiare il nostro matrimonio con voi. Il concierge di Valeria e AD Marketing è a vostra disposizione su Apulian Wedding Concierge per organizzare hotel convenzionati, transfer e gite sul lago.',
    currency: 'EUR',
    conciergeEmail: 'concierge@admarketing.it',
    conciergePhone: '+39 099 8887766',
    conciergeWhatsApp: '+393401234567',
    hotels: [
      {
        id: 'hotel-como-1',
        name: 'Grand Hotel Tremezzo (5★ Lusso)',
        stars: 5,
        address: 'Via Regina 8, Tremezzina (CO)',
        distanceToVenue: '8 min water taxi o navetta',
        negotiatedRate: 490,
        currency: 'EUR',
        bookingDeadline: '2026-04-15',
        groupCode: 'EMMA-ALEX-VIP',
        image: hotelSuiteImg,
        roomTypes: [
          {
            id: 'rt-como-1',
            name: 'Prestige Vista Lago',
            pricePerNight: 490,
            totalBlocked: 30,
            availableRooms: 11,
            maxOccupancy: 2
          }
        ]
      }
    ],
    transfers: [
      {
        id: 'tr-como-1',
        type: 'AIRPORT_SHUTTLE',
        title: 'Navetta Collettiva Milano Malpensa (MXP) → Tremezzo',
        origin: 'Malpensa T1/T2',
        destination: 'Hotel Convenzionati',
        departureTime: '18 Giugno - 11:00 e 15:30',
        vehicleType: 'Mercedes Sprinter VIP 16 pax',
        capacity: 16,
        bookedSeats: 12,
        pricePerSeat: 45,
        isPaidByCouple: false
      },
      {
        id: 'tr-como-2',
        type: 'VENUE_SHUTTLE',
        title: 'Navetta Motoscafo Ufficiale Cerimonia (A/R)',
        origin: 'Lobby Hotel',
        destination: 'Pontile Villa Balbianello',
        departureTime: '20 Giugno - 15:15 / Ritorno 01:00',
        vehicleType: 'Motoscafo Privato',
        capacity: 120,
        bookedSeats: 105,
        pricePerSeat: 0,
        isPaidByCouple: true
      }
    ],
    experiences: [
      {
        id: 'exp-como-1',
        title: 'Welcome Dinner & Pizza Party all\'Aperto',
        category: 'WELCOME_PARTY',
        eventDate: '2026-06-19',
        startTime: '20:30',
        durationHours: 3,
        meetingPoint: 'Terrazza Panoramica Bellagio',
        pricePerPerson: 0,
        isHostSponsored: true, // OFFERTO DAGLI SPOSI!
        maxParticipants: 120,
        bookedParticipants: 110,
        dressCode: 'Casual Summer Party',
        description: 'Cena informale con forni a legna per pizza e musica dal vivo offerta con amore dagli sposi.',
        image: heroBanner
      },
      {
        id: 'exp-como-2',
        title: 'Sunset Cruise su Motoscafo Riva d\'Epoca & Champagne',
        category: 'BOAT_TOUR',
        eventDate: '2026-06-19',
        startTime: '18:00',
        durationHours: 2.5,
        meetingPoint: 'Molo di Tremezzo',
        pricePerPerson: 110,
        isHostSponsored: false,
        maxParticipants: 24,
        bookedParticipants: 18,
        dressCode: 'Resort Chic',
        description: 'Tour privato delle ville storiche del centro lago con calice di champagne al tramonto.',
        image: boatTourImg
      }
    ],
    extraServices: [
      {
        id: 'srv-como-makeup',
        title: 'Trucco Invitata a Domicilio',
        category: 'MAKEUP',
        price: 95,
        isPaidByCouple: false,
        duration: '45 min',
        description: 'Make-up artist in camera prima della partenza per la villa.',
        providerName: 'Como Beauty Atelier'
      }
    ],
    guests: [
      {
        id: 'g-como-1',
        name: 'Eleanor & Jonathan Vance',
        email: 'eleanor.vance@nycapital.com',
        phone: '+1 212 555 0192',
        country: 'Stati Uniti (New York)',
        flag: '🇺🇸',
        hotelBooked: 'Grand Hotel Tremezzo (5★ Lusso)',
        roomType: 'Prestige Vista Lago',
        transferBooked: 'Navetta Collettiva Milano Malpensa (MXP)',
        flight: 'Delta DL112 (08:45)',
        experiences: ['Welcome Dinner & Pizza Party all\'Aperto', 'Sunset Cruise su Motoscafo Riva d\'Epoca & Champagne'],
        extraServices: ['Trucco Invitata a Domicilio'],
        diet: 'Vegetariano',
        status: 'CONFIRMED',
        totalAmountDue: 250,
        paymentStatus: 'PAID',
        registeredAt: '2026-10-01'
      }
    ]
  }
];

// Richieste iniziali desideri ospiti
export const INITIAL_WISH_REQUESTS: TouristWishRequest[] = [
  {
    id: 'wish-1',
    weddingCode: 'SOPHIA-LIAM-2026',
    guestName: 'James & Sarah Kensington',
    guestEmail: 'james.kensington@londonlaw.co.uk',
    guestPhone: '+44 20 7946 0199',
    title: 'Noleggio Vespa d\'epoca per tour della Valle d\'Itria',
    description: 'Vorremmo noleggiare una Vespa vintage 125 per il giorno 14 Settembre per esplorare i trulli di Alberobello e Locorotondo in autonomia. È possibile averla con consegna direttamente in masseria con due caschi?',
    preferredDate: '2026-09-14',
    participantsCount: 2,
    budgetRange: '€150 - €250',
    status: 'PROPOSAL_READY',
    agencyNotes: 'Contattato fornitore Vintage Apulia Moto a Martina Franca. Disponibile Vespa PX 125 color crema con consegna in masseria a €160/giorno inclusa assicurazione kasko.',
    proposedCost: 160,
    createdAt: '2026-10-05 14:22'
  },
  {
    id: 'wish-2',
    weddingCode: 'SOPHIA-LIAM-2026',
    guestName: 'Aidan Murphy',
    guestEmail: 'aidan.murphy@dublin.ie',
    title: 'Passeggiata a cavallo al tramonto sulla spiaggia di Torre Canne',
    description: 'I nostri due ragazzi adorano i cavalli. Ci piacerebbe organizzare un\'escursione di 2 ore tra gli ulivi e sulla spiaggia sabbiosa al calar del sole il 13 Settembre.',
    preferredDate: '2026-09-13',
    participantsCount: 4,
    budgetRange: '€200 - €350',
    status: 'RECEIVED',
    agencyNotes: 'In attesa di conferma disponibilità dal Maneggio San Domenico.',
    createdAt: '2026-10-06 09:15'
  }
];

// Messaggi iniziali chat con Valeria
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    weddingCode: 'SOPHIA-LIAM-2026',
    guestName: 'Aidan & Clodagh Murphy',
    guestEmail: 'aidan.murphy@dublin.ie',
    sender: 'valeria',
    text: 'Buongiorno Aidan e Clodagh! Sono Valeria, la vostra assistente personale per il matrimonio di Sophia e Liam a Borgo Egnazia. Sono qui per qualsiasi informazione su orari navette, prenotazioni o consigli sul vostro soggiorno in Puglia!',
    timestamp: '2026-10-06 10:00',
    readByAdmin: true
  },
  {
    id: 'chat-2',
    weddingCode: 'SOPHIA-LIAM-2026',
    guestName: 'Aidan & Clodagh Murphy',
    guestEmail: 'aidan.murphy@dublin.ie',
    sender: 'guest',
    text: 'Ciao Valeria, grazie mille! Il nostro volo Aer Lingus atterra a Bari alle 10:45. La navetta delle 11:30 ci aspetterà se c\'è un piccolo ritardo nel ritiro bagagli?',
    timestamp: '2026-10-06 10:14',
    readByAdmin: true
  },
  {
    id: 'chat-3',
    weddingCode: 'SOPHIA-LIAM-2026',
    guestName: 'Aidan & Clodagh Murphy',
    guestEmail: 'aidan.murphy@dublin.ie',
    sender: 'valeria',
    text: 'Assolutamente sì! Il nostro autista Pasquale monitora il vostro volo in tempo reale sul tabellone aeroportuale. Vi aspetterà all\'uscita con il cartello con il vostro nome. Sarete comodissimi!',
    timestamp: '2026-10-06 10:20',
    readByAdmin: true
  }
];

// Richieste di pagamento iniziali
export const INITIAL_PAYMENT_REQUESTS: PaymentRequest[] = [
  {
    id: 'pay-req-1',
    weddingCode: 'SOPHIA-LIAM-2026',
    guestName: 'James & Sarah Kensington',
    guestEmail: 'james.kensington@londonlaw.co.uk',
    amount: 345,
    currency: 'EUR',
    items: [
      { description: 'NCC Privato Dedicato Aeroporto Bari -> Savelletri', amount: 180 },
      { description: 'Gita in Barca a Polignano a Mare (2 pax)', amount: 85 },
      { description: 'Acconciatura & Hair Styling Cerimonia', amount: 80 }
    ],
    status: 'SENT',
    sentAt: '2026-10-06 16:30',
    paymentMethod: 'STRIPE_LINK',
    invoiceCode: 'INV-2026-089'
  }
];

// Pacchetti Iniziali inseriti dai Fornitori e pronti per l'Agenzia
export const INITIAL_SUPPLIER_PACKAGES: SupplierPackage[] = [
  {
    id: 'pkg-borgo-1',
    supplierId: 'sup-borgo',
    supplierName: 'Borgo Egnazia Resort & Spa',
    supplierEmail: 'booking@borgoegnazia.it',
    supplierPhone: '+39 080 225500',
    title: 'Pacchetto Camere Corte & Borgo Luxury',
    category: 'HOTEL',
    description: 'Blocco camere deluxe e suite riservate per invitati con prima colazione mediterranea, accesso alla Spa Vair, transfer golf cart all\'interno del resort e cancellazione flessibile.',
    pricePerUnit: 520,
    currency: 'EUR',
    commissionPercent: 12,
    capacityOrAvailability: '25 Camere disponibili per blocco',
    includedFeatures: ['Colazione a buffet inclusa', 'Accesso Vair Spa', 'Parcheggio VIP', 'Concierge dedicato in loco'],
    image: hotelSuiteImg,
    notesForAgency: 'Tariffa netta concordata per matrimoni gestiti da AD Marketing. Possibilità di opzione fino a 45 giorni prima.',
    createdAt: '2026-10-01'
  },
  {
    id: 'pkg-ncc-1',
    supplierId: 'sup-ncc-puglia',
    supplierName: 'Apulia VIP Transfer & NCC',
    supplierEmail: 'info@apuliaviptransfer.it',
    supplierPhone: '+39 338 9090123',
    title: 'Pacchetto Flotta Navette Aeroportuali Bari / Brindisi',
    category: 'TRANSFER',
    description: 'Servizio di navetta collettiva e trasferimenti privati NCC con Mercedes Classe V e Sprinter Luxury. Include accoglienza con cartello personalizzato con i nomi degli sposi, monitoraggio voli in tempo reale e acqua minerale a bordo.',
    pricePerUnit: 35,
    currency: 'EUR',
    commissionPercent: 20,
    capacityOrAvailability: 'Fino a 8 van contemporanei (64 pax/ora)',
    includedFeatures: ['Monitoraggio volo live', 'Cartello di benvenuto sposi', 'Autisti parlanti inglese', 'Assicurazione totale bagagli'],
    notesForAgency: 'Tariffa speciale €35/persona per navette collettive, €180 per NCC privato esclusivo.',
    createdAt: '2026-10-02'
  },
  {
    id: 'pkg-boat-1',
    supplierId: 'sup-boat-polignano',
    supplierName: 'Polignano Sea Charters & Riva Yachts',
    supplierEmail: 'donato@seacharters.it',
    supplierPhone: '+39 347 5544332',
    title: 'Sunset Cruise Grotte di Polignano & Aperitivo a Bordo',
    category: 'EXPERIENCE',
    description: 'Tour in motoscafo d\'epoca e gozzi marinari per gli ospiti del matrimonio. Sosta tuffo nella Grotta Palazzese, aperitivo con calici di vino Verdeca locale, focaccia calda barese e tagliere di formaggi tipici al tramonto.',
    pricePerUnit: 85,
    currency: 'EUR',
    commissionPercent: 25,
    capacityOrAvailability: '2 gozzi da 14 posti (totale 28 persone)',
    includedFeatures: ['Skipper professionista', 'Aperitivo e vino inclusi', 'Teli mare e maschere snorkeling', 'Musica personalizzabile'],
    image: boatTourImg,
    notesForAgency: 'Orario ideale 17:30 - 20:00. Partenza dal porto di Polignano (Cala Ponte Marina).',
    createdAt: '2026-10-03'
  },
  {
    id: 'pkg-glam-1',
    supplierId: 'sup-beauty-glam',
    supplierName: 'Apulian Bridal & Guest Glam Team',
    supplierEmail: 'chiara@apulianglam.it',
    supplierPhone: '+39 349 7788990',
    title: 'Servizio Beauty & Hair Styling a Domicilio in Masseria',
    category: 'BEAUTY_HAIR',
    description: 'Team di truccatrici e hairstylist professioniste dedicate alle invitate. Sessioni personalizzate direttamente nelle camere dell\'hotel con prodotti professionali a lunga tenuta water-resistant e pieghe resistenti all\'umidità estiva.',
    pricePerUnit: 90,
    currency: 'EUR',
    commissionPercent: 18,
    capacityOrAvailability: 'Fino a 20 invitate preparate in contemporanea',
    includedFeatures: ['Make-up long-lasting', 'Kit ritocco labbra omaggio', 'Servizio in camera hotel', 'Orari coordinati con la cerimonia'],
    notesForAgency: 'Pacchetto combinato trucco + acconciatura a €160 anziché €170 se prenotati insieme.',
    createdAt: '2026-10-04'
  }
];

// Prenotazioni inviate dagli ospiti e ricevute sulla email dei fornitori
export const INITIAL_SUPPLIER_BOOKINGS: SupplierBookingOrder[] = [
  {
    id: 'ord-sup-1',
    supplierId: 'sup-ncc-puglia',
    supplierName: 'Apulia VIP Transfer & NCC',
    supplierEmail: 'info@apuliaviptransfer.it',
    weddingCode: 'SOPHIA-LIAM-2026',
    coupleNames: 'Sophia Rossi & Liam O\'Connor',
    guestName: 'James & Sarah Kensington',
    guestEmail: 'james.kensington@londonlaw.co.uk',
    guestPhone: '+44 20 7946 0199',
    serviceTitle: 'NCC Privato Dedicato con Autista (Qualsiasi Orario/Aeroporto)',
    serviceCategory: 'TRANSFER',
    dateRequested: '2026-09-11 13:15',
    participantsOrQuantity: 2,
    totalAmount: 180,
    currency: 'EUR',
    guestNotes: 'Volo British Airways BA2602 atterra a Bari alle 13:15. 2 bagagli grandi e porta-abito da cerimonia.',
    status: 'RECEIVED',
    paymentMethodChosen: 'SUPPLIER_BANK_TRANSFER',
    paymentNotes: 'In attesa di bonifico diretto da parte del cliente su IBAN fornitore.',
    emailSentToSupplierAt: '2026-10-06 14:10'
  },
  {
    id: 'ord-sup-2',
    supplierId: 'sup-boat-polignano',
    supplierName: 'Polignano Sea Charters & Riva Yachts',
    supplierEmail: 'donato@seacharters.it',
    weddingCode: 'SOPHIA-LIAM-2026',
    coupleNames: 'Sophia Rossi & Liam O\'Connor',
    guestName: 'James & Sarah Kensington',
    guestEmail: 'james.kensington@londonlaw.co.uk',
    guestPhone: '+44 20 7946 0199',
    serviceTitle: 'Gita in Barca & Calice al Tramonto tra le Grotte di Polignano a Mare',
    serviceCategory: 'EXPERIENCE',
    dateRequested: '2026-09-10 17:30',
    participantsOrQuantity: 2,
    totalAmount: 170,
    currency: 'EUR',
    guestNotes: 'Preferenza per barca in legno tradizionale.',
    status: 'CONFIRMED',
    paymentMethodChosen: 'DIRECT_AT_CHECKIN',
    paymentNotes: 'Confermato. Il cliente salderà direttamente all\'imbarco prima della partenza in contanti o carta.',
    emailSentToSupplierAt: '2026-10-06 14:15',
    supplierResponseDate: '2026-10-06 15:00'
  },
  {
    id: 'ord-sup-3',
    supplierId: 'sup-borgo',
    supplierName: 'Borgo Egnazia Resort & Spa',
    supplierEmail: 'booking@borgoegnazia.it',
    weddingCode: 'SOPHIA-LIAM-2026',
    coupleNames: 'Sophia Rossi & Liam O\'Connor',
    guestName: 'Aidan & Clodagh Murphy',
    guestEmail: 'aidan.murphy@dublin.ie',
    guestPhone: '+353 1 496 0000',
    serviceTitle: 'Corte Bella Suite (Vista Ulivi) - 3 Notti',
    serviceCategory: 'HOTEL',
    dateRequested: '2026-09-10 / 2026-09-13',
    participantsOrQuantity: 1,
    totalAmount: 1560,
    currency: 'EUR',
    guestNotes: 'Letto matrimoniale king size, check-in anticipato se possibile.',
    status: 'CONFIRMED',
    paymentMethodChosen: 'AGENCY_CENTRAL_BILLING',
    paymentNotes: 'Camera confermata e garantita tramite convenzione agenzia AD Marketing.',
    emailSentToSupplierAt: '2026-10-05 18:20',
    supplierResponseDate: '2026-10-05 19:10'
  }
];

// Credenziali amministrative provvisorie per l'accesso Agenzia
export const ADMIN_CREDENTIALS = {
  email: 'admin@weddingconcierge.it',
  password: 'WeddingAdmin2026!',
  name: 'Elena Baroni & Valeria (Team Concierge AD Marketing)',
  role: 'CHIEF_CONCIERGE'
};
