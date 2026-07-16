import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { loginSettings } from './loginSettings';
import { AnimateInputLabel, validateInputStyle } from '../../utils';
import { AuthMessage } from '../AuthMsg';
import { DyvixButton, DyvixLabel } from 'dyvix-ui';
function Login() {
  const [userDetails, SetUserDetails] = React.useState({
    username: '',
    password: '',
  });
  const [authMsg, SetAuthMsh] = React.useState({
    message: '',
    type: null,
    visibility: false,
  });
  const loginDiv = React.useRef();
  const usernameInput = React.useRef();
  const usernameLabel = React.useRef();
  const passwordInput = React.useRef();
  const passwordLabel = React.useRef();

  console.log(userDetails);
  useGSAP(() => {
    gsap.set(loginDiv.current, {
      scale: 0.1,
      opacity: 0,
      borderRadius: '50%',
    });

    gsap.set(usernameLabel.current, {
      opacity: 0,
      y: -10,
    });
    gsap.set(passwordLabel.current, {
      opacity: 0,
      y: -10,
    });

    let tl = gsap.timeline();

    tl.to(loginDiv.current, {
      duration: 1,
      delay: 0.1,
      scale: 1.1,
      opacity: 1,
      ease: 'power2.in',
    }).to(loginDiv.current, {
      borderRadius: '10%',
      duration: 1,
      ease: 'power3.in',
      delay: 0.1,
    });
  });

  function handelDetailsChange(event) {
    const { name, value } = event.target;
    SetUserDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function validateLogin() {
    let username = userDetails.username;
    let password = userDetails.password;

    fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((Response) => {
        if (!Response.ok) {
          SetAuthMsh({
            message: 'Username or Password is incorrect',
            visibility: true,
            type: 'error',
          });
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
  }

  return (
    <div className="auth-div" id="login-div" ref={loginDiv}>
      <div id="login-input">
        <div className="login-feild">
          <input
            name="username"
            className="auth-input"
            type="text"
            id="login-username"
            ref={usernameInput}
            placeholder={loginSettings[0]['placeholder']}
            onFocus={(e) =>
              AnimateInputLabel(e, true, null, null, {
                label: usernameLabel,
                input: usernameInput,
              })
            }
            onBlur={(e) =>
              AnimateInputLabel(e, false, null, null, {
                label: usernameLabel,
                input: usernameInput,
              })
            }
            onChange={(e) => handelDetailsChange(e)}
          ></input>
          <DyvixLabel
            theme={'Ocean'}
            htmlFor="login-username"
            ref={usernameLabel}
          >
            {loginSettings[0]['placeholder']}
          </DyvixLabel>
        </div>
        <div className="login-feild">
          <input
            name="password"
            className="auth-input"
            type="password"
            id="login-password"
            ref={passwordInput}
            placeholder={loginSettings[1]['placeholder']}
            onFocus={(e) =>
              AnimateInputLabel(e, true, null, null, {
                label: passwordLabel,
                input: passwordInput,
              })
            }
            onBlur={(e) =>
              AnimateInputLabel(e, false, null, null, {
                label: passwordLabel,
                input: passwordInput,
              })
            }
            onChange={(e) => handelDetailsChange(e)}
          ></input>
          <DyvixLabel
            theme="Ocean"
            htmlFor="login-password"
            ref={passwordLabel}
          >
            {loginSettings[1]['placeholder']}
          </DyvixLabel>
        </div>
        {authMsg.visibility && <AuthMessage value={authMsg} />}
      </div>

      <DyvixButton className="auth-btn" onClick={validateLogin}>
        Sign in
      </DyvixButton>
    </div>
  );
}

export default Login;
