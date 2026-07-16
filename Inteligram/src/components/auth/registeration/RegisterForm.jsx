// RegisterForm.jsx
// Multistep Registeration form with smooth GSAP animation.

import { useGSAP } from '@gsap/react';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import CredentialsInput from './steps_component/credentialsInput';
import DOBMultiInput from './steps_component/multipleInput';
import GenderInput from './steps_component/selectGender';
import { REGISTER_STEPS } from './registerSteps';
import { AuthMessage } from '../AuthMsg';
import { useDOBRef, ClearStepInput, validateInputStyle } from '../../utils';
import Terminate from './steps_component/termination';
import { DyvixButton } from 'dyvix-ui';
function Register() {
  const [step, SetStep] = React.useState(0);
  const [UserInfo, SetUser] = React.useState({
    username: '',
    email: '',
    password: '',
    DOB: '',
    gender: '',
  });
  // Input Component is true by default
  const [componentVisibility, setComponent] = React.useState({
    input: true,
    multiple_input: false,
    select: false,
    termination: false,
  });
  const [authMsg, setAuthMsg] = React.useState({
    message: '',
    type: null,
    visibility: false,
  });

  React.useEffect(() => {
    document.querySelector('body').classList.add('noscroll');
  }, []);

  const registerDiv = React.useRef();
  const DOB_REF = useDOBRef();
  const currentLabelRef = React.useRef();
  const currentInputRef = React.useRef();
  let tl = gsap.timeline();

  useGSAP(() => {
    gsap.set(registerDiv.current, {
      scale: 0,
      opacity: 0,
      borderRadius: '10%',
      backgroundColor: '#080808ff',
    });
  });

  useEffect(() => {
    const deviceScale =
      window.innerWidth <= 600
        ? REGISTER_STEPS[step].settings.mobilescale
        : REGISTER_STEPS[step].settings.scale;
    if (step === 0) {
      tl.to(registerDiv.current, {
        scale: deviceScale,
        opacity: 1,
        duration: 1.5,
        backgroundColor: '#06B6D4',
        ease: 'power3.inOut',
      }).to(registerDiv.current, {
        duration: 1,
        borderRadius: '50%',
        ease: 'power3.in',
        delay: 0.1,
      });
    } else {
      tl.to(registerDiv.current, {
        scale: deviceScale,
        opacity: 1,
        duration: 2,
        backgroundColor: '#06B6D4',
        ease: 'power3.inOut',
      });
    }
  }, [step]);

  function HandelRegisterBtn() {
    let stepType = REGISTER_STEPS[step]['type'];
    let stepComponent = REGISTER_STEPS[step]['settings']['component'];
    let is_valid = ValidateData(stepType)['is_valid'];
    let error = ValidateData(stepType)['error'];

    validateInputStyle(currentInputRef, currentLabelRef, is_valid);

    setAuthMsg({
      message: is_valid ? '' : error,
      type: is_valid ? 'success' : 'error',
      visibility: is_valid ? false : true,
    });

    if (!is_valid) return;

    ClearStepInput(currentLabelRef);

    if (stepComponent === 'input') {
      //credentialsLabelRef.current.style.color = 'black';

      if (stepType === 'username') {
        setComponent((prevData) => ({
          ...prevData,
          input: false,
          multiple_input: true,
        }));
      }
      SetStep(step + 1);
    } else if (stepComponent === 'multiple_input') {
      setComponent((prevData) => ({
        ...prevData,
        multiple_input: false,
        select: true,
      }));
      SetStep(step + 1);
    } else if (stepComponent === 'select') {
      SubmitUserData();
      setComponent((prevData) => ({
        ...prevData,
        select: false,
        termination: true,
      }));
      SetStep(step + 1);
    } else if (stepComponent == 'terminate') {
    }
    AnimateTransition();
  }
  function ValidateData(stepType) {
    let currentStep = REGISTER_STEPS.find((step) => step['type'] === stepType);
    let data = UserInfo[currentStep['type']];
    let isValid = currentStep.validator(data);

    return isValid;
  }

  function AnimateTransition() {
    gsap.to(registerDiv.current, {
      scale: REGISTER_STEPS[step]['settings']['scale'],
      duration: 2,
      ease: 'power2.inOut',
    });
  }
  function OnStepValueChange(value, label, input) {
    const stepName = REGISTER_STEPS[step]['type'];
    SetUser((prevData) => ({
      ...prevData,
      [stepName]: value,
    }));

    currentLabelRef.current = label;
    currentInputRef.current = input;
  }

  function SubmitUserData() {
    fetch('http://127.0.0.1:8000/api/users/Register/', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({
        username: UserInfo.username,
        email: UserInfo.email,
        password: UserInfo.password,
        DOB: UserInfo.DOB,
        gender: UserInfo.gender,
      }),
    })
      .then((Response) => {
        if (Response.ok) {
          return Response.json();
        }
      })
      .then((data) => console.log(data));
  }

  return (
    <div className="auth-div" ref={registerDiv}>
      <div className="register-feild">
        {componentVisibility.input && (
          <CredentialsInput
            REGISTER_STEPS={REGISTER_STEPS}
            step={step}
            onValueChange={OnStepValueChange}
          />
        )}
        {componentVisibility.multiple_input && (
          <DOBMultiInput step={step} onValueChange={OnStepValueChange} />
        )}
        {componentVisibility.select && (
          <GenderInput
            REGISTER_STEPS={REGISTER_STEPS}
            step={step}
            onValueChange={OnStepValueChange}
          />
        )}
      </div>
      {componentVisibility.termination && (
        <Terminate username={UserInfo.username} passwd={UserInfo.password} />
      )}
      {authMsg.visibility && <AuthMessage value={authMsg} />}
      {!componentVisibility.termination && (
        <DyvixButton className="auth-btn" onClick={HandelRegisterBtn}>
          Continue
        </DyvixButton>
      )}
    </div>
  );
}

export default Register;
