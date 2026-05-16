import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JwtPayload, UserRole } from '../types';

const signToken = (userId: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET!;
  const payload: JwtPayload = { userId, role };
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as import('jsonwebtoken').SignOptions['expiresIn'];
return jwt.sign(payload, secret, { expiresIn });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ success: false, message: 'Email already registered' });
    return;
  }

  const user = await User.create({ name, email, password, role: role || 'sales' });
  const token = signToken(user._id.toString(), user.role);

  res.status(201).json({
    success: true,
    data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const token = signToken(user._id.toString(), user.role);

  res.json({
    success: true,
    data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
  });
};

export const getMe = async (req: Request & { user?: JwtPayload }, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId).select('-password');
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, data: user });
};
