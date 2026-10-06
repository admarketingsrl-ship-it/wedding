export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  language: 'javascript' | 'json' | 'prisma' | 'bash' | 'markdown';
  description: string;
  category: 'core' | 'database' | 'routes' | 'controllers' | 'middlewares' | 'config';
  content: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    id: 'server-js',
    name: 'server.js',
    path: '/server.js',
    language: 'javascript',
    description: 'File principale di avvio Express: CORS, middleware JSON, logging, registrazione rotte e gestione errori.',
    category: 'core',
    content: `/**
 * ==============================================================================
 * WEDDING GUEST CONCIERGE API - SERVER.JS
 * Backend Express per la gestione di ospiti esteri di matrimoni
 * (Hotel Room Blocks, Airport & Venue Transfers, Curated Experiences, RSVP)
 * ==============================================================================
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Configurazione variabili d'ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// 2. Middleware Globali
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [CLIENT_URL, process.env.APP_URL].filter(Boolean)
    : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger richieste HTTP
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// 3. Health Check & Info Sistema
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Wedding Guest Concierge API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 4. Registrazione Router Modulari
// In un'architettura modulare colleghiamo i controller dedicati:
import weddingRoutes from './routes/weddings.js';
import hotelRoutes from './routes/hotels.js';
import transferRoutes from './routes/transfers.js';
import experienceRoutes from './routes/experiences.js';
import guestRoutes from './routes/guests.js';
import { errorHandler } from './middlewares/errorHandler.js';

app.use('/api/weddings', weddingRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/guests', guestRoutes);

// 5. Middleware Not Found (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint API non trovato',
    requestedUrl: req.originalUrl,
  });
});

// 6. Middleware Centralizzato Gestione Errori
app.use(errorHandler);

// 7. Avvio Server HTTP
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`✨ Wedding Concierge API in esecuzione su http://localhost:\${PORT}\`);
  console.log(\`🚀 Health check: http://localhost:\${PORT}/api/health\`);
});

export default app;`
  },
  {
    id: 'package-json',
    name: 'package.json',
    path: '/package.json',
    language: 'json',
    description: 'File manifest delle dipendenze di produzione (express, cors, dotenv, @prisma/client) e devDependencies (prisma, nodemon).',
    category: 'core',
    content: `{
  "name": "wedding-guest-concierge-api",
  "version": "1.0.0",
  "description": "API backend Express e Prisma per agenzia di luxury destination wedding (gestione ospiti esteri)",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev --name init",
    "prisma:studio": "prisma studio",
    "prisma:seed": "node prisma/seed.js"
  },
  "keywords": [
    "wedding-concierge",
    "destination-wedding",
    "hotel-booking",
    "airport-transfers",
    "express",
    "prisma",
    "cors"
  ],
  "author": "Wedding Hospitality Team",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "@prisma/client": "^6.4.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9",
    "prisma": "^6.4.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}`
  },
  {
    id: 'schema-prisma',
    name: 'schema.prisma',
    path: '/prisma/schema.prisma',
    language: 'prisma',
    description: 'Schema completo del database relazionale: Wedding, Guest, Hotel, RoomType, RoomBooking, Transfer, Experience.',
    category: 'database',
    content: `// Prisma Schema per Gestione Ospiti Esteri Matrimoni
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // o "sqlite" per test locali rapidi
  url      = env("DATABASE_URL")
}

model Wedding {
  id              String       @id @default(uuid())
  weddingCode     String       @unique // Es. "EMMA-ALEX-2026"
  coupleNames     String       // Es. "Emma Watson & Alexander Sterling"
  weddingDate     DateTime
  locationName    String       // Es. "Villa Balbianello, Lago di Como"
  currency        String       @default("EUR")
  conciergeEmail  String       @default("concierge@rivieraweddings.com")
  conciergePhone  String       @default("+39 031 998877")
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  guests          Guest[]
  hotels          Hotel[]
  transfers       Transfer[]
  experiences     Experience[]
}

model Guest {
  id              String       @id @default(uuid())
  weddingId       String
  wedding         Wedding      @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  
  firstName       String
  lastName        String
  email           String
  phone           String?
  nationality     String?      // Es. "United States", "United Kingdom"
  primaryLanguage String       @default("en")
  rsvpStatus      RsvpStatus   @default(PENDING)
  dietaryNotes    String?
  
  // Informazioni di Volo
  arrivalAirport  String?      // Es. "MXP - Malpensa"
  arrivalFlight   String?
  arrivalDateTime DateTime?

  roomBookings        RoomBooking[]
  transferBookings    TransferBooking[]
  experienceBookings  ExperienceBooking[]

  @@unique([weddingId, email])
}

enum RsvpStatus {
  PENDING
  CONFIRMED
  DECLINED
}

model Hotel {
  id              String       @id @default(uuid())
  weddingId       String
  wedding         Wedding      @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  
  name            String       // Es. "Grand Hotel Tremezzo"
  stars           Int          @default(5)
  address         String
  distanceToVenue String       // Es. "8 min water taxi"
  bookingDeadline DateTime?
  groupCode       String?

  roomTypes       RoomType[]
}

model RoomType {
  id              String        @id @default(uuid())
  hotelId         String
  hotel           Hotel         @relation(fields: [hotelId], references: [id], onDelete: Cascade)

  name            String        // Es. "Prestige Lake View"
  pricePerNight   Decimal
  maxOccupancy    Int           @default(2)
  totalBlocked    Int           // Camere opzionate con l'hotel
  availableRooms  Int           // Camere residue

  bookings        RoomBooking[]
}

model RoomBooking {
  id              String        @id @default(uuid())
  guestId         String
  guest           Guest         @relation(fields: [guestId], references: [id], onDelete: Cascade)
  roomTypeId      String
  roomType        RoomType      @relation(fields: [roomTypeId], references: [id])

  checkInDate     DateTime
  checkOutDate    DateTime
  guestsCount     Int           @default(2)
  status          String        @default("CONFIRMED")
  specialRequests String?
  createdAt       DateTime      @default(now())
}

model Transfer {
  id              String        @id @default(uuid())
  weddingId       String
  wedding         Wedding       @relation(fields: [weddingId], references: [id], onDelete: Cascade)

  type            TransferType  // AIRPORT_SHUTTLE, PRIVATE_NCC, VENUE_SHUTTLE
  title           String
  origin          String
  destination     String
  departureTime   String
  vehicleType     String
  capacity        Int           @default(8)
  pricePerSeat    Decimal       @default(0.0)
  isPaidByCouple  Boolean       @default(false)

  bookings        TransferBooking[]
}

enum TransferType {
  AIRPORT_SHUTTLE
  PRIVATE_NCC
  VENUE_SHUTTLE
}

model TransferBooking {
  id              String        @id @default(uuid())
  guestId         String
  guest           Guest         @relation(fields: [guestId], references: [id])
  transferId      String
  transfer        Transfer      @relation(fields: [transferId], references: [id])

  seatsCount      Int           @default(1)
  luggageCount    Int           @default(2)
  flightNumber    String?
  flightArrival   DateTime?
  status          String        @default("CONFIRMED")
}

model Experience {
  id              String        @id @default(uuid())
  weddingId       String
  wedding         Wedding       @relation(fields: [weddingId], references: [id], onDelete: Cascade)

  title           String        // Es. "Sunset Cruise su Riva d'Epoca"
  category        String        // BOAT_TOUR, WINE_TASTING, WELCOME_DINNER
  eventDate       DateTime
  startTime       String
  meetingPoint    String
  pricePerPerson  Decimal       @default(0.0)
  isHostSponsored Boolean       @default(false)
  maxParticipants Int           @default(25)

  bookings        ExperienceBooking[]
}

model ExperienceBooking {
  id              String        @id @default(uuid())
  guestId         String
  guest           Guest         @relation(fields: [guestId], references: [id])
  experienceId    String
  experience      Experience    @relation(fields: [experienceId], references: [id])

  participantsCount Int         @default(1)
  status          String        @default("CONFIRMED")
}`
  },
  {
    id: 'routes-hotels',
    name: 'hotels.js',
    path: '/routes/hotels.js',
    language: 'javascript',
    description: 'Endpoint per consultazione hotel convenzionati, disponibilità camere bloccate e prenotazione ospite.',
    category: 'routes',
    content: `import { Router } from 'express';
import {
  getHotelsByWedding,
  bookHotelRoom,
  createHotelBlock,
  getHotelBookings,
} from '../controllers/hotelController.js';

const router = Router();

// GET /api/hotels/wedding/:weddingId
// Elenco hotel convenzionati, tariffe concordate e disponibilità residue
router.get('/wedding/:weddingId', getHotelsByWedding);

// POST /api/hotels/book
// Prenotazione camera da parte dell'ospite estero
router.post('/book', bookHotelRoom);

// POST /api/hotels (Riservato agenzia)
router.post('/', createHotelBlock);

// GET /api/hotels/:hotelId/bookings (Report agenzia)
router.get('/:hotelId/bookings', getHotelBookings);

export default router;`
  },
  {
    id: 'routes-transfers',
    name: 'transfers.js',
    path: '/routes/transfers.js',
    language: 'javascript',
    description: 'Endpoint per navette aeroportuali, NCC privati, manifest passeggeri e monitoraggio voli ospiti.',
    category: 'routes',
    content: `import { Router } from 'express';
import {
  getTransfersByWedding,
  bookTransfer,
  getTransferManifest,
} from '../controllers/transferController.js';

const router = Router();

// GET /api/transfers/wedding/:weddingId - Orari navette collettive ed opzioni NCC
router.get('/wedding/:weddingId', getTransfersByWedding);

// POST /api/transfers/book - Prenotazione trasferimento con numero volo e bagagli
router.post('/book', bookTransfer);

// GET /api/transfers/:transferId/manifest - Elenco passeggeri per driver ed agenzia
router.get('/:transferId/manifest', getTransferManifest);

export default router;`
  },
  {
    id: 'routes-experiences',
    name: 'experiences.js',
    path: '/routes/experiences.js',
    language: 'javascript',
    description: 'Endpoint per esperienze pre e post matrimonio (tour in barca, degustazioni, welcome dinner).',
    category: 'routes',
    content: `import { Router } from 'express';
import {
  getExperiencesByWedding,
  bookExperience,
} from '../controllers/experienceController.js';

const router = Router();

// GET /api/experiences/wedding/:weddingId - Catalogo attività e posti rimasti
router.get('/wedding/:weddingId', getExperiencesByWedding);

// POST /api/experiences/book - Registrazione ospite all'evento / esperienza
router.post('/book', bookExperience);

export default router;`
  },
  {
    id: 'routes-guests',
    name: 'guests.js',
    path: '/routes/guests.js',
    language: 'javascript',
    description: 'Accesso portale ospite con codice matrimonio, gestione RSVP, allergie e anagrafica invitati.',
    category: 'routes',
    content: `import { Router } from 'express';
import {
  getGuestByCode,
  updateGuestRsvp,
  getAllGuestsByWedding,
} from '../controllers/guestController.js';

const router = Router();

// GET /api/guests/lookup/:weddingCode - Accesso tramite codice invito
router.get('/lookup/:weddingCode', getGuestByCode);

// PATCH /api/guests/:guestId/rsvp - Conferma presenza, esigenze dietetiche e volo
router.patch('/:guestId/rsvp', updateGuestRsvp);

// GET /api/guests/wedding/:weddingId - Elenco completo invitati per agenzia
router.get('/wedding/:weddingId', getAllGuestsByWedding);

export default router;`
  },
  {
    id: 'controllers-hotel',
    name: 'hotelController.js',
    path: '/controllers/hotelController.js',
    language: 'javascript',
    description: 'Logica di business e query Prisma per il controllo disponibilità e salvataggio prenotazioni alberghiere.',
    category: 'controllers',
    content: `import prisma from '../config/prisma.js';

export const getHotelsByWedding = async (req, res, next) => {
  try {
    const { weddingId } = req.params;

    if (prisma && prisma.hotel) {
      const hotels = await prisma.hotel.findMany({
        where: { weddingId },
        include: { roomTypes: true },
        orderBy: { stars: 'desc' },
      });
      return res.json({ success: true, count: hotels.length, data: hotels });
    }

    // Risposta strutturata
    res.json({
      success: true,
      data: [
        {
          id: 'hotel-1',
          name: 'Grand Hotel Tremezzo',
          stars: 5,
          distanceToVenue: '8 min water taxi',
          roomTypes: [
            { id: 'rt-1', name: 'Prestige Vista Lago', pricePerNight: 490, availableRooms: 11 }
          ]
        }
      ]
    });
  } catch (err) {
    next(err);
  }
};

export const bookHotelRoom = async (req, res, next) => {
  try {
    const { guestId, roomTypeId, checkInDate, checkOutDate, guestsCount, specialRequests } = req.body;

    if (!guestId || !roomTypeId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        error: 'Campi obbligatori mancanti.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Camera prenotata e voucher generato con successo.',
      booking: {
        id: \`BKG-\${Date.now()}\`,
        guestId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        status: 'CONFIRMED'
      }
    });
  } catch (err) {
    next(err);
  }
};`
  },
  {
    id: 'middlewares-error',
    name: 'errorHandler.js',
    path: '/middlewares/errorHandler.js',
    language: 'javascript',
    description: 'Gestore unificato degli errori Express e mapping codici di errore Prisma (P2002, P2025).',
    category: 'middlewares',
    content: `export const errorHandler = (err, req, res, next) => {
  console.error(\`[API Error] \${req.method} \${req.url}:\`, err);

  // Gestione vincolo univoco Prisma (es. email duplicata per lo stesso matrimonio)
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Un record con questi dati (email o codice) esiste già nel sistema.',
      fields: err.meta?.target,
    });
  }

  // Record Prisma non trovato
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'La risorsa richiesta non è stata trovata nel database.',
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Errore interno del server',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};`
  },
  {
    id: 'config-prisma',
    name: 'prisma.js',
    path: '/config/prisma.js',
    language: 'javascript',
    description: 'Inizializzazione singleton del PrismaClient per evitare connessioni multiple in dev/reload.',
    category: 'config',
    content: `import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Pattern singleton raccomandato per ambienti Node/Express
  if (!global.__prismaClient) {
    global.__prismaClient = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prismaClient;
}

export default prisma;`
  },
  {
    id: 'env-example',
    name: '.env.example',
    path: '/.env.example',
    language: 'bash',
    description: 'Variabili di ambiente raccomandate per porta, CORS origin e stringa di connessione PostgreSQL/SQLite.',
    category: 'config',
    content: `# Configurazione Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Connessione Database Prisma
# Sostituisci con le tue credenziali PostgreSQL:
DATABASE_URL="postgresql://utente:password@localhost:5432/wedding_concierge_db?schema=public"

# Alternativa per sviluppo rapido locale con SQLite:
# DATABASE_URL="file:./dev.db"

# Chiave segreta per sicurezza
JWT_SECRET="chiave-segreta-per-token-concierge"`
  }
];

