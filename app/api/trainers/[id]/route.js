
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // Ensure this path is correct
import Trainer from '@/models/Trainer';
import { corsMiddleware } from '@/lib/corsMiddleware';

export const GET = corsMiddleware(async(request, { params }) => {
  const { id } = params;
  console.log("ID: " ,{id})
  
  try {
    await dbConnect(); // Ensure database connection
    const trainer = await Trainer.findById(id).populate(); // Use populate if needed
    console.log({ trainer });
    
    if (!trainer) {
      return NextResponse.json({ message: 'Trainer not found' }, { status: 404 });
    }
    
    return NextResponse.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
})

export const DELETE = corsMiddleware(async(request, { params })=> {
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
})

export const PUT = corsMiddleware(async(req, { params }) => {
  await dbConnect();

  const { id } = params; // Get trainer ID from URL params
  const data = await req.json(); // Get updated data from the request body

  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(id, data, { new: true });
    if (!updatedTrainer) {
      return new Response(JSON.stringify({ message: 'Trainer not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Trainer updated successfully', trainer: updatedTrainer }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error updating trainer', error: error.message }), { status: 500 });
  }
})

