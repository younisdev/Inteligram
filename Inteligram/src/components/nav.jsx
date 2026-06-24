import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function NavBar() {
  const nav = useRef();
  const registerUnderlineRef = useRef();
  const loginUnderlineRef = useRef();
  const RegisterLinkRef = useRef();
  const LoginLinkRef = useRef();

  const navSelector = gsap.utils.selector(nav);
  const isSignedIn =
    document.location.pathname != '/account/register' &&
    document.location.pathname != '/account/login';
  const isRegister = document.location.pathname === '/account/register';
  const linkRef = isRegister ? RegisterLinkRef.current : LoginLinkRef.current;
  const underlineRef = isRegister ? registerUnderlineRef : loginUnderlineRef;

  document.addEventListener('resize', (e) => {
    // ResizeNav();
  });
  useGSAP(() => {
    let navWidth = nav.current.offsetWidth;

    gsap.set(nav.current, {
      width: 0,
      opacity: 0,
    });

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

    tl.to(nav.current, {
      width: navWidth,
      opacity: 1,
      duration: 1.7,
      ease: 'power2.out',
    });
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
          width: 70 + '%',
          ease: 'power2.in',
          duration: 1.1,
        },
        '-.1'
      );
    }
  }, []);
  /*
    function ResizeNav()
    {
      if(windows.innerWidth <= 600)
      {
        return;
      }
      tl.to(nav.current, {
        width: windows.innerWidth - 50,
        duration: 1.7,
        ease: 'power2.out',
      });


    }
      */
  return (
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
          <a href="#" className="nav-link">
            <span>Settings</span>
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
  );
}

export default NavBar;
