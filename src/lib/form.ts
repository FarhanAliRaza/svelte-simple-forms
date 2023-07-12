// Developer: Farhan Ali Raza
// Purpose: Form Validation Library
// Github: github.com/FarhanAliRaza
// Lisece: MIT

import { writable } from 'svelte/store';

const validValidators = [
	'required',
	'email',
	'bool',
	'phone',
	'number',
	'min',
	'max',
	'requiredWhen',
	'validValues',
	'equalTo',
	'default'
];

const defaultValidators = {
	required: true,
	email: false,
	emailAllowedDomains: [], //TODO:
	phone: false,
	number: false,
	min: 0,
	max: 0,
	requiredWhen: '', //TODO:
	validValues: [], //TODO:
	equalTo: '',
	default: null
};

function initForm(form) {
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
		if (validators.default) {
			newForm[key] = validators.default;
		} else {
			newForm[key] = '';
		}
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
	return newForm;
}


function createDefaultErrors(formKeys){

	const errors = {};
	for (let index = 0; index < formKeys.length; index++) {
		const key = formKeys[index];
		errors[key] = [];
	}
	return errors;
}



export function createForm(defaultForm = {}) {
	const formKeys = Object.keys(defaultForm);
	defaultForm = initForm(defaultForm);

	return {
		...defaultForm,
		formKeys,
		errors: createDefaultErrors(formKeys),
		validate: function () {
			const keys = formKeys;
			this['isValid'] = true;
			for (let index = 0; index < keys.length; index++) {
				const key = keys[index];
				const field_value = this[key];
				const vkey = key + 'Data';
				const validators = this[vkey];
				const new_validators = validate(this, field_value, validators, key);
				this[vkey] = new_validators;
				if (new_validators['valid'] == false) {
					this['isValid'] = false;
				}
				console.log('new_validators', new_validators, key);
			}
			return this;
		}
	};
}



function isTouched(value) {
	return value !== '';
}

function validate(f, value, validators, key) {
	const validatorChecks = validators.validators;
	if (validators['touched'] == false) {
		validators['touched'] = isTouched(value);
	}
	if (validators['touched'] == false) {
		return validators;
	}
	validators['valid'] = true;
	console.log('errors ********', f.errors[key]);
	f.errors[key] = [];

	if (validatorChecks['required'] == true) {
		if (isEmpty(value)) {
			if ('requiredMsg' in validators) {
				f.errors[key].push(validators['requiredMsg']);
			} else {
				f.errors[key].push('This field is required');
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['email'] == true) {
		if (!emailValidator(value)) {
			if ('emailMsg' in validators) {
				f.errors[key].push(validators['emailMsg']);
			} else {
				f.errors[key].push('Invalid email address');
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['phone'] == true) {
		if (!phoneValidator(value)) {
			if ('phoneMsg' in validators) {
				f.errors[key].push(validators['phoneMsg']);
			} else {
				f.errors[key].push('Invalid phone number');
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['number'] == true) {
		if (!isNumber(value)) {
			if ('numberMsg' in validators) {
				f.errors[key].push(validators['numberMsg']);
			} else {
				f.errors[key].push('Only numbers are allowed');
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['min'] > 0) {
		if (!minCheck(validatorChecks['min'], value)) {
			if ('minMsg' in validators) {
				f.errors[key].push(validators['minMsg']);
			} else {
				f.errors[key].push('Minimum length should be ' + validatorChecks['min']);
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['max'] > 0) {
		if (!maxCheck(validatorChecks['max'], value)) {
			if ('maxMsg' in validators) {
				f.errors[key].push(validators['maxMsg']);
			} else {
				f.errors[key].push('Maximum length should be ' + validatorChecks['max']);
			}
			validators['valid'] = false;
		}
	}

	if (validatorChecks['validValues'].length > 0) {
		if (!validatorChecks['validValues'].includes(value)) {
			if ('validMsg' in validators) {
				f.errors[key].push(validators['validMsg']);
			} else {
				f.errors[key].push('Invalid value');
			}
			validators['valid'] = false;
		}
	}
	if (validatorChecks['equalTo'] !== '') {
		if (value !== f[validatorChecks['equalTo']]) {
			if ('equalToMsg' in validators) {
				f.errors[key].push(validators['equalToMsg']);
			} else {
				f.errors[key].push('Value not matched');
			}
			validators['valid'] = false;
		}
	}
	console.log('validatorKey at end', validators);
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
export function createFormStore(defaultForm = {}) {
	const formKeys = Object.keys(defaultForm);
	defaultForm = initForm(defaultForm);
	const { subscribe, set, update } = writable({
		...defaultForm,
		formKeys,
		errors: createDefaultErrors(formKeys),
	});

	return {
		subscribe,
		set,
		validate: () =>
			update((f) => {
				console.log('f', f);
				const keys = f.formKeys;
				f['isValid'] = true;
				for (let index = 0; index < keys.length; index++) {
					const key = keys[index];
					const field_value = f[key];
					const vkey = key + 'Data';
					const validators = f[vkey];
					const new_validators = validate(f, field_value, validators, key);
					f[vkey] = new_validators;
					if (new_validators['valid'] == false) {
						f['isValid'] = false;
					}

					console.log('new_validators', new_validators, key);
				}
				return f;
			})
	};
}