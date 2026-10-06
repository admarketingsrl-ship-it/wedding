import { Router } from 'express';
import {
  getGuestByCode,
  updateGuestRsvp,
  getAllGuestsByWedding,
} from '../controllers/guestController.js';

const router = Router();

// GET /api/guests/lookup/:weddingCode/:guestEmail - Accesso portale ospite
router.get('/lookup/:weddingCode', getGuestByCode);

// PATCH /api/guests/:guestId/rsvp - Aggiornamento RSVP e dettagli di viaggio
router.patch('/:guestId/rsvp', updateGuestRsvp);

// GET /api/guests/wedding/:weddingId - Elenco completo ospiti (Dashboard agenzia)
router.get('/wedding/:weddingId', getAllGuestsByWedding);

export default router;
