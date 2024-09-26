"use client";
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import Navbar from '../components/Navbar'; // Adjust the import based on your structure
import {useRouter} from 'next/navigation'
import 'bootstrap/dist/css/bootstrap.min.css';

const UserAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trainers, setTrainers] = useState({}); 
    const [userID, setUserID] = useState(null)
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE
    
    useEffect(() => {
        // Check if user is logged in
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        
        console.log(storedUser)
        if (!storedUser._id) {
          // Redirect to login page if not logged in
          router.push('/login');
        }else{
            setUserID(storedUser._id); // Avoid this in render


          console.log("user logged in: ", storedUser)
        
          
        }
      }, []);
    

      

    
      useEffect(() => {
        if (!userID) return; // Prevent fetching if userID is not set

        const fetchAppointments = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/appointments?userID=${userID}`);
                const data = await response.json();
                console.log('data', data);
                const userAppointments = data.filter(appointment => appointment.user._id == userID);
                setAppointments(userAppointments);
                
                // Fetch trainer details for each appointment
                const trainerPromises = data.map(appointment => {
                    if (appointment.trainer) {
                        return fetch(`${apiUrl}/api/trainers/${appointment.trainer._id}`).then(res => res.json());
                    } else {
                        // Return null if trainer is not available
                        return Promise.resolve(null);
                    }
                });
        
                const trainersData = await Promise.all(trainerPromises);
        
                // Create a map of trainers with their names
                const trainersMap = {};
                trainersData.forEach((trainer, index) => {
                    const appointment = data[index];
                    trainersMap[appointment._id] = trainer ? trainer.name : "Trainer Unavailable";
                });
        
                setTrainers(trainersMap);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAppointments();
        
    }, [userID]);

    
    console.log(appointments)
    const handleDeleteAppointment = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/appointments/${id}`, {
                method: 'DELETE',
                mode: 'no-cors',
            });

            if (response.ok) {
                setAppointments(appointments.filter(appointment => appointment._id !== id)); // Update the local state
            } else {
                const errorData = await response.json();
                console.error('Error deleting appointment:', errorData.message);
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

   

    return (
        <div>
            
            <Navbar pageTitle="My Appointments" />
            
            {appointments.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Trainer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{trainers[appointment._id] || 'Trainer Unavailable'}</td>
                                <td>{new Date(appointment.date).toLocaleString()}</td>
                                <td>
                                {appointment.status === 'Completed' ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Completed</span>
                                ) : (
                                    appointment.status
                                )}
                            </td>
                            <td>
                                {appointment.status !== 'Completed' && (
                                    <Button variant="danger" onClick={() => handleDeleteAppointment(appointment._id)}>
                                        Delete
                                    </Button>)}
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No appointments found.</p>
            )}
        </div>
    );
};

export default UserAppointments;
