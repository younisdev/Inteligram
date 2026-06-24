import { ClipLoader, CircleLoader } from 'react-spinners';
import React, { useEffect } from 'react';
import { loadingMessages } from '../../../utils';

const Terminate = ({ username, passwd }) => {
  const [message, Setmessage] = React.useState({ message: '', dots: '   ' });
  const [usedmessages, Setusedmessages] = React.useState([]);

  // usedmessageRef fixes a syncing issue
  const usedmessageRef = React.useRef([]);
  let messageInterval = React.useRef(null);
  let mainInterval = React.useRef(null);
  console.log(usedmessages, message);
  useEffect(() => {
    if (mainInterval.current) clearInterval(mainInterval.current);

    updateMessage();
    mainInterval.current = setInterval(updateMessage, 4000);
    return () => {
      clearInterval(mainInterval.current);
      clearInterval(messageInterval.current);
    };
  }, []);

  useEffect(() => {
    console.log(username, passwd);
    fetch('http://127.0.0.1:8000/api/token/', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',

      body: JSON.stringify({
        username: username,
        password: passwd,
      }),
    })
      .then((Response) => {
        if (!Response.ok) {
          return;
        }
        return Response.json();
      })
      .then((data) => {
        let access = data['access'];
        let refresh = data['refresh'];

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        location.href = '/';
      })
      .catch((error) => {
        console.log(error);
      });
  }, [usedmessages]);

  function updateMessage() {
    if (usedmessages.length >= loadingMessages.length) {
      Setusedmessages([]);
      usedmessageRef.current = [];
    }
    if (messageInterval.current) clearInterval(messageInterval.current);
    let dotCount = 0;

    let randIndex = Math.floor(Math.random() * loadingMessages.length);
    let currentMessage = loadingMessages[randIndex];

    while (usedmessageRef.current.includes(currentMessage)) {
      randIndex = Math.floor(Math.random() * loadingMessages.length);
      currentMessage = loadingMessages[randIndex];
    }
    Setmessage({
      message: currentMessage,
      dots: '',
    });
    Setusedmessages((prev) => {
      const next = [...prev, currentMessage];
      usedmessageRef.current = next;
      return next;
    });
    messageInterval.current = setInterval(() => {
      Setmessage({
        message: currentMessage,
        dots: '.'.repeat(dotCount),
      });

      dotCount = (dotCount + 1) % 4;
    }, 800);
  }
  return (
    <div id="termianation-div">
      <span>{message.message}</span>
      <span>{message.dots}</span>
      <CircleLoader
        id="term-loader"
        color={'black'}
        loading={true}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Terminate;
