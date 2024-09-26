"use client";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const TrainerPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [busyDates, setBusyDates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBusyDate, setNewBusyDate] = useState('');
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.isTrainer) {
            router.push('/login');
        } else {
            fetchAppointments(currentUser._id);
            fetchBusyDates(currentUser._id);
            
        }
    }, [router]);

    const fetchAppointments = async (trainerID) => {
        const response = await fetch(`${apiUrl}/api/appointments?trainerID=${trainerID}`);
        const data = await response.json();
        console.log(data); 
        setAppointments(data);
    };

    const fetchBusyDates = async (trainerID) => {
        const response = await fetch(`${apiUrl}/api/trainers/${trainerID}`);
        const data = await response.json();
        setBusyDates(data.busyDates);
    };

    const handleStatusUpdate = async (appointmentID, newStatus) => {
        const response = await fetch(`${apiUrl}/api/appointments/${appointmentID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && currentUser._id) {
            fetchAppointments(currentUser._id); // Refresh appointments list
        }}
    };

    const handleAddBusyDate = async () => {
        const trainerID = JSON.parse(localStorage.getItem('currentUser'))._id;
        const response = await fetch(`${apiUrl}/api/trainers/${trainerID}/busy-dates`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: newBusyDate }),
        });

        if (response.ok) {
            fetchBusyDates(trainerID); // Refresh busy dates
            setShowModal(false); // Close modal
            setNewBusyDate(''); // Reset input
        }
    };

    return (
        <>
        <Navbar pageTitle = "Trainer Panel" />
        <div className="container mt-5">
            <h1>Your Appointments</h1>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Client Name</th>
                        <th>Appointment Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment._id}>
                            <td>{appointment.user.username}</td>
                            <td>{new Date(appointment.date).toLocaleString()}</td>
                            <td>{appointment.status}</td>
                            <td>
                                <Button variant="success" onClick={() => handleStatusUpdate(appointment._id, 'Completed')}>Mark as Completed</Button>
                                <Button variant="warning" onClick={() => handleStatusUpdate(appointment._id, 'Pending')}>Mark as Pending</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h2>Manage Busy Dates</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>Add Busy Date</Button>

            <h3>Current Busy Dates</h3>
            {busyDates.length > 0 ? (
                <ul>
                    {busyDates.map((date, index) => (
                        <li key={index}>{new Date(date).toLocaleDateString()}</li>
                    ))}
                </ul>
            ) : (
                <p>No busy dates added.</p>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Busy Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="busyDate">
                            <Form.Label>Busy Date</Form.Label>
                            <Form.Control type="date" value={newBusyDate} onChange={(e) => setNewBusyDate(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleAddBusyDate}>Add Busy Date</Button>
                </Modal.Footer>
            </Modal>
        </div>
        </>
    );
};

export default TrainerPage;
