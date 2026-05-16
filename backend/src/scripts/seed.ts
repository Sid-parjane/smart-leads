/**
 * Seed script — creates admin + sales user + 25 sample leads
 * Run: npx ts-node src/scripts/seed.ts
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

dotenv.config();

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const SOURCES = ['Website', 'Instagram', 'Referral'] as const;

const SAMPLE_NAMES = [
  'Rahul Sharma', 'Priya Mehta', 'Amit Patel', 'Sneha Iyer', 'Raj Gupta',
  'Ananya Singh', 'Vikram Nair', 'Pooja Reddy', 'Rohit Jain', 'Divya Agarwal',
  'Karan Malhotra', 'Meena Das', 'Suresh Kumar', 'Asha Pillai', 'Nitesh Rao',
  'Kavita Desai', 'Manish Shah', 'Ritu Bhatt', 'Ajay Srivastava', 'Neha Tiwari',
  'Sanjay Pandey', 'Deepa Nambiar', 'Harish Verma', 'Swati Kapoor', 'Mohan Joshi',
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({ name: 'Admin User', email: 'admin@smartleads.dev', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Sales User', email: 'sales@smartleads.dev', password: 'sales123', role: 'sales' });

  const leads = SAMPLE_NAMES.map((name, i) => ({
    name,
    email: `${name.toLowerCase().replace(' ', '.')}${i}@example.com`,
    status: STATUSES[i % STATUSES.length],
    source: SOURCES[i % SOURCES.length],
    createdBy: admin._id,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
  }));

  await Lead.insertMany(leads);

  console.log('✅ Seeded:');
  console.log('   admin@smartleads.dev / admin123  (role: admin)');
  console.log('   sales@smartleads.dev / sales123  (role: sales)');
  console.log(`   ${leads.length} leads`);
  await mongoose.disconnect();
};

seed().catch((e) => { console.error(e); process.exit(1); });
