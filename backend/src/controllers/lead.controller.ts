import { Response } from 'express';
import { FilterQuery } from 'mongoose';
import { createObjectCsvStringifier } from 'csv-writer';
import { Lead, ILeadDocument } from '../models/Lead';
import { AuthRequest } from '../middleware/auth';
import { LeadStatus, LeadSource, PaginationMeta } from '../types';

const DEFAULT_LIMIT = 10;

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, source, search, sort = 'latest', page = 1, limit = DEFAULT_LIMIT } = req.query;

  const filter: FilterQuery<ILeadDocument> = {};

  if (status) filter.status = status as LeadStatus;
  if (source) filter.source = source as LeadSource;
  if (search) {
    const regex = new RegExp(String(search), 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum).populate('createdBy', 'name email'),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);
  const meta: PaginationMeta = {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1,
  };

  res.json({ success: true, data: leads, meta });
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, data: lead });
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.create({ ...req.body, createdBy: req.user?.userId });
  res.status(201).json({ success: true, data: lead });
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, data: lead });
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    res.status(404).json({ success: false, message: 'Lead not found' });
    return;
  }
  res.json({ success: true, message: 'Lead deleted' });
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, source, search } = req.query;
  const filter: FilterQuery<ILeadDocument> = {};

  if (status) filter.status = status as LeadStatus;
  if (source) filter.source = source as LeadSource;
  if (search) {
    const regex = new RegExp(String(search), 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'status', title: 'Status' },
      { id: 'source', title: 'Source' },
      { id: 'createdAt', title: 'Created At' },
    ],
  });

  const records = leads.map((l) => ({
    name: l.name,
    email: l.email,
    status: l.status,
    source: l.source,
    createdAt: new Date(l.createdAt).toISOString(),
  }));

  const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.send(csv);
};
