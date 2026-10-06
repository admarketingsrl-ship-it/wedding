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
  image?: string;
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
}

export interface ExperienceItem {
  id: string;
  title: string;
  category: 'BOAT_TOUR' | 'WELCOME_PARTY' | 'COOKING_CLASS' | 'WINE_TASTING';
  eventDate: string;
  startTime: string;
  durationHours: number;
  meetingPoint: string;
  pricePerPerson: number;
  isHostSponsored: boolean;
  maxParticipants: number;
  bookedParticipants: number;
  dressCode?: string;
  description: string;
  image?: string;
}

export interface GuestItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  flag: string;
  hotelBooked: string;
  roomType: string;
  transferBooked: string;
  flight: string;
  experiences: string[];
  diet: string;
  status: 'CONFIRMED' | 'PENDING' | 'WAITLIST';
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
  hotels: HotelItem[];
  transfers: TransferItem[];
  experiences: ExperienceItem[];
  guests: GuestItem[];
}

export const INITIAL_WEDDINGS: WeddingData[] = [
  {
    id: 'wed-como-2026',
    weddingCode: 'EMMA-ALEX-2026',
    coupleNames: 'Emma Watson & Alexander Sterling',
    weddingDate: '2026-06-20',
    venue: 'Villa Balbianello, Tremezzina',
    city: 'Lago di Como',
    country: 'Italia',
    bannerImage: heroBanner,
    welcomeMessage: 'Siamo felicissimi di festeggiare il nostro matrimonio sul Lago di Como insieme a tutti voi! Il nostro team concierge è a vostra completa disposizione per prenotare camere convenzionate, trasferimenti dagli aeroporti di Milano ed escursioni esclusive.',
    currency: 'EUR',
    conciergeEmail: 'concierge@rivieraweddings.com',
    conciergePhone: '+39 031 998877',
    conciergeWhatsApp: '+393401234567',
    hotels: [
      {
        id: 'hotel-como-1',
        name: 'Grand Hotel Tremezzo',
        stars: 5,
        address: 'Via Regina 8, Tremezzina (CO)',
        distanceToVenue: '8 min water taxi privato o navetta dedicata',
        negotiatedRate: 490,
        currency: 'EUR',
        bookingDeadline: '2026-04-15',
        groupCode: 'EMMA-ALEX-VIP',
        image: hotelSuiteImg,
        roomTypes: [
          {
            id: 'rt-1',
            name: 'Prestige Vista Lago',
            pricePerNight: 490,
            totalBlocked: 35,
            availableRooms: 12,
            maxOccupancy: 2
          },
          {
            id: 'rt-2',
            name: 'Deluxe Suite Terrazza Storica',
            pricePerNight: 780,
            totalBlocked: 10,
            availableRooms: 3,
            maxOccupancy: 3
          }
        ]
      },
      {
        id: 'hotel-como-2',
        name: 'Grand Hotel Villa Serbelloni',
        stars: 5,
        address: 'Via Roma 1, Bellagio (CO)',
        distanceToVenue: '12 min motoscafo privato per Villa Balbianello',
        negotiatedRate: 320,
        currency: 'EUR',
        bookingDeadline: '2026-04-30',
        groupCode: 'WEDDING-COMO26',
        image: heroBanner,
        roomTypes: [
          {
            id: 'rt-3',
            name: 'Classic Double Garden View',
            pricePerNight: 320,
            totalBlocked: 40,
            availableRooms: 14,
            maxOccupancy: 2
          }
        ]
      }
    ],
    transfers: [
      {
        id: 'tr-1',
        type: 'AIRPORT_SHUTTLE',
        title: 'Navetta Collettiva VIP Milano Malpensa (MXP) → Lago di Como',
        origin: 'Milano Malpensa Terminal 1 & 2',
        destination: 'Grand Hotel Tremezzo & Villa Serbelloni',
        departureTime: '18 Giugno 2026 - Ore 11:00, 15:30 e 19:30',
        vehicleType: 'Mercedes-Benz Sprinter VIP (16 posti)',
        capacity: 16,
        bookedSeats: 14,
        pricePerSeat: 45,
        isPaidByCouple: false
      },
      {
        id: 'tr-2',
        type: 'PRIVATE_NCC',
        title: 'NCC Privato Dedicato con Autista (Qualsiasi Aeroporto)',
        origin: 'Milano Malpensa (MXP) / Linate (LIN) / Bergamo (BGY)',
        destination: 'Alloggio dell\'Ospite',
        departureTime: 'Personalizzato su orario effettivo volo',
        vehicleType: 'Mercedes Classe E / Classe V (fino a 6 pax)',
        capacity: 6,
        bookedSeats: 4,
        pricePerSeat: 220,
        isPaidByCouple: false
      },
      {
        id: 'tr-3',
        type: 'VENUE_SHUTTLE',
        title: 'Navetta Ufficiale Giorno del Matrimonio (A/R)',
        origin: 'Lobby Hotel Tremezzo / Serbelloni',
        destination: 'Pontile Villa Balbianello',
        departureTime: '20 Giugno 2026 - Partenza 15:15 / Ritorno 01:00 e 03:00',
        vehicleType: 'Motoscafo Privato + Navette',
        capacity: 124,
        bookedSeats: 110,
        pricePerSeat: 0,
        isPaidByCouple: true
      }
    ],
    experiences: [
      {
        id: 'exp-1',
        title: 'Sunset Cruise su Motoscafo Riva d\'Epoca & Champagne',
        category: 'BOAT_TOUR',
        eventDate: '2026-06-19',
        startTime: '18:00 - 20:30',
        durationHours: 2.5,
        meetingPoint: 'Molo di Tremezzo',
        pricePerPerson: 110,
        isHostSponsored: false,
        maxParticipants: 24,
        bookedParticipants: 18,
        dressCode: 'Resort Chic / White Accents',
        description: 'Tour privato delle ville storiche del centro lago con sosta champagne al tramonto di fronte a Villa Balbianello.',
        image: boatTourImg
      },
      {
        id: 'exp-2',
        title: 'Welcome Dinner & Pizza Party all\'Aperto',
        category: 'WELCOME_PARTY',
        eventDate: '2026-06-19',
        startTime: '20:30 - 23:30',
        durationHours: 3,
        meetingPoint: 'Terrazza Giardino Bellagio',
        pricePerPerson: 0,
        isHostSponsored: true,
        maxParticipants: 120,
        bookedParticipants: 112,
        dressCode: 'Casual Summer Party',
        description: 'Cena informale offerta dagli sposi con forni a legna per pizza napoletana, degustazione vini e musica acustica dal vivo.',
        image: heroBanner
      },
      {
        id: 'exp-3',
        title: 'Masterclass Pasta Fresca & Tiramisù in Dimora Storica',
        category: 'COOKING_CLASS',
        eventDate: '2026-06-21',
        startTime: '11:00 - 14:00',
        durationHours: 3,
        meetingPoint: 'Villa Rustica Lenno',
        pricePerPerson: 85,
        isHostSponsored: false,
        maxParticipants: 16,
        bookedParticipants: 12,
        dressCode: 'Comfortable',
        description: 'Lezione pratica con chef comasco per imparare i segreti della pasta tirata a mano e del vero tiramisù con pranzo finale.',
        image: hotelSuiteImg
      }
    ],
    guests: [
      {
        id: 'g-1',
        name: 'Eleanor & Jonathan Vance',
        email: 'eleanor.vance@nycapital.com',
        phone: '+1 212 555 0192',
        country: 'Stati Uniti (New York)',
        flag: '🇺🇸',
        hotelBooked: 'Grand Hotel Tremezzo',
        roomType: 'Prestige Vista Lago',
        transferBooked: 'Shuttle MXP 11:00',
        flight: 'Delta DL112 (08:45)',
        experiences: ['Sunset Riva Cruise', 'Welcome Pizza Party'],
        diet: 'Vegetariano, no crostacei',
        status: 'CONFIRMED'
      },
      {
        id: 'g-2',
        name: 'Lord Henry & Lady Charlotte Windsor',
        email: 'c.windsor@kensington.co.uk',
        phone: '+44 20 7946 0912',
        country: 'Regno Unito (Londra)',
        flag: '🇬🇧',
        hotelBooked: 'Villa Serbelloni Palace',
        roomType: 'Classic Double Garden',
        transferBooked: 'NCC Privato (LIN)',
        flight: 'British Airways BA562 (12:15)',
        experiences: ['Cooking Class Tiramisù', 'Welcome Pizza Party'],
        diet: 'Senza glutine',
        status: 'CONFIRMED'
      },
      {
        id: 'g-3',
        name: 'Pierre & Camille Dubois',
        email: 'pierre.dubois@atelier-paris.fr',
        phone: '+33 1 42 68 55 00',
        country: 'Francia (Parigi)',
        flag: '🇫🇷',
        hotelBooked: 'Grand Hotel Tremezzo',
        roomType: 'Prestige Vista Lago',
        transferBooked: 'Shuttle MXP 15:30',
        flight: 'Air France AF1208 (14:10)',
        experiences: ['Sunset Riva Cruise', 'Welcome Pizza Party'],
        diet: 'Nessuna restrizione',
        status: 'CONFIRMED'
      }
    ]
  },
  {
    id: 'wed-puglia-2026',
    weddingCode: 'SOPHIA-LIAM-2026',
    coupleNames: 'Sophia Rossi & Liam O\'Connor',
    weddingDate: '2026-09-12',
    venue: 'Borgo Egnazia, Savelletri di Fasano',
    city: 'Valle d\'Itria, Puglia',
    country: 'Italia',
    bannerImage: hotelSuiteImg,
    welcomeMessage: 'Vi diamo il benvenuto tra gli ulivi secolari e le masserie della Puglia! Abbiamo organizzato per voi alloggi nel borgo, navette dagli aeroporti di Bari e Brindisi e autentiche serate pugliesi.',
    currency: 'EUR',
    conciergeEmail: 'puglia@rivieraweddings.com',
    conciergePhone: '+39 080 482700',
    conciergeWhatsApp: '+393409876543',
    hotels: [
      {
        id: 'hotel-puglia-1',
        name: 'Borgo Egnazia Resort & Spa',
        stars: 5,
        address: 'Contrada Losciale, Fasano (BR)',
        distanceToVenue: 'Sede della cerimonia e ricevimento',
        negotiatedRate: 520,
        currency: 'EUR',
        bookingDeadline: '2026-06-30',
        groupCode: 'SOPHIA-LIAM-PUGLIA',
        image: hotelSuiteImg,
        roomTypes: [
          {
            id: 'rt-puglia-1',
            name: 'Corte Bella Suite',
            pricePerNight: 520,
            totalBlocked: 40,
            availableRooms: 18,
            maxOccupancy: 2
          }
        ]
      }
    ],
    transfers: [
      {
        id: 'tr-puglia-1',
        type: 'AIRPORT_SHUTTLE',
        title: 'Navetta Navetta Bari Karol Wojtyla (BRI) → Borgo Egnazia',
        origin: 'Bari Aeroporto (BRI)',
        destination: 'Borgo Egnazia',
        departureTime: '11 Settembre 2026 - Ore 12:00 e 17:00',
        vehicleType: 'Mercedes Sprinter VIP 16 posti',
        capacity: 16,
        bookedSeats: 8,
        pricePerSeat: 35,
        isPaidByCouple: false
      }
    ],
    experiences: [
      {
        id: 'exp-puglia-1',
        title: 'Festa Pugliese in Piazza tra Luminarie e Pizzica',
        category: 'WELCOME_PARTY',
        eventDate: '2026-09-11',
        startTime: '19:30 - 23:30',
        durationHours: 4,
        meetingPoint: 'Piazza Centrale del Borgo',
        pricePerPerson: 0,
        isHostSponsored: true,
        maxParticipants: 140,
        bookedParticipants: 120,
        dressCode: 'White & Traditional Linen',
        description: 'Serata di benvenuto con bancarelle di panzerotti fritti, orecchiette dal vivo e ballerini di pizzica.',
        image: heroBanner
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
        hotelBooked: 'Borgo Egnazia',
        roomType: 'Corte Bella Suite',
        transferBooked: 'Shuttle Bari 12:00',
        flight: 'Ryanair FR7082 (10:45)',
        experiences: ['Festa Pugliese in Piazza'],
        diet: 'Celiaco',
        status: 'CONFIRMED'
      }
    ]
  }
];

// Credenziali amministrative provvisorie per l'accesso Agenzia
export const ADMIN_CREDENTIALS = {
  email: 'admin@weddingconcierge.it',
  password: 'WeddingAdmin2026!',
  name: 'Elena Baroni (Direttore Concierge Agenzia)',
  role: 'CHIEF_CONCIERGE'
};
