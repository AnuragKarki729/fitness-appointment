"use client"
import { useState, useEffect } from 'react';
import Trainer from '../components/Trainer';
import styles from '../styles/homescreen.module.css'; // Use CSS modules for styling

const HomeScreen = () => {
  
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/trainers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.homescreenContainer}>
      <h1>Home Screen</h1>
      <div className={styles.trainersContainer}>
        {trainers.map((trainer) => (
          <div key={trainer._id}>
            <Trainer trainer={trainer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
