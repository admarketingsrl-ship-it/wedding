import { Router } from 'express';
import {
  getTransfersByWedding,
  bookTransfer,
  getTransferManifest,
} from '../controllers/transferController.js';

const router = Router();

// GET /api/transfers/wedding/:weddingId - Servizi di trasferimento e navette disponibili
router.get('/wedding/:weddingId', getTransfersByWedding);

// POST /api/transfers/book - Prenotazione transfer aeroporto/evento per ospite
router.post('/book', bookTransfer);

// GET /api/transfers/:transferId/manifest - Manifest passeggeri per autista/agenzia
router.get('/:transferId/manifest', getTransferManifest);

export default router;
