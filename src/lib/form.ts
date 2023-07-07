// Developer: Farhan Ali Raza
// Purpose: Form Validation Library
// Github: github.com/FarhanAliRaza
// Lisece: MIT

import { writable } from 'svelte/store';
import type { FormType, Field } from './types.js';

const validValidators = [
	'required',
	'email',
	'bool',
	'phone',
	'number',
	'min',
	'max',
	'requiredWhen', // TODO: Implement this
	'validValues', // TODO: Implement this
	'equalTo'
];

const defaultValidators = {
	required: true,
	email: false,
	phone: false,
	number: false,
	min: 0,
	max: 0,
	requiredWhen: '',
	validValues: [],
	equalTo: ''
};

export const form = createForm();



function createForm() {
	const { subscribe, set, update } = writable({});

	return {
		subscribe,
		set,
		validate: () =>
			update((f) => {
				// console.log('f', f);
				const keys = Object.keys(f);

				for (let index = 0; index < keys.length; index++) {
					const key = keys[index];
					if (key != 'isValid' && !key.includes('Data')) {
						const field_value = f[key];
						const keyy = key + 'Data';
						const validators = f[keyy];

						const new_validators = validate(f, field_value, validators);
						f[keyy] = new_validators;
						// console.log('new_validators', new_validators, key);
					}
				}
				return f;
			}),

		reset: () => set({}),
		init: (form) => {
			const keys = Object.keys(form);
			let newForm = {
				isValid: false
			};
			for (let index = 0; index < keys.length; index++) {
				const key = keys[index];
				const validators = form[key];

				if (typeof validators === 'object') {
					const validatorsKeys = Object.keys(validators);
					if (keys.length === 0) {
						throw new Error('No validators found for ' + key + ' *Form Validator* ');
					}
					for (let index = 0; index < validatorsKeys.length; index++) {
						const validatorKey = validatorsKeys[index];
						if (!validValidators.includes(validatorKey)) {
							console.error(
								'Invalid validator ' + validatorKey + ' found for ' + key + ' *Form Validator* '
							);
							throw new Error('Invalid validator ' + validatorKey + ' found for ' + key);
						}
					}
				}

				newForm[key] = '';
				newForm[key + 'Data'] = {
					validators: {
						...defaultValidators,
						...validators
					},
					error: '',
					touched: false,
					valid: false
				};
			}
			set(newForm);
		}
	};
}

function isTouched(value) {
	return value !== '';
}

//TODO : Errors shoud be array

function validate(f, value, validators) {
	const validatorChecks = validators.validators;
	if (validators['touched'] == false) {
        console.log("value", value)
		validators['touched'] = isTouched(value);
	}
    console.log("value", value)
	
	if (validators['touched'] == false) {
		return validators;
	}

	validators['valid'] = true;
	validators['error'] = '';

	if (validatorChecks['required'] == true) {
		if (isEmpty(value)) {
			if ('requiredMsg' in validators) {
				validators['error'] = validators['requiredMsg'];
			} else {
				validators['error'] = 'This field is required';
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['email'] == true) {
		if (!emailValidator(value)) {
			if ('emailMsg' in validators) {
				validators['error'] = validators['emailMsg'];
			} else {
				validators['error'] = 'Invalid email address';
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['phone'] == true) {
		if (!phoneValidator(value)) {
			if ('phoneMsg' in validators) {
				validators['error'] = validators['phoneMsg'];
			} else {
				validators['error'] = 'Invalid phone number';
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['number'] == true) {
		if (!isNumber(value)) {
			if ('numberMsg' in validators) {
				validators['error'] = validators['numberMsg'];
			} else {
				validators['error'] = 'Only numbers are allowed';
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['min'] > 0) {
		if (!minCheck(validatorChecks['min'], value)) {
			if ('minMsg' in validators) {
				validators['error'] = validators['minMsg'];
			} else {
				validators['error'] = 'Minimum length should be ' + validatorChecks['min'];
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['max'] > 0) {
		if (!maxCheck(validatorChecks['max'], value)) {
			if ('maxMsg' in validators) {
				validators['error'] = validators['maxMsg'];
			} else {
				validators['error'] = 'Maximum length should be ' + validatorChecks['max'];
			}
			validators['valid'] = false;
		}
	}
	// if (validatorKey === 'requiredWhen') {
	// 	if (!isNotEmpty(value)) {
	// 		validators['error'] = 'This field is required';
	// 		validators['valid'] = false;
	// 		return validators;
	// 	}
	// }
	if (validatorChecks['validValues'].length > 0) {
		if (!validatorChecks['validValues'].includes(value)) {
			if ('validMsg' in validators) {
				validators['error'] = validators['validMsg'];
			} else {
				validators['error'] = 'Invalid value';
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['equalTo'] !== '') {
		if (value !== f[validatorChecks['equalTo']]) {
			if ('equalToMsg' in validators) {
				validators['error'] = validators['equalToMsg'];
			} else {
				validators['error'] = 'Value not matched';
			}
			validators['valid'] = false;
		}
	}
	return validators;

}



const emailValidator = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

const phoneValidator = (phone) => {
	return String(phone).match(/^[0-9]{11}$/);
};

const isEmpty = (value) => {
	return value === null || value === undefined || value === '';
};

const isNumber = (value) => {
	return !isNaN(value);
};

const minCheck = (min, value) => {
	return value.length >= min;
};

const maxCheck = (max, value) => {
	return value.length <= max;
};
