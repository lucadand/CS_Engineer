'use server'

import { connectToDatabase } from '@/app/lib/mongodb';
import CSEngineer from '@/app/models/csEngineer';

export async function getTodayCSEngineer() {
  try {
    await connectToDatabase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const engineer = await CSEngineer.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    return engineer || { engineerName: 'Not Assigned', status: 'available', availableAt: null };
  } catch (error) {
    console.error('Failed to fetch CS Engineer:', error);
    return { engineerName: 'Not Assigned', status: 'available', availableAt: null };
  }
}

export async function assignCSEngineer(engineerName: string, date: Date) {
  try {
    await connectToDatabase();
    
    const assignedDate = new Date(date);
    assignedDate.setHours(0, 0, 0, 0);

    const engineer = await CSEngineer.findOneAndUpdate(
      { date: assignedDate },
      { 
        $set: { 
          engineerName,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    return engineer;
  } catch (error) {
    console.error('Failed to assign CS Engineer:', error);
    throw new Error('Failed to assign CS Engineer');
  }
} 