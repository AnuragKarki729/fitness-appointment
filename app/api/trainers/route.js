import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Ensure this path is correct
import Trainer from '@/models/Trainer'; // Import your Trainer model

export async function GET() {
  try {
    await dbConnect(); // Ensure database connection
    const trainers = await Trainer.find({}); // Use the Mongoose model to find trainers
    console.log(trainers);
    return NextResponse.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
