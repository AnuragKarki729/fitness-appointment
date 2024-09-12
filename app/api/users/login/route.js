import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';  // Adjust the path to your connection file
import User from '../../../models/User';  // Adjust the path to your model

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    await connectToDatabase();
    const user = await User.findOne({ email, password });  // Directly check the password (not recommended for production)
    
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'Invalid Email or Password' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}