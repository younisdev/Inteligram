// utils.jsx
// Holds all reuseable functions and variables
import validator from 'validator';
import { REGISTER_STEPS } from './auth/registeration/registerSteps';
import gsap from 'gsap';
import React from 'react';
import { loginSettings } from './auth/login/loginSettings';
export const MONTH_NAMES = [
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
// work on genders later lol
export const GENDERSLIST = ['Male', 'Female'];
export const passwordOptions = {
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
export const passwdColors = {
  weak: 'red',
  medium: 'yellow',
  good: 'green',
  great: '#4caf50',
};
export const loadingMessages = [
  'Initializing your profile',
  'Authenticating session',
  'Running Inteligram.exe',
  'Almost there',
  'You’re in. Welcome aboard',
];
export const RatePasswd = (passwd, detailed) => {
  let passwordScore = validator.isStrongPassword(passwd, passwordOptions);
  let rating = null;
  if (passwordScore <= 30) {
    rating = 'weak';
  } else if (passwordScore <= 50) {
    rating = 'medium';
  } else if (passwordScore <= 55) {
    rating = 'good';
    passwordScore = 75;
  } else {
    rating = 'great';
    passwordScore = 100;
  }

  return detailed ? { score: passwordScore, rating: rating } : rating != 'weak';
};
export const PopulateSelect = (value, controller, elementArray) => {
  value = value.toLowerCase();

  if (!value) {
    controller((prevData) => ({
      ...prevData,
      is_open: false,
    }));
    return;
  }

  const result = elementArray.filter((element) => {
    return element.toLowerCase().includes(value);
  });

  if (result.length == 0) {
    controller((prevData) => ({
      ...prevData,
      elements: [],
      is_open: false,
    }));

    return;
  }

  controller((prevData) => ({
    ...prevData,
    elements: result,
    is_open: true,
  }));
};
const monthToNumber = (month) => {
  return String(
    MONTH_NAMES.findIndex(
      (indexedMonth) => indexedMonth.toLowerCase() === month.toLowerCase()
    ) + 1
  );
};
// Supported Date form YYYY-MM-DD
export const ReformatDate = (date) => {
  const { year, month, day } = date;

  return `${year}-${monthToNumber(month).padStart(2, '0')}-${day.padStart(2, '0')}`;
};
export const checkDate = (value) => {
  const currentDate = value.split('-');
  // YYYY-MM-DD
  const year = Number(currentDate[0]);
  const monthIndex = currentDate[1];
  const day = Number(currentDate[2]);

  if (!year || monthIndex === -1 || !day) {
    return { is_valid: false, error: 'Please provide your full date of birth' };
  }

  const today = new Date();
  const providedDate = new Date(year, monthIndex, day);

  if (isNaN(providedDate.getTime())) {
    return { is_valid: false, error: 'Enter a valid date' };
  }

  let age = today.getFullYear() - providedDate.getFullYear();
  const hadBirthdayThisyear =
    today.getMonth() > providedDate.getMonth() ||
    (today.getMonth() === providedDate.getMonth() && today.getDate() >= day);

  if (!hadBirthdayThisyear) {
    age--;
  }

  if (age < 13) {
    return { is_valid: false, error: 'You must be at least 13 years old' };
  }
  const is_valid = validator.isDate(value, {
    format: 'YYYY-MM-DD',
    strictMode: true,
  });
  return { is_valid: is_valid, error: !is_valid ? 'Enter a valid date' : null };
};
export function useDOBRef() {
  const yearLabelRef = React.useRef();
  const yearInputRef = React.useRef();
  const monthLabelRef = React.useRef();
  const monthInputRef = React.useRef();
  const dayLabelRef = React.useRef();
  const dayInputRef = React.useRef();

  return [
    { name: 'month', input: monthInputRef, label: monthLabelRef },
    { name: 'day', input: dayInputRef, label: dayLabelRef },
    { name: 'year', input: yearInputRef, label: yearLabelRef },
  ];
}
// Handels the label animation for both multi-step registration system , and the login form.
export const AnimateInputLabel = (
  e,
  visible,
  step,
  DOB_REF = '',
  { label, input }
) => {
  if (!label.current || !input.current) return;

  let placeholder, stepType, exactStep;

  if (step === null) {
    exactStep = loginSettings.find((value) => {
      return value.type === e.target.id.split('-')[1];
    });
    placeholder = exactStep['placeholder'];
    stepType = exactStep['type'];
  } else {
    placeholder = REGISTER_STEPS[step]['placeholder'];
    stepType = REGISTER_STEPS[step]['type'];
  }

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
  } else if (!visible && !input.current.value) {
    let tl = gsap.timeline();

    tl.to(label.current, {
      opacity: 0,
      y: -17,
      ease: 'power2.inOut',
    }).call(() => {
      input.current.placeholder = placeholder;
    });
  }
};
export const ClearStepInput = (labels) => {
  labels.current.forEach((label) => {
    gsap.to(label.current, {
      opacity: 0,
      y: -17,
      ease: 'power2.inOut',
    });
  });
};
//expects an array of inputs.
export const validateInputStyle = (inputs, labels, is_valid) => {
  inputs.current.forEach((input) => {
    gsap.to(input.current, {
      borderColor: is_valid ? 'black' : 'red',
      color: is_valid ? 'black' : 'red',
    });
  });

  labels.current.forEach((lable) => {
    gsap.to(lable.current, {
      color: is_valid ? 'black' : 'red',
    });
  });
};
