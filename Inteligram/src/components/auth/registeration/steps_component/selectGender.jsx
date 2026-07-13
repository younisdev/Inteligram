import React, { forwardRef, useEffect } from 'react';
import SelectEngine from '../../../SelectEngine';
import gsap from 'gsap';
import { PopulateSelect, GENDERSLIST, AnimateInputLabel } from '../../../utils';
import { DyvixLabel } from 'dyvix-ui';

const GenderInput = ({ REGISTER_STEPS, step, onValueChange }) => {
  const [genderSelect, SetGender] = React.useState({
    is_rendered: true,
    is_open: false,
    elements: false,
    selected: '',
  });
  const genderInputRef = React.useRef();
  const genderLabelRef = React.useRef();
  const dropdownSelectRef = React.useRef();

  React.useEffect(() => {
    gsap.set(dropdownSelectRef?.current, {
      top: genderInputRef.current.offsetTop + window.scrollY + 17,
      left: genderInputRef.current.offsetLeft + window.scrollX + 3,
      width: genderInputRef.current.offsetWidth - 8,
    });
    gsap.set(genderLabelRef.current, {
      opacity: 0,
      y: -10,
    });
  }, []);

  function OnChangeCallback() {
    let Data = genderInputRef.current?.value.toLowerCase();

    onValueChange(Data, [genderLabelRef], [genderInputRef]);
  }

  return (
    <>
      <SelectEngine
        elements={genderSelect.elements}
        is_open={genderSelect.is_open}
        is_rendered={genderSelect.is_rendered}
        inputRef={genderInputRef}
        ref={dropdownSelectRef}
        controller={SetGender}
        OnChangeCallback={OnChangeCallback}
      />
      <input
        type="text"
        placeholder={REGISTER_STEPS[step]['placeholder']}
        className="auth-input"
        id="gender-input"
        ref={genderInputRef}
        onFocus={(e) =>
          AnimateInputLabel(e, true, step, null, {
            input: genderInputRef,
            label: genderLabelRef,
          })
        }
        onBlur={(e) =>
          AnimateInputLabel(e, false, step, null, {
            input: genderInputRef,
            label: genderLabelRef,
          })
        }
        onChange={(e) => {
          PopulateSelect(e.target.value, SetGender, GENDERSLIST);
          OnChangeCallback();
        }}
      ></input>
      <DyvixLabel className='register-label' theme={"Ocean"} htmlFor="gender-input" ref={genderLabelRef}>
        {REGISTER_STEPS[step]['placeholder']}
      </DyvixLabel>
    </>
  );
};

export default GenderInput;
