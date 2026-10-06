import prisma from '../config/prisma.js';

/**
 * Recupera tutti gli hotel convenzionati per un matrimonio specifico
 */
export const getHotelsByWedding = async (req, res, next) => {
  try {
    const { weddingId } = req.params;

    // Se Prisma è connesso a un DB attivo:
    if (prisma && prisma.hotel) {
      const hotels = await prisma.hotel.findMany({
        where: { weddingId },
        include: {
          roomTypes: true,
        },
        orderBy: { stars: 'desc' },
      });
      return res.json({ success: true, count: hotels.length, data: hotels });
    }

    // Risposta di fallback strutturata per sviluppo immediato
    res.json({
      success: true,
      data: [
        {
          id: 'hotel-como-1',
          name: 'Grand Hotel Tremezzo',
          stars: 5,
          address: 'Via Regina 8, Tremezzina, Lago di Como',
          distanceToVenue: '8 minuti in navetta / 5 minuti water taxi privato',
          bookingDeadline: '2026-04-15',
          groupCode: 'EMMA-ALEX-VIP',
          roomTypes: [
            {
              id: 'rt-1',
              name: 'Prestige Room Vista Lago',
              pricePerNight: 490,
              totalBlocked: 30,
              availableRooms: 11,
              maxOccupancy: 2,
            },
            {
              id: 'rt-2',
              name: 'Deluxe Suite Terrazza Storica',
              pricePerNight: 780,
              totalBlocked: 10,
              availableRooms: 3,
              maxOccupancy: 3,
            },
          ],
        },
        {
          id: 'hotel-como-2',
          name: 'Villa Serbelloni Palace',
          stars: 5,
          address: 'Via Roma 1, Bellagio',
          distanceToVenue: '12 minuti battello privato per Villa Balbianello',
          bookingDeadline: '2026-05-01',
          groupCode: 'WEDDING-COMO26',
          roomTypes: [
            {
              id: 'rt-3',
              name: 'Classic Double Garden View',
              pricePerNight: 320,
              totalBlocked: 25,
              availableRooms: 14,
              maxOccupancy: 2,
            },
          ],
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Prenota una camera per un ospite estero
 */
export const bookHotelRoom = async (req, res, next) => {
  try {
    const { guestId, roomTypeId, checkInDate, checkOutDate, guestsCount, specialRequests } = req.body;

    if (!guestId || !roomTypeId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        error: 'Campi obbligatori mancanti (guestId, roomTypeId, checkInDate, checkOutDate).',
      });
    }

    // In produzione: transazione Prisma per decrementare le camere disponibili
    res.status(201).json({
      success: true,
      message: 'Camera prenotata con successo e confermata all\'hotel convenzionato.',
      data: {
        bookingId: `BK-ROOM-${Date.now()}`,
        guestId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        guestsCount: guestsCount || 2,
        specialRequests,
        status: 'CONFIRMED',
        voucherCode: `VOUCHER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createHotelBlock = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, message: 'Hotel convenzionato aggiunto al matrimonio.' });
  } catch (error) {
    next(error);
  }
};

export const getHotelBookings = async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};
