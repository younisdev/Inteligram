import React from 'react';
import loggedContext from '../components/context';

function Tokenctr({ children }) {
  const [logState, setLogin] = React.useState(false);

  React.useEffect(() => {
    let access = localStorage.getItem('access');
    let refresh = localStorage.getItem('refresh');

    if (!refresh || !access) {
      if (document.location.pathname === '/account/login') return;

      document.location.href = '/account/register';
      return;
    }

    fetch('http://127.0.0.1:8000/api/token/check', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
      },
    }).then((Response) => {
      if (Response.ok) {
        setLogin(true);
        return;
      } else {
        fetch('http://127.0.0.1:8000/api/token/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refresh,
          }),
        })
          .then((Response) => {
            if (!Response.ok) {
              setLogin(false);
              if (document.location.pathname === '/account/login') return;

              document.location.href = '/account/register';
              return;
            }
            return Response.json();
          })
          .then((data) => {
            setLogin(true);
            localStorage.setItem('access', data['access']);
            if (data['refresh']) {
              localStorage.setItem('refresh', data['refresh']);
            }
          });
      }
    });
  }, []);

  return (
    <loggedContext.Provider value={{ logState, setLogin }}>
      {children}
    </loggedContext.Provider>
  );
}

export default Tokenctr;
