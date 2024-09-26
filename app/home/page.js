// HomeScreen.js
"use client";
import { useState, useEffect } from 'react';
import Trainer from '../components/Trainer';
import styles from '../styles/homescreen.module.css'; 
import Navbar from '../components/Navbar';
import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation'

const HomeScreen = () => {
  const [trainers, setTrainers] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE
  useEffect(() => {
    // Check if user is logged in
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(storedUser.name)
    if (!storedUser) {
      // Redirect to login page if not logged in
      router.push('/login');
    }else{
      console.log("user logged in")
      console.log("user:")
    }
  }, [router]);

  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/trainers`);
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
    <>
    <Navbar pageTitle="Choose Trainer"/>
        <div className={styles.homescreenContainer}>
      
      
      <div className={styles.trainersContainer}>
        {trainers.map((trainer) => (
          <div key={trainer._id}>
            <Trainer trainer={trainer} /> {/* Pass only the trainer information */}
            
          </div>
        ))}
      </div>
    </div>
    </>

  );
};

export default HomeScreen;