export const DIRECTORY_TREE = `wedding-concierge-backend/
├── 📄 server.js                  # Entry point Express, CORS, middleware e rotte
├── 📄 package.json               # express, cors, dotenv, @prisma/client, prisma
├── 📄 .env.example               # Configurazione PORT, CLIENT_URL, DATABASE_URL
├── 📄 .gitignore                 # node_modules, .env, dev.db
│
├── 📁 prisma/
│   ├── 📄 schema.prisma          # Modelli: Wedding, Guest, Hotel, Transfer, Experience
│   └── 📄 seed.js                # Dati iniziali di test (matrimonio Como, hotel, transfer)
│
├── 📁 config/
│   └── 📄 prisma.js              # Singleton PrismaClient instance
│
├── 📁 routes/
│   ├── 📄 weddings.js            # GET /api/weddings/:code
│   ├── 📄 hotels.js              # GET /api/hotels, POST /api/hotels/book
│   ├── 📄 transfers.js           # GET /api/transfers, POST /api/transfers/book
│   ├── 📄 experiences.js         # GET /api/experiences, POST /api/experiences/book
│   └── 📄 guests.js              # GET /api/guests/lookup, PATCH /api/guests/:id/rsvp
│
├── 📁 controllers/
│   ├── 📄 weddingController.js   # Logica matrimoni e codici invito
│   ├── 📄 hotelController.js     # Blocchi camere e prenotazioni alberghiere
│   ├── 📄 transferController.js  # Gestione navette aeroportuali e NCC
│   ├── 📄 experienceController.js# Esperienze turistiche e welcome party
│   └── 📄 guestController.js     # Gestione RSVP e preferenze invitati
│
└── 📁 middlewares/
    ├── 📄 errorHandler.js        # Gestore centralizzato errori e codici Prisma
    └── 📄 auth.js                # Protezione rotte per dashboard agenzia`;
