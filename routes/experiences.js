import { Router } from 'express';
import {
  getExperiencesByWedding,
  bookExperience,
} from '../controllers/experienceController.js';

const router = Router();

// GET /api/experiences/wedding/:weddingId - Catalogo esperienze pre e post matrimonio
router.get('/wedding/:weddingId', getExperiencesByWedding);

// POST /api/experiences/book - Iscrizione ospite ad un'esperienza
router.post('/book', bookExperience);

export default router;
