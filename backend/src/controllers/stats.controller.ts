import { Response } from 'express';
import { Lead } from '../models/Lead';
import { AuthRequest } from '../middleware/auth';

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  const [total, statusCounts, sourceCounts] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
  ]);

  const byStatus = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
  const bySource = Object.fromEntries(sourceCounts.map((s) => [s._id, s.count]));

  res.json({
    success: true,
    data: { total, byStatus, bySource },
  });
};
