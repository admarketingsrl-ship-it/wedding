/**
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

// Carica variabili d'ambiente da .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ==============================================================================
// MIDDLEWARE GLOBALI
// ==============================================================================

// Configurazione CORS (supporta chiamate dal portale ospiti e dashboard agenzia)
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

// Logger middleware per le richieste
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ==============================================================================
// ROTTE DI BASE & HEALTH CHECK
// ==============================================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Wedding Guest Concierge API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Informazioni sull'architettura API
app.get('/api/info', (req, res) => {
  res.status(200).json({
    appName: 'Wedding Guest Concierge API',
    description: 'API backend per agenzia di luxury wedding destination e gestione ospiti esteri',
    modules: [
      { name: 'Weddings', endpoint: '/api/weddings', description: 'Gestione matrimoni, codici invito e dettagli evento' },
      { name: 'Guests', endpoint: '/api/guests', description: 'Anagrafica ospiti esteri, passaporti, preferenze e diete' },
      { name: 'Hotels', endpoint: '/api/hotels', description: 'Blocchi camere convenzionate, tariffe e prenotazioni' },
      { name: 'Transfers', endpoint: '/api/transfers', description: 'Navette aeroporto, NCC privati, monitoraggio voli' },
      { name: 'Experiences', endpoint: '/api/experiences', description: 'Tour enogastronomici, gite in barca, welcome dinner' },
    ]
  });
});

// ==============================================================================
// IMPORT & REGISTRAZIONE ROTTE MODULARI
// ==============================================================================

// In un'applicazione tipica, importiamo i router modulari da ./routes/
// Per facilitare l'avvio rapido anche senza database configurato,
// registriamo qui gli endpoint principali con fallback controllato.

// 1. Matrimoni & Codici invito
app.get('/api/weddings/:weddingCode', async (req, res, next) => {
  try {
    const { weddingCode } = req.params;
    // Query Prisma: const wedding = await prisma.wedding.findUnique({ where: { weddingCode } });
    res.json({
      success: true,
      data: {
        id: 'wed-como-2026',
        weddingCode: weddingCode.toUpperCase(),
        coupleNames: 'Emma Watson & Alexander Sterling',
        venue: 'Villa Balbianello, Lago di Como (Italia)',
        dates: {
          start: '2026-06-18',
          weddingDay: '2026-06-20',
          end: '2026-06-22'
        },
        primaryCurrency: 'EUR',
        conciergeContact: {
          email: 'concierge@rivieraweddings.com',
          phone: '+39 031 998877',
          whatsapp: '+39 340 1234567'
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// 2. Hotel & Blocchi Camere
app.get('/api/weddings/:weddingId/hotels', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        {
          id: 'hotel-1',
          name: 'Grand Hotel Tremezzo',
          stars: 5,
          location: 'Tremezzina, Lago di Como',
          distanceToVenue: '10 min (Water Taxi o Shuttle)',
          negotiatedRate: 480,
          currency: 'EUR',
          roomTypes: ['Prestige Lake View Room', 'Deluxe Garden Suite'],
          allottedRooms: 35,
          availableRooms: 12,
          bookingDeadline: '2026-04-15'
        },
        {
          id: 'hotel-2',
          name: 'Boutique Hotel Bellagio Resort',
          stars: 4,
          location: 'Bellagio',
          distanceToVenue: '15 min (Traghetto / Shuttle dedicato)',
          negotiatedRate: 260,
          currency: 'EUR',
          roomTypes: ['Classic Double', 'Superior Terrace'],
          allottedRooms: 40,
          availableRooms: 19,
          bookingDeadline: '2026-04-30'
        }
      ]
    });
  } catch (err) {
    next(err);
  }
});

// 3. Prenotazione Camera da parte dell'Ospite
app.post('/api/bookings/room', async (req, res, next) => {
  try {
    const { guestId, hotelId, roomType, checkIn, checkOut, specialRequests } = req.body;
    
    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Dati incompleti: hotelId, checkIn e checkOut sono obbligatori.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Richiesta di prenotazione camera registrata con successo.',
      booking: {
        id: `rm-bkg-${Date.now()}`,
        guestId: guestId || 'guest-demo',
        hotelId,
        roomType: roomType || 'Standard',
        checkIn,
        checkOut,
        specialRequests: specialRequests || '',
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

// 4. Trasferimenti Aeroportuali & Navette Evento
app.get('/api/weddings/:weddingId/transfers', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        {
          id: 'tr-1',
          type: 'AIRPORT_SHUTTLE_GROUP',
          title: 'Navetta di Gruppo: Milano Malpensa (MXP) → Tremezzina',
          pickupLocation: 'Milano Malpensa Terminal 1',
          dropoffLocation: 'Hotel convenzionati (Tremezzo & Bellagio)',
          date: '2026-06-18',
          departureTimes: ['11:30', '15:00', '19:30'],
          pricePerSeat: 45,
          vehicle: 'Mercedes Sprinter Luxury 16 posti'
        },
        {
          id: 'tr-2',
          type: 'PRIVATE_NCC',
          title: 'NCC Privato Dedicato (Qualsiasi Aeroporto/Orario)',
          pickupLocation: 'Milano Malpensa (MXP) / Milano Linate (LIN) / Bergamo (BGY)',
          dropoffLocation: 'Alloggio dell\'ospite',
          date: 'Flessibile',
          pricePerVehicle: 220,
          vehicle: 'Mercedes Classe E / V-Class (fino a 6 passeggeri)'
        },
        {
          id: 'tr-3',
          type: 'WEDDING_DAY_SHUTTLE',
          title: 'Navetta Cerimonia & Party (Inclusa per tutti gli ospiti)',
          pickupLocation: 'Hotel Tremezzo & Hotel Bellagio',
          dropoffLocation: 'Villa Balbianello',
          date: '2026-06-20',
          departureTimes: ['15:30', '16:00'],
          returnTimes: ['00:30', '02:00', '03:30'],
          pricePerSeat: 0,
          included: true
        }
      ]
    });
  } catch (err) {
    next(err);
  }
});

// 5. Prenotazione Trasferimento
app.post('/api/bookings/transfer', async (req, res, next) => {
  try {
    const { guestId, transferId, flightNumber, arrivalTime, passengersCount, luggageCount } = req.body;

    res.status(201).json({
      success: true,
      message: 'Trasferimento prenotato e assegnato al dispatcher concierge.',
      booking: {
        id: `tr-bkg-${Date.now()}`,
        guestId: guestId || 'guest-demo',
        transferId,
        flightNumber: flightNumber || 'N/A',
        arrivalTime: arrivalTime || 'N/A',
        passengersCount: passengersCount || 1,
        luggageCount: luggageCount || 2,
        status: 'DISPATCHED',
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

// 6. Esperienze Turistiche & Pre/Post Wedding
app.get('/api/weddings/:weddingId/experiences', async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: [
        {
          id: 'exp-1',
          title: 'Sunset Champagne Boat Cruise su Riva Vintage',
          date: '2026-06-19',
          time: '18:00 - 20:30',
          duration: '2.5 ore',
          location: 'Imbarcadero Tremezzo → Villa Balbianello → Bellagio',
          price: 110,
          maxSpots: 24,
          availableSpots: 6,
          includes: 'Skipper privato, prosecco DOCG, finger food tipico comasco'
        },
        {
          id: 'exp-2',
          title: 'Welcome Pizza & Wine Party all\'Aperto',
          date: '2026-06-19',
          time: '20:30 - 23:30',
          duration: 'Serata',
          location: 'Terrazza Storica Bellagio',
          price: 0,
          includedByCouple: true,
          maxSpots: 120,
          availableSpots: 32,
          includes: 'Forno a legna a vista, degustazione vini locali e musica dal vivo'
        },
        {
          id: 'exp-3',
          title: 'Masterclass Pasta & Tiramisù Fatta in Casa',
          date: '2026-06-21',
          time: '11:00 - 14:00',
          duration: '3 ore',
          location: 'Agriturismo vista lago',
          price: 85,
          maxSpots: 18,
          availableSpots: 4,
          includes: 'Lezione con chef locale, pranzo completo degustazione e ricettario'
        }
      ]
    });
  } catch (err) {
    next(err);
  }
});

// ==============================================================================
// GESTIONE ERRORI & 404
// ==============================================================================

// Gestione rotte inesistenti
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trovato',
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// Middleware centralizzato di gestione errori
app.use((err, req, res, next) => {
  console.error('🔥 Errore interno server:', err.stack || err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Errore interno del server',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ==============================================================================
// AVVIO DEL SERVER
// ==============================================================================

// Se avviato direttamente come script Node:
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`✨ Wedding Guest Concierge Server Express avviato!`);
    console.log(`📍 Porta: http://localhost:${PORT}`);
    console.log(`🚀 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Info Moduli: http://localhost:${PORT}/api/info`);
    console.log(`======================================================\n`);
  });
}

export default app;
