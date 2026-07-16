import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  DyvixLabel,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_GLOBAL_THEME,
  DyvixButton,
} from 'dyvix-ui';
import { createPortal } from 'react-dom';
import CreatePost from './CreatePost';

function NavBar() {
  const nav = React.useRef();
  const registerUnderlineRef = React.useRef();
  const loginUnderlineRef = React.useRef();
  const RegisterLinkRef = React.useRef();
  const LoginLinkRef = React.useRef();

  const navSelector = gsap.utils.selector(nav);
  const isSignedIn =
    document.location.pathname != '/account/register' &&
    document.location.pathname != '/account/login';
  const isRegister = document.location.pathname === '/account/register';
  const linkRef = isRegister ? RegisterLinkRef.current : LoginLinkRef.current;
  const underlineRef = isRegister ? registerUnderlineRef : loginUnderlineRef;
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showAddPost, setAddPost] = React.useState(false);
  const DROPDOWNITEMS = [
    {
      label: 'Create a new post',
      func: () => {
        setAddPost((prev) => !prev);
      },
    },
    {
      label: 'example',
      func: () => {
        console.log('example 1!');
      },
    },
  ];

  useGSAP(() => {
    const navWidth = nav.current.offsetWidth;
    gsap.set(navSelector('.nav-link'), {
      opacity: 0,
      y: 10,
    });

    if (!isSignedIn) {
      gsap.set(underlineRef.current, {
        opacity: 0,
        width: 0,
      });
    }

    let tl = gsap.timeline();

    tl.fromTo(
      nav.current,
      { width: 0, opacity: 0 },
      {
        width: navWidth,
        opacity: 1,
        duration: 1.7,
        ease: 'power2.out',
        clearProps: 'width',
      }
    );
    tl.to(
      navSelector('.nav-link'),
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
      },
      '-.1'
    );

    if (!isSignedIn) {
      tl.to(
        underlineRef.current,
        {
          opacity: 1,
          width: '70%',
          ease: 'power2.in',
          duration: 1.1,
        },
        '-.1'
      );
    }
  }, []);

  return (
    <div id="inteligram-nav">
      {isSignedIn && (
        <>
          <div id="nav-logo">
            <img src="http://127.0.0.1:8000/attachments/logo.png" />
          </div>
          <div id="pfp-setting-holder">
            <img
              src="http://127.0.0.1:8000/attachments/user.png"
              onClick={() => setShowDropdown((prev) => !prev)}
            />
            {showDropdown && (
              <div id="pfp-dropdown">
                {DROPDOWNITEMS.map((item, i) => (
                  <DyvixButton
                    className="pfp-dropdown-item"
                    key={i}
                    onClick={() => item.func()}
                  >
                    {item.label}
                  </DyvixButton>
                ))}
                {showAddPost &&
                  createPortal(
                    <CreatePost setAddPost={setAddPost} />,
                    document.querySelector('#root')
                  )}
              </div>
            )}
          </div>
        </>
      )}
      <nav id={`${isSignedIn ? 'main-nav' : 'guest-nav'}`} ref={nav}>
        {isSignedIn && (
          <>
            <a href="/" className="nav-link">
              <span>Home</span>
            </a>
            <a href="#" className="nav-link">
              <span>Explore</span>
            </a>
            <a href="#" className="nav-link">
              <span>Followings</span>
            </a>
          </>
        )}
        {!isSignedIn && (
          <>
            <a
              href="/account/register"
              className="nav-link"
              ref={RegisterLinkRef}
            >
              <span>Register</span>
              {isRegister && (
                <span id="nav-underline" ref={registerUnderlineRef}></span>
              )}
            </a>
            <a href="/account/login" className="nav-link" ref={LoginLinkRef}>
              <span>Login</span>
              {!isRegister && (
                <span id="nav-underline" ref={loginUnderlineRef}></span>
              )}
            </a>
          </>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
