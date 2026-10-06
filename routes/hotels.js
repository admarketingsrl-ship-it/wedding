import { Router } from 'express';
import {
  getHotelsByWedding,
  createHotelBlock,
  bookHotelRoom,
  getHotelBookings,
} from '../controllers/hotelController.js';

const router = Router();

// GET /api/hotels/wedding/:weddingId - Lista hotel convenzionati e disponibilità camere
router.get('/wedding/:weddingId', getHotelsByWedding);

// POST /api/hotels/:hotelId/book - Prenotazione camera da parte dell'ospite estero
router.post('/book', bookHotelRoom);

// POST /api/hotels - Aggiunta nuovo hotel/blocco camere (Agenzia)
router.post('/', createHotelBlock);

// GET /api/hotels/:hotelId/bookings - Report prenotazioni camere (Agenzia)
router.get('/:hotelId/bookings', getHotelBookings);

export default router;
