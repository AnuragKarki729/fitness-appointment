"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/admin.module.css';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Container, Button, Modal, Table, Nav } from 'react-bootstrap'

const AdminPage = () => {
    const [trainers, setTrainers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE

    useEffect(() => {
        // Check if user is logged in and is an admin
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser || !currentUser.isAdmin) {
            // Redirect to login page if not admin or not logged in
            router.push('/login');
        }
    }, [router]);

    const [newTrainerData, setNewTrainerData] = useState({
        name: '',
        age: '',
        expYears: '',
        phone: '',
        price: '',
        imgUrl: '',
        type: 'Personal',
        description: ''
    });
    const [editTrainerData, setEditTrainerData] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);


    const openUpdateModal = (trainer) => {
        setEditTrainerData(trainer);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditTrainerData(null); // Clear the data when closing
    };

    // Handle update submission
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/api/trainers/${editTrainerData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editTrainerData),
            });

            if (response.ok) {
                fetchTrainers(); // Refresh trainers list
                closeModal(); // Close the modal
            } else {
                const errorData = await response.json();
                console.error('Error updating trainer:', errorData.message);
            }
        } catch (error) {
            console.error('Error updating trainer:', error);
        }
    };
    // Fetch trainers from the API
    const fetchTrainers = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/trainers`);
            const data = await response.json();
            setTrainers(data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };

    // Fetch appointments from the API
    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/appointments`);
            const data = await response.json();
            setAppointments(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    // Fetch users and their appointments from the API
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/users`);
            const userData = await response.json();
            setUsers(userData);
            console.log("Users: ", userData)
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Use effect to fetch trainers, appointments, and users when the page loads
    useEffect(() => {
        fetchTrainers();
        fetchAppointments();
        fetchUsers();
    }, []);

    // Handle input changes for the create form
    const handleNewTrainerChange = (e) => {
        setNewTrainerData({
            ...newTrainerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDeleteTrainer = async (trainerId) => {
        if (window.confirm("Are you sure you want to delete this trainer?")) {
            try {
                const response = await fetch(`${apiUrl}/api/trainers/${trainerId}`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    // Optionally, refresh the trainer list or remove the deleted trainer from the state
                    alert("Trainer deleted successfully!");
                    // You might want to call a function to refresh the trainers list here
                    fetchTrainers(); // Assuming you have this function to fetch updated trainers
                } else {
                    alert("Failed to delete the trainer.");
                }
            } catch (error) {
                console.error("Error deleting trainer:", error);
                alert("An error occurred while deleting the trainer.");
            }
        }
    };

    // Handle form submission to create a new trainer
    const handleCreateTrainerSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/api/trainers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newTrainerData,
                    imgUrl: newTrainerData.imgUrl.split(',').map((url) => url.trim()), // Convert string to array
                }),
            });

            if (response.ok) {
                console.log('Trainer created successfully');
                fetchTrainers(); // Refresh trainers list after creation
                setNewTrainerData({
                    name: '',
                    age: '',
                    expYears: '',
                    phone: '',
                    price: '',
                    imgUrl: '',
                    type: 'Personal',
                    description: ''
                }); // Reset form
            } else {
                const errorData = await response.json();
                console.error('Error creating trainer:', errorData.message);
            }
        } catch (error) {
            console.error('Error creating trainer:', error);
        }
    };

    // Handle delete appointment
    const deleteAppointment = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/api/appointments/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Appointment deleted successfully');
                fetchAppointments(); // Refresh appointments list after deletion
            } else {
                const errorData = await response.json();
                console.error('Error deleting appointment:', errorData.message);
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <>
        <Navbar pageTitle={'Admin Panel'}/>
        <Container className={styles.adminContainer}>
            
            <h1>Admin Panel</h1>

            {/* Manage Trainers Section */}
            <section className={styles.manageSection}>
                <h2>Manage Trainers</h2>
                <Form onSubmit={handleCreateTrainerSubmit} className={styles.trainerForm}>
                    <Form.Group controlId="trainerName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={newTrainerData.name} onChange={handleNewTrainerChange} required />
                    </Form.Group>

                    <Form.Group controlId="trainerAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" name="age" value={newTrainerData.age} onChange={handleNewTrainerChange} required />
                    </Form.Group>

                    <Form.Group controlId="trainerExpYears">
                        <Form.Label>Years of Experience</Form.Label>
                        <Form.Control type="number" name="expYears" value={newTrainerData.expYears} onChange={handleNewTrainerChange} required />
                    </Form.Group>

                    <Form.Group controlId="trainerPhone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="number" name="phone" value={newTrainerData.phone} onChange={handleNewTrainerChange} required />
                    </Form.Group>

                    <Form.Group controlId="trainerPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" name="price" value={newTrainerData.price} onChange={handleNewTrainerChange} required />
                    </Form.Group>

                    <Form.Group controlId="trainerImgUrl">
                        <Form.Label>Image URLs (comma-separated)</Form.Label>
                        <Form.Control type="text" name="imgUrl" value={newTrainerData.imgUrl} onChange={handleNewTrainerChange} />
                    </Form.Group>

                    <Form.Group controlId="trainerType">
                        <Form.Label>Type</Form.Label>
                        <Form.Control as="select" name="type" value={newTrainerData.type} onChange={handleNewTrainerChange}>
                            <option value="Personal">Personal</option>
                            <option value="Group">Group</option>
                            <option value="CrossFit">CrossFit</option>
                            <option value="Physical therapy">Physical therapy</option>
                            <option value="Bodybuilding">Bodybuilding</option>
                            <option value="Athleticism">Athleticism</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="trainerDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={newTrainerData.description} onChange={handleNewTrainerChange} required />
                    </Form.Group>

                    <Button type="submit">Create Trainer</Button>
                </Form>

                <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Trainer Name</th>
                    <th>Type</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {trainers.length > 0 ? (
                    trainers.map(trainer => (
                        <tr key={trainer._id}>
                            <td>{trainer.name}</td>
                            <td>{trainer.type}</td>
                            <td>
                                <Button variant="warning" onClick={() => openUpdateModal(trainer)}>
                                    Update
                                </Button>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteTrainer(trainer._id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No trainers found.</td>
                    </tr>
                )}
            </tbody>
        </Table>

                

                <Modal show={isModalOpen} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Trainer: {editTrainerData?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group controlId="modalTrainerName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={editTrainerData?.name}
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="modalTrainerAge">
                                <Form.Label>Age</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="age"
                                    value={editTrainerData?.age}
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, age: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="modalTrainerExpYears">
                                <Form.Label>Years of Experience</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="expYears"
                                    value={editTrainerData?.expYears}
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, expYears: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="modalTrainerPhone">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="phone"
                                    value={editTrainerData?.phone}
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, phone: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="modalTrainerPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={editTrainerData?.price}
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, price: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="modalTrainerImgUrl">
                                <Form.Label>Image URLs (comma-separated)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="imgUrl"
                                    value={editTrainerData?.imgUrl.join(', ')} // Assuming imgUrl is an array
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, imgUrl: e.target.value.split(',').map(url => url.trim()) })}
                                />
                            </Form.Group>
                            <Form.Group controlId="modalTrainerType">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="type"
                                    value={editTrainerData?.type}
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, type: e.target.value })}
                                >
                                    <option value="Personal">Personal</option>
                                    <option value="Group">Group</option>
                                    <option value="CrossFit">CrossFit</option>
                                    <option value="Physical therapy">Physical therapy</option>
                                    <option value="Bodybuilding">Bodybuilding</option>
                                    <option value="Athleticism">Athleticism</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="modalTrainerDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={editTrainerData?.description}
                                    onChange={(e) => setEditTrainerData({ ...editTrainerData, description: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit">Update Trainer</Button>
                            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </section>

            <section className={styles.manageSection}>
                <h2>Manage Appointments</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Trainer</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>User</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{appointment.trainer ? appointment.trainer.name : 'Unavailable'}</td>
                                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                    <td>{new Date(appointment.date).toLocaleTimeString()}</td>
                                    <td>{appointment.user.username}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => deleteAppointment(appointment._id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </section>
        </Container>
        </>);
};

export default AdminPage;
