"use client";
import { useState } from 'react';
import styles from '../styles/register.module.css';
import Success from '../components/Success';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Link from 'next/link'

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    setError(''); // Clear any existing errors
    const user = { email, password };

    try {
      const response = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const result = await response.json(); // Parse the result

      console.log(result)

      if (response.ok && result.user) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        setSuccess('Login Successful');
        console.log(result.user)

        // Redirect based on user type
        if (result.user.isAdmin) {
          router.push('/admin');
        } else if (result.user.isTrainer) {
          router.push('/trainer');
        } else {
          router.push('/home');
        }
      } else {
        // Safely handle the error message, ensure it's a string
        setError(result.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {success && <Success message="Login Successful" />}
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{marginLeft:'25px'}}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{marginLeft:'25px'}}
          />
        </div>
        {/* Check if error exists and render it */}
        {error && (
          <div className={styles.error}>
            {typeof error === 'string' ? error : 'An unknown error occurred'}
          </div>
        )}
        <Button type="submit" className={styles.submitButton}>
          Login
        </Button>
      </form>
      <div style={{ marginTop: '15px' }}>
        <Link href="/register">No Account? Register Here</Link>
      </div>
    </div>
  );
};

export default LoginScreen;
