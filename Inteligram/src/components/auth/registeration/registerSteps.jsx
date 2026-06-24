import { RatePasswd, checkDate } from '../../utils';
import validator from 'validator';
// Registeration Steps settings and definitions.
export const REGISTER_STEPS = [
  {
    type: 'email',
    placeholder: "What's your email?",
    settings: {
      scale: 1.2,
      mobilescale: 0.95,
      component: 'input',
    },
    validator: (value) => {
      const is_valid = validator.isEmail(value);

      return {
        is_valid: is_valid,
        error: is_valid ? null : 'Please enter a valid email address.',
      };
    },
  },
  {
    type: 'password',
    placeholder: 'Create a strong password!',
    settings: { scale: 1.8, mobilescale: 1.09, component: 'input' },
    validator: (value) => {
      const is_valid = RatePasswd(value, false);

      return {
        is_valid: is_valid,
        error: is_valid
          ? null
          : '9+ chars, uppercase, lowercase, number & symbol.',
      };
    },
  },
  {
    type: 'username',
    placeholder: 'Choose a username!',
    settings: {
      scale: 2.4,
      mobilescale: 1.2,
      component: 'input',
    },
    validator: (value) => {
      const is_valid = value.length >= 2 && value.length <= 30;
      return {
        is_valid: is_valid,
        error: is_valid
          ? null
          : 'Username must be between 2 and 30 characters long',
      };
    },
  },
  {
    type: 'DOB',
    placeholder: ['Month', 'Day', 'Year'],
    settings: { scale: 3.0, mobilescale: 1.3, component: 'multiple_input' },
    validator: (DOB) => {
      return checkDate(DOB);
    },
  },
  {
    type: 'gender',
    placeholder: "What's your gender?",
    settings: { scale: 3.22, mobilescale: 1.35, component: 'select' },
    validator: (value) => {
      const is_valid = value === 'male' || value === 'female';
      return {
        is_valid: is_valid,
        error: is_valid ? null : 'Please select a valid gender',
      };
    },
  },
  {
    type: 'terminate',
    settings: { scale: 4, mobilescale: 4, component: 'termination' },
  },
];
