import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads, getLead, createLead, updateLead, deleteLead, exportLeadsCSV
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidation } from '../middleware/error';

const router = Router();

router.use(authenticate);

const leadValidation = [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').isIn(['Website', 'Instagram', 'Referral']),
];

router.get('/', getLeads);
router.get('/export', authorize('admin'), exportLeadsCSV);
router.get('/:id', getLead);
router.post('/', leadValidation, handleValidation, createLead);
router.put('/:id', authorize('admin', 'sales'), leadValidation, handleValidation, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
