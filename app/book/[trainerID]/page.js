"use client"; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DatePicker, Space } from 'antd'; 
import dayjs from 'dayjs';
import Navbar from '@/app/components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Button} from 'react-bootstrap'

function BookScreen() {
    const { trainerID } = useParams();
    console.log('trainerID: ', trainerID) // Get trainer ID from URL
    const [trainer, setTrainer] = useState(null); // Trainer details
    const [appointments, setAppointments] = useState([]); // Existing appointments
    const [selectedDate, setSelectedDate] = useState(null); // Selected date/time by user
    const [availabilityMessage, setAvailabilityMessage] = useState(""); // Availability message
    const [bookingSuccess, setBookingSuccess] = useState(false); // State to track booking success
    const [userID, setUserID] = useState(null); // State to store userID
    const [username, setUsername] = useState(""); // State to store username
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE

    useEffect(() => {
        // Fetch trainer details and their appointments
        const fetchData = async () => {
            console.log('API URL:', `${apiUrl}/api/trainers/${trainerID}`);
            try {
                const trainerResponse = await fetch(`${apiUrl}/api/trainers/${trainerID}`);
                const trainerData = await trainerResponse.json();
                setTrainer(trainerData);

                const appointmentsResponse = await fetch(`${apiUrl}/api/appointments?trainerID=${trainerID}`);
                const appointmentsData = await appointmentsResponse.json();
                setAppointments(appointmentsData);
            } catch (error) {
                console.error('Error fetching trainer or appointments:', error);
            }
        };

        fetchData();

        // Get user info from localStorage
        const user = JSON.parse(localStorage.getItem('currentUser'));
        console.log(user.username)
        if (user.username && user._id) {
            setUserID(user._id);
             // Set userID
            setUsername(user.username); // Set username
        }
    }, [trainerID]); // Runs once when component mounts and when trainerID changes

    // Handle date selection
    const handleDateChange = (date) => {
        setSelectedDate(date);

        checkAvailability(date);
        
    };

    // Check if the selected date is available
    const checkAvailability = (date) => {
        if (!date) return;
        
        const isBooked = appointments.some(appointment => {
            const appointmentDate = dayjs(appointment.date);
            return appointmentDate.isSame(date, 'minute');
        });

        if (isBooked) {
            setAvailabilityMessage(`Trainer busy on ${date.format('YYYY-MM-DD HH:mm')}`);
        } else {
            setAvailabilityMessage(`Trainer available on ${date.format('YYYY-MM-DD HH:mm')}`);
            
        }
    };

    const disabledHours = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            if (i < 5 || i > 21) {
                hours.push(i);
            }
        }
        return hours;
    };
    const today = dayjs();
    const disabledDate = (current) => {
    return current && current < today.startOf('day');
};
    
    const handleBooking = async () => {
        if (!selectedDate) {
            alert("Please select a date and time.");
            return;
        }
    
        if (!userID) {
            alert("User not logged in.");
            return;
        }
    
        // Fetch trainer's busy dates and existing appointments
        const trainerResponse = await fetch(`${apiUrl}/api/trainers/${trainerID}`);
        const trainerData = await trainerResponse.json();
        
        const busyDates = trainerData.busyDates || [];
        const existingAppointmentsResponse = await fetch(`${apiUrl}/api/appointments?trainerID=${trainerID}`);
        const existingAppointments = await existingAppointmentsResponse.json();

        
        const isBusyDate = busyDates.some(busyDate => 
            dayjs(busyDate).isSame(selectedDate, 'day')
        );
    
    
        const isConflictingAppointment = existingAppointments.some(appointment => {
            const appointmentDate = dayjs(appointment.date);
            return (
                appointmentDate.isSame(selectedDate, 'minute')
            );
        });
    
        if (isBusyDate || isConflictingAppointment) {
            alert("This date and time is not available for booking.");
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/appointments`, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trainerID,
                    userID,
                    date: selectedDate.toISOString(),
                }),
            });
    
            if (response.ok) {
                setBookingSuccess(true);
                setAvailabilityMessage("Booking successful!");
            } else {
                const result = await response.json();
                setAvailabilityMessage(result.message || "Error booking the trainer.");
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            setAvailabilityMessage("Error booking the trainer.");
        }
    };
    

    return (
        <div>
        <Navbar pageTitle="Book Trainer" />
        <h1 style={{ marginTop: '40px' }}></h1>

        {trainer && username ? (
            <Card style={{ width: '400px', margin: 'auto', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                <Card.Body>
                    <Card.Title>Trainer: {trainer.name}</Card.Title>
                    <Card.Text>
                        <strong>Details:</strong> {trainer.description}
                    </Card.Text>
                    <Card.Text>
                        <strong>Price:</strong> ${trainer.price}
                    </Card.Text>

                    {/* Display User Name */}
                    {username && <Card.Text><strong>User:</strong> {username}</Card.Text>}

                    <Space direction="vertical" size={12}>
                <DatePicker
                    showTime={{ format: 'HH:mm', minuteStep: 60 }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={handleDateChange}
                    disabledHours={disabledHours}
                    disabledDate={disabledDate}
                />
                <p style={{ fontStyle: 'italic' }}>
                    Trainers can be booked 5:00 AM to 9:00 PM
                </p>
            </Space>

                    {availabilityMessage && <p>{availabilityMessage}</p>}

                    <Button 
                        variant="primary" 
                        onClick={handleBooking} 
                        disabled={!selectedDate || bookingSuccess}
                        style={{ marginTop: '10px' }}
                    >
                        {bookingSuccess ? "Booking Confirmed" : "Book Appointment"}
                    </Button>
                </Card.Body>
            </Card>
        ) : (
            <p>Loading trainer details...</p>
        )}
    </div>
);
}

export default BookScreen;
