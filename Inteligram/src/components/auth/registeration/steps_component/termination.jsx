import React, { useEffect, useState } from 'react';
import { CircleLoader } from 'react-spinners';
import { loadingMessages } from '../../../utils';

const Terminate = ({ username, passwd }) => {
  console.log(username, passwd);
  const [error, setError] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: passwd,
          }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed. Invalid credentials.');
        }

        const data = await response.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        setIsAuthenticated(true);
        setMessageIndex(loadingMessages.length - 1);
        setTimeout(() => (window.location.href = '/'), 3000);
      } catch (error) {
        setError(error.message || 'An error occurred during authentication.');
      }
    };

    authenticate();
  }, [username, passwd]);
  useEffect(() => {
    if (error || !loadingMessages.length || isAuthenticated) return;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 4000);

    return () => clearInterval(messageInterval);
  }, [error, isAuthenticated]);
  React.useEffect(() => {
    if (error) return;

    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 500);

    return () => clearInterval(dotInterval);
  }, [error]);

  if (error) {
    return (
      <div id="termination-div" className="error-state">
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div id="termination-div">
      <span>{loadingMessages[messageIndex]}</span>
      <span
        style={{ display: 'inline-block', width: '20px', textAlign: 'left' }}
      >
        {dots}
      </span>
      <CircleLoader
        id="term-loader"
        color="black"
        loading={true}
        size={15}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default Terminate;
