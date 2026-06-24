// RegisterForm.jsx
// Multistep Registeration form with smooth GSAP animation.

import { useGSAP } from '@gsap/react';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import validator from 'validator';

// Registeration Steps settings and definitions.
const REGISTER_STEPS = [
  {
    type: 'email',
    placeholder: "What's your email?",
    settings: { scale: 1.3, component: 'input' },
  },
  {
    type: 'password',
    placeholder: 'Create a strong password!',
    settings: { scale: 2, component: 'input' },
  },
  {
    type: 'username',
    placeholder: 'Choose a username!',
    settings: { scale: 3, component: 'input' },
  },
  {
    type: 'DOB',
    placeholder: ['Month', 'Day', 'Year'],
    settings: { scale: 3.5, component: 'multiple_input' },
  },
  {
    type: 'gender',
    placeholder: 'Choose a username!',
    settings: { scale: 3, component: 'select' },
  },
];

const passwordOptions = {
  minLength: 9,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: true,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Register() {
  const [step, SetStep] = React.useState(3);
  const [UserInfo, SetUser] = React.useState({
    username: '',
    email: '',
    password: '',
    DOB: '',
    gender: '',
  });
  const [componentVisibility, setComponent] = React.useState({
    input: false,
    multiple_input: true,
    select: false,
  });
  const [monthSelect, SetSelect] = React.useState({
    is_rendered: true,
    is_open: false,
    elements: false,
    selected: '',
  });
  const [passwdScore, SetScore] = React.useState(0);
  console.log(UserInfo);
  React.useEffect(() => {
    document.querySelector('body').classList.add('noscroll');
  }, []);

  const registerDiv = React.useRef();
  const credentialsLabelRef = React.useRef();
  const credentialsInputRef = React.useRef();
  const yearLabelRef = React.useRef();
  const yearInputRef = React.useRef();
  const monthLabelRef = React.useRef();
  const monthInputRef = React.useRef();
  const dayLabelRef = React.useRef();
  const dayInputRef = React.useRef();
  const dropdownSelectRef = React.useRef();

  const DOB_REF = [
    { name: 'Month', input: monthInputRef, label: monthLabelRef },
    { name: 'Day', input: dayInputRef, label: dayLabelRef },
    { name: 'Year', input: yearInputRef, label: yearLabelRef },
  ];

  let tl = gsap.timeline();

  useGSAP(() => {
    gsap.set(registerDiv.current, {
      scale: 0,
      opacity: 0,
      backgroundColor: '#1f2937',
    });
    gsap.set(credentialsLabelRef.current, {
      opacity: 0,
      y: -10,
    });
  });

  useEffect(() => {
    tl.to(registerDiv.current, {
      scale: REGISTER_STEPS[step]['settings']['scale'],
      opacity: 1,
      duration: 2,
      backgroundColor: '#06B6D4',
      ease: 'power2.inOut',
    });
  }, [step]);

  // Dynamicily hidding the DOB labels

  useEffect(() => {
    if (componentVisibility.multiple_input) {
      gsap.set(dropdownSelectRef.current, {
        top: monthInputRef.current.offsetTop + window.scrollY + 17,
        left: monthInputRef.current.offsetLeft + window.scrollX + 3,
      });
      gsap.set(dropdownSelectRef.current, {
        top: monthInputRef.current.offsetTop + window.scrollY + 17,
        left: monthInputRef.current.offsetLeft + window.scrollX + 3,
      });
      DOB_REF.forEach((section) => {
        gsap.set(section['label'].current, {
          opacity: 0,
          y: -10,
        });
      });
    }
  }, [componentVisibility.multiple_input]);

  function RatePasswd(passwd, detailed) {
    let passwordScore = validator.isStrongPassword(passwd, passwordOptions);

    if (passwordScore < 30) {
      return detailed ? passwordScore : false;
    } else {
      return detailed ? passwordScore : true;
    }
  }
  function HandelRegisterBtn() {
    let stepType = REGISTER_STEPS[step]['type'];
    let stepComponent = REGISTER_STEPS[step]['settings']['component'];
    let is_valid = ValidateData(stepType, credentialsInputRef.current.value);

    if (stepComponent === 'input') {
      if (!is_valid) {
        credentialsLabelRef.current.style.color = 'Red';

        return false;
      }

      SetUser((prevData) => ({
        ...prevData,
        [stepType]: credentialsInputRef.current.value,
      }));
      if (stepType === 'username') {
        setComponent((prevData) => ({
          ...prevData,
          input: false,
          multiple_input: true,
        }));
      }
      SetStep(step + 1);
    } else if (stepComponent === 'multiple_input') {
      SetStep(step + 1);
      setComponent((prevData) => ({
        ...prevData,
        multiple_input: false,
        select: true,
      }));
    } else if (stepComponent === 'select') {
      SetStep(step + 1);
    } else {
    }
    AnimateTransition();
  }
  function ValidateData(stepType, data) {
    if (stepType === 'email') {
      let is_valid_email = validator.isEmail(data);
      if (!is_valid_email) {
        return false;
      }
      return true;
    } else if (stepType === 'password') {
      return RatePasswd(data, false);
    } else if (stepType === 'username') {
      if (data.length < 2) {
        return false;
      }

      return true;
    } else if (stepType === 'DOB') {
    }
  }
  function AnimateInputLabel(e, visible, { label, input }) {
    let placeholder = REGISTER_STEPS[step]['placeholder'];
    let stepType = REGISTER_STEPS[step]['type'];

    if (stepType === 'DOB') {
      let id = e.target.id.split('-')[0];
      let current_field = DOB_REF.find(
        (REF) => REF['name'].toLocaleLowerCase() === id
      );

      if (current_field) {
        placeholder = current_field.name;
      }
    }
    if (visible) {
      gsap.to(label.current, {
        opacity: 1,
        y: -50,
        ease: 'power2.inOut',
      });
      input.current.placeholder = '';
    } else {
      tl.to(label.current, {
        opacity: 0,
        y: -17,
        ease: 'power2.inOut',
      }).call(() => {
        input.current.placeholder = placeholder;
      });
    }
  }
  function PopulateMonthSelect(e) {
    let result = [];
    let value = monthInputRef.current.value.toLowerCase();

    MONTH_NAMES.forEach((month) => {
      if (month.toLowerCase().includes(value)) {
        result.push(month);
      }
    });
    SetSelect((prevData) => ({
      ...prevData,
      elements: result,
      is_open: true,
    }));
  }
  function AnimateTransition() {
    gsap.to(registerDiv.current, {
      scale: REGISTER_STEPS[step]['settings']['scale'],
      duration: 2,
      ease: 'power2.inOut',
    });
  }

  /*
    React.useEffect(() => {
        fetch('http://127.0.0.1:8000/api/users/Register/', {
            body: JSON.stringify({
                'username': 'uMA9_UwXQCxip8@6iiT',
                'email': 'user@example.com',
                'password': 'string',
                'DOB': '2025-08-18',
                'gender': 'male'
            })
        })
    }, []);
*/
  return (
    <div id="register-div" ref={registerDiv}>
      <div className="input-container">
        {componentVisibility.input && (
          <>
            <input
              type="text"
              placeholder={REGISTER_STEPS[step]['placeholder']}
              className="register-input"
              ref={credentialsInputRef}
              onFocus={(e) =>
                AnimateInputLabel(e, true, {
                  label: credentialsLabelRef,
                  input: credentialsInputRef,
                })
              }
              onBlur={(e) =>
                AnimateInputLabel(e, false, {
                  label: credentialsLabelRef,
                  input: credentialsInputRef,
                })
              }
            ></input>
            <label htmlFor="register-input" ref={credentialsLabelRef}>
              {REGISTER_STEPS[step]['placeholder']}
            </label>
          </>
        )}
        {componentVisibility.multiple_input && (
          <div id="bd-container">
            <div className="bd-div1">
              {monthSelect.is_rendered && (
                <ul
                  id="dropdown-select"
                  style={
                    monthSelect.is_open
                      ? {
                          background: 'whitesmoke',
                          border: '1px solid #e2e8f0',
                        }
                      : { background: 'transparent', border: 'none' }
                  }
                  ref={dropdownSelectRef}
                >
                  {monthSelect.is_open &&
                    monthSelect.elements.map((month, index) => (
                      <li key={index}>{month}</li>
                    ))}
                </ul>
              )}
              <input
                className="register-input"
                id="month-input"
                ref={monthInputRef}
                placeholder="Month"
                onChange={(e) => PopulateMonthSelect(e)}
                onFocus={(e) =>
                  AnimateInputLabel(e, true, {
                    label: monthLabelRef,
                    input: monthInputRef,
                  })
                }
                onBlur={(e) =>
                  AnimateInputLabel(e, false, {
                    label: monthLabelRef,
                    input: monthInputRef,
                  })
                }
              ></input>
              <label htmlFor="month-input" ref={monthLabelRef}>
                Month
              </label>
            </div>
            <div className="bd-div">
              <input
                type="number"
                min={1}
                max={31}
                className="register-input"
                id="day-input"
                placeholder="Day"
                ref={dayInputRef}
                onFocus={(e) =>
                  AnimateInputLabel(e, true, {
                    label: dayLabelRef,
                    input: dayInputRef,
                  })
                }
                onBlur={(e) =>
                  AnimateInputLabel(e, false, {
                    label: dayLabelRef,
                    input: dayInputRef,
                  })
                }
              ></input>
              <label htmlFor="day-input" ref={dayLabelRef}>
                Day
              </label>
            </div>
            <div className="bd-div">
              <input
                type="text"
                className="register-input"
                id="year-input"
                placeholder="Year"
                ref={yearInputRef}
                onFocus={(e) =>
                  AnimateInputLabel(e, true, {
                    label: yearLabelRef,
                    input: yearInputRef,
                  })
                }
                onBlur={(e) =>
                  AnimateInputLabel(e, false, {
                    label: yearLabelRef,
                    input: yearInputRef,
                  })
                }
              ></input>
              <label htmlFor="year-input" ref={yearLabelRef}>
                Year
              </label>
            </div>
          </div>
        )}
        {componentVisibility.select && <></>}

        <button id="register-btn" onClick={HandelRegisterBtn}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default Register;
