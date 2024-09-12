"use client"
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Ensure this path is correct
import Trainer from '@/models/Trainer';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect(); // Ensure database connection
    const trainer = await Trainer.findById(id).populate('category'); // Use populate if needed
    console.log({ trainer });
    
    if (!trainer) {
      return NextResponse.json({ message: 'Trainer not found' }, { status: 404 });
    }
    
    return NextResponse.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    await dbConnect(); // Ensure database connection
    const result = await Trainer.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ message: 'Trainer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}