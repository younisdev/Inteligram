import React from 'react';
import { RatePasswd, passwdColors, AnimateInputLabel } from '../../../utils';
import gsap from 'gsap';
import { DyvixLabel } from 'dyvix-ui';

const CredentialsInput = ({ REGISTER_STEPS, step, onValueChange }) => {
  const credentialsLabelRef = React.useRef();
  const credentialsInputRef = React.useRef();
  const progress = React.useRef();
  const progressContainer = React.useRef();

  React.useEffect(() => {
    gsap.set(credentialsLabelRef.current, {
      opacity: 0,
      y: -10,
    });
  }, []);

  React.useEffect(() => {
    credentialsInputRef.current.value = '';
    if (REGISTER_STEPS[step]['type'] != 'password') return;
    gsap.set(progressContainer.current, {
      opacity: 0,
    });
  }, [step]);

  function onChangeCallback() {
    let Data = credentialsInputRef.current?.value;
    if (REGISTER_STEPS[step]['type'] === 'password') {
      ChangePasswdFill(RatePasswd(Data, true));
    }

    onValueChange(Data, [credentialsLabelRef], [credentialsInputRef]);
  }

  function ChangePasswdFill(passwd) {
    gsap.set(progressContainer.current, {
      opacity: 1,
    });
    const rating = passwd['rating'];
    let score = passwd['score'];

    score = Math.min(score, 100);

    gsap.to(progress.current, {
      width: score + '%',
      opacity: 1,
      ease: 'power2.in',
      backgroundColor: passwdColors[rating],
      duration: 0.2,
    });
  }
  return (
    <>
      <input
        type="text"
        placeholder={REGISTER_STEPS[step]['placeholder']}
        className="auth-input"
        ref={credentialsInputRef}
        onFocus={(e) =>
          AnimateInputLabel(e, true, step, null, {
            label: credentialsLabelRef,
            input: credentialsInputRef,
          })
        }
        onBlur={(e) =>
          AnimateInputLabel(e, false, step, null, {
            label: credentialsLabelRef,
            input: credentialsInputRef,
          })
        }
        onChange={() => onChangeCallback()}
      ></input>
      <DyvixLabel className='register-label' theme={"Ocean"} htmlFor="auth-input" ref={credentialsLabelRef}>
        {REGISTER_STEPS[step]['placeholder']}
      </DyvixLabel>
      {REGISTER_STEPS[step]['type'] === 'password' && (
        <div id="progress-container" ref={progressContainer}>
          <span id="passwd-progress" ref={progress}></span>
        </div>
      )}
    </>
  );
};

export default CredentialsInput;
