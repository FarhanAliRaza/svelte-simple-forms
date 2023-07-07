export type Field = {
	required: boolean;
	email?: boolean;
	// optional
	phone?: boolean;
	number?: boolean;
	min?: number;
	max?: number;
	requiredWhen?: string;
	validValues?: Array<string>;
	equalTo?: string;
};

export type FormType = {
	[key: string]: Field;
};
