// multipleInput.jsx
// Registeration multi-input DOB

import SelectEngine from '../../../SelectEngine';
import React from 'react';
import {
  MONTH_NAMES,
  AnimateInputLabel,
  useDOBRef,
  PopulateSelect,
  ReformatDate,
} from '../../../utils';
import gsap from 'gsap';
import { DyvixLabel } from 'dyvix-ui';

const DOBMultiInput = ({ step, onValueChange }) => {
  const [monthSelect, SetSelect] = React.useState({
    is_rendered: true,
    is_open: false,
    elements: false,
    selected: '',
  });
  const dropdownSelectRef = React.useRef();
  const DOBRef = useDOBRef();

  React.useEffect(() => {
    // Adjusts custom select cords

    gsap.set(dropdownSelectRef?.current, {
      top: DOBRef[0]['input'].current.offsetTop + window.scrollY + 17,
      left: DOBRef[0]['input'].current.offsetLeft + window.scrollX + 3,
    });

    // Dynamicily hidding the DOB labels
    DOBRef.forEach((section) => {
      gsap.set(section['label'].current, {
        opacity: 0,
        y: -10,
      });
    });
  }, []);

  function onChangeCallback() {
    let DOBValue = { year: '', month: '', day: '' };

    DOBRef.forEach((ele) => {
      DOBValue[ele['name']] = ele['input'].current?.value;
    });

    onValueChange(
      ReformatDate(DOBValue),
      [DOBRef[0]['label'], DOBRef[1]['label'], DOBRef[2]['label']],
      [DOBRef[0]['input'], DOBRef[1]['input'], DOBRef[2]['input']]
    );
  }

  return (
    <div id="bd-container">
      <div className="bd-div">
        <SelectEngine
          elements={monthSelect.elements}
          is_open={monthSelect.is_open}
          is_rendered={monthSelect.is_rendered}
          inputRef={DOBRef[0]['input']}
          ref={dropdownSelectRef}
          controller={SetSelect}
          OnChangeCallback={onChangeCallback}
        />

        <input
          className="auth-input"
          id="month-input"
          ref={DOBRef[0]['input']}
          placeholder="Month"
          onChange={(e) => {
            PopulateSelect(e.target.value, SetSelect, MONTH_NAMES);
            onChangeCallback();
          }}
          onFocus={(e) =>
            AnimateInputLabel(e, true, step, DOBRef, {
              label: DOBRef[0]['label'],
              input: DOBRef[0]['input'],
            })
          }
          onBlur={(e) =>
            AnimateInputLabel(e, false, step, DOBRef, {
              label: DOBRef[0]['label'],
              input: DOBRef[0]['input'],
            })
          }
        ></input>
        <label htmlFor="month-input" ref={DOBRef[0]['label']}>
          Month
        </label>
      </div>
      <div className="bd-div">
        <input
          type="number"
          min={1}
          max={31}
          className="auth-input"
          id="day-input"
          placeholder="Day"
          ref={DOBRef[1]['input']}
          onFocus={(e) =>
            AnimateInputLabel(e, true, step, DOBRef, {
              label: DOBRef[1]['label'],
              input: DOBRef[1]['input'],
            })
          }
          onBlur={(e) =>
            AnimateInputLabel(e, false, step, DOBRef, {
              label: DOBRef[1]['label'],
              input: DOBRef[1]['input'],
            })
          }
          onChange={() => onChangeCallback()}
        ></input>
        <label htmlFor="day-input" ref={DOBRef[1]['label']}>
          Day
        </label>
      </div>
      <div className="bd-div">
        <input
          type="text"
          className="auth-input"
          id="year-input"
          placeholder="Year"
          ref={DOBRef[2]['input']}
          onFocus={(e) =>
            AnimateInputLabel(e, true, step, DOBRef, {
              label: DOBRef[2]['label'],
              input: DOBRef[2]['input'],
            })
          }
          onBlur={(e) =>
            AnimateInputLabel(e, false, step, DOBRef, {
              label: DOBRef[2]['label'],
              input: DOBRef[2]['input'],
            })
          }
          onChange={() => onChangeCallback()}
        ></input>
        <DyvixLabel className='register-label' theme={"Ocean"} htmlFor="year-input" ref={DOBRef[2]['label']}>
          Year
        </DyvixLabel>
      </div>
    </div>
  );
};

export default DOBMultiInput;
