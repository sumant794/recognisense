import { Router } from 'express';
import recognitionController from '../controllers/recognition.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';   

const router = Router();

// Saare routes pe authentication
router.use(authenticate);

// GET /api/recognitions/my-history
// Employee apni history dekhe
router.get(
    '/my-history',
    recognitionController.getMyHistory
);

// GET /api/recognitions/stats
router.get(
    '/stats',
    recognitionController.getStats
);

// GET /api/recognitions/stats
router.get(
    '/',
    authorize('admin'),
    recognitionController.getAllRecords
);

// POST /api/recognitions
// AI service yeh call karega
router.post(
    '/',
    recognitionController.createRecord
);

export default router;