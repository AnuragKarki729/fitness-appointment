"use client";
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';

function Navbar({ pageTitle }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signOut = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/login'; // Redirect to login after sign out
  };

  const appointmentPage = () => {
    window.location.href = '/appointments'; // Redirect to login after sign out
  };


  const isAdmin = user && user.isAdmin;
  const isTrainer = user && user.isTrainer;


  if (loading) {
    return <div>Loading...</div>; // Show loading until user state is set
  }

  return (
    <BootstrapNavbar className="navbar navbar-expand-lg navbar-dark bg-dark" expand="lg">
      <BootstrapNavbar.Brand href="/">{pageTitle || 'Home'}</BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {user ? (
            <>
              <span className="nav-link" style={{ color: 'white' }}>
                Hello {user.username}
              </span>
              {pageTitle == 'My Appointments' ? (
                <Nav.Link href = '/home'>Home</Nav.Link>
              ): !isAdmin && !isTrainer ? (
                <Nav.Link onClick={appointmentPage}>View Appointments</Nav.Link>
              ) : null} 

              
              <Nav.Link onClick={signOut}>Sign Out</Nav.Link>

            </>
          ) : (
            <>
              <Nav.Link href="/register">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </>
          )}
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}

export default Navbar;
