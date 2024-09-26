import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Trainer from '@/models/Trainer';
import { corsMiddleware } from '@/lib/corsMiddleware';
const apiUrl = process.env.NEXT_PUBLIC_API_BASE
export const DELETE = corsMiddleware(async(req, { params })=> {
  await dbConnect();
  const { id } = params; // Appointment ID from the URL

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return new Response(JSON.stringify({ message: 'Appointment not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Appointment deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error deleting appointment', error: error.message }), { status: 500 });
  }
})

export const GET = (async(req, { params }) => {
    await dbConnect();
    const { id } = params; // Appointment ID from the URL
  
    try {
      const appointment = await Appointment.findById(id).populate('trainer', 'name').populate('user', 'username'); 
  
      if (!appointment) {
        return new Response(JSON.stringify({ message: 'Appointment not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify(appointment), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error fetching appointment', error: error.message }), { status: 500 });
    }
  })

  export const PUT = (async(req, { params }) => {
    await dbConnect();
    const { id } = params; // Appointment ID from the URL

    try {
        const body = await req.json();
        const { status } = body; // Assuming you're updating the status

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status }, // Update only the status field
            { new: true } // Return the updated document
        );

        if (!updatedAppointment) {
            return new Response(JSON.stringify({ message: 'Appointment not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedAppointment), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error updating appointment', error: error.message }), { status: 500 });
    }
})
  
  
export const POST = (async(req) =>{
    await dbConnect(); // Connect to MongoDB
  
    const body = await req.json();
    const { trainerID, userID, date } = body;
  
    const clientNameResponse = await fetch(`${apiUrl}/api/users/${userID}`);
      const clientNameData = await clientNameResponse.json();
  
      const clientName = clientNameData.username;
    
    console.log(trainerID, " ", userID, " ", date)
  
  
    if (!trainerID || !userID || !date) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
      });
    }
  
    try {
      const appointmentDate = new Date(date);
  
      // Check if the trainer is already booked during the selected time
      const conflictingAppointment = await Appointment.findOne({
        trainer: trainerID,
        date: appointmentDate,
      });
  
      if (conflictingAppointment) {
        return new Response(
          JSON.stringify({
            message: `Trainer is already booked at ${appointmentDate.toISOString()}`,
          }),
          { status: 409 }
        );
      }
  
      // Create new appointment
      const newAppointment = new Appointment({
        trainer: trainerID,
        user: userID,
        date: appointmentDate,
        status: 'Confirmed',
        
      });
  
      await newAppointment.save();
  
      return new Response(JSON.stringify({ message: 'Appointment created successfully', appointment: newAppointment }), {
        status: 201,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error creating appointment', error: error.message }), {
        status: 500,
      });
    }
  })
  