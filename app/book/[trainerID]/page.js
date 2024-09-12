"use client"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BookScreen() {
  const [error, setError] = useState(null);
  const [trainer, setTrainer] = useState(null);
  const router = useRouter();
  const { trainerId } = router.query;

  useEffect(() => {
    if (!trainerId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/api/trainers/${trainerId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setTrainer(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [trainerId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Book Screen</h1>
      <h1>Trainer ID = {trainerId}</h1>
      {trainer && <div>{/* Render trainer details */}</div>}
    </div>
  );
}