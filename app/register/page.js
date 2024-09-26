"use client"
import { useState } from 'react';
import styles from '../styles/register.module.css';
import Success from '../components/Success'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap'
import Link from 'next/link'

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const[success,setSuccess] = useState()
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      setError('All fields are required');
      return;
    }

    // Clear error and handle form submission (e.g., send data to server)
    setError('');
    const user = {
      username,
      email,
      password,
    };

    try {
      
      const response = await fetch(`${apiUrl}/api/users/register`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const result = await response.json();
      setSuccess(true)
      setUsername()
      setConfirmPassword()
      setEmail()
      setPassword()
      console.log(result);
    } catch (error) {
      console.error('Error registering user:', error);
      setError('An error occurred during registration');
    }
  };

  return (
    <div className={styles.container}>
      {success && (<Success message = 'REGISTRATION SUCCESS'/>)}
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            style={{marginLeft:'20px'}}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            style={{marginLeft:'20px'}}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            style={{marginLeft:'20px'}}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            style={{marginLeft:'20px'}}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <Button type="submit" className={styles.submitButton}>
          Create Account
        </Button>
      </form>
      <div style={{ marginTop: '15px' }}>
        <Link href="/login">Have an Account? Login Here</Link>
      </div>
    </div>
  );
};

export default RegisterScreen;