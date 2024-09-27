import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './Trainer.module.css'; // Import CSS module for styles
import Link from 'next/link'; // Import Next.js Link component
import 'bootstrap/dist/css/bootstrap.min.css';
const Trainer = ({ trainer}) => {
  const [show, setShow] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE

  console.log('Received date in Trainer component:', date);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className={styles.trainerCard}>
      <img
        src={trainer.imgUrl}
        alt={trainer.name}
        className="img-thumbnail"
        style={{ width: '400px', height:'450px' }}
      />

      <div>
        <h2>{trainer.name}</h2>
        <b>
          <p>Age: {trainer.age}</p>
          <p>Phone Number: {trainer.phone}</p>
          <p>Type: {trainer.type}</p>
          <p>Years of Experience: {trainer.expYears}</p>
        </b>

        <div style={{ float: 'left' }}>
          <Link href={{pathname:`${apiUrl}/book/${trainer._id}` }} passHref>
            <button className="btn btn-primary">Book Trainer</button>
          </Link>
          <Button className="btn btn-primary" style={{marginLeft:'165px'}}onClick={handleShow}>
            View Details
          </Button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{trainer.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{trainer.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Trainer;