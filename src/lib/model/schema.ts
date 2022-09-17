/* eslint-disable @typescript-eslint/ban-types */
export enum PropertyType {
	null = 'null',
	any = 'any',
	boolean = 'boolean',
	number = 'number',
	integer = 'integer',
	decimal = 'decimal',
	string = 'string',
	date = 'date',
	time = 'time',
	datetime = 'datetime',
	object = 'object',
	array = 'array'
}

export interface ContentSchema {
	type:PropertyType
	required?:string[]
}

export interface PropertyNames {
	type:PropertyType
	minLength: number
}

export interface Rule {
	type?: PropertyType | PropertyType[]
	enum?: string[]
	// Validation Keywords for Numeric Instances (number and integer)
	// https://json-schema.org/draft/2020-12/json-schema-validation.html
	// https://opis.io/json-schema/2.x/number.html
	minimum?: number
	maximum?: number
	exclusiveMaximum?: number
	exclusiveMinimum?: number
	multipleOf:number
	// Validation Keywords for Strings
	// https://opis.io/json-schema/2.x/string.html
	maxLength?: number
	minLength?: number
	format?: string
	pattern?: string
	contentEncoding?:string // TODO
	contentMediaType?:string // TODO
	contentSchema?:ContentSchema // TODO
	// Validation Keywords for Objects
	// https://opis.io/json-schema/2.x/object.html
	required?: string[]
	maxProperties?: number
	minProperties?: number
	propertyNames?: PropertyNames // TODO
	patternProperties?: any
	additionalProperties?: any // TODO
	unevaluatedProperties?: any // TODO
	dependentRequired?: any // TODO
	dependencies?: any // TODO
	dependentSchemas?: any // TODO
	// Validation Keywords for Arrays
	// https://opis.io/json-schema/2.x/array.html
	maxItems?: number
	minItems?: number
	uniqueItems?: boolean
	contains?:Rule | Boolean // In process
	maxContains?: number // In process
	minContains?: number
	const?:any // In process
	prefixItems?: any // TODO
	additionalItems?: any // TODO
	unevaluatedItems?: any // TODO
	allOf?:Rule[]
	anyOf?:Rule[]
	oneOf?:Rule[]
	not?:Rule
	if?:Rule
	then?:Rule
	else?:Rule
	properties?: any
	items?: Rule
	// https://json-schema.org/understanding-json-schema/structuring.html?highlight=ref
	$ref?: string
}
export interface Schema extends Rule {
	$id?: string
	$schema?: string
	$extends?: string
	// https://json-schema.org/understanding-json-schema/structuring.html?highlight=defs
	$defs: any
	title?: string
	name?: string
}

// export interface EvalResult {
// valid:boolean
// message?:string
// }

export interface EvalError {
	message:string
	path:string
}

export interface ValidationResult {
	valid:boolean
	errors:EvalError[]
}
// export class EvalResultBuilder {
// private valid:boolean
// private path?:string
// private message?:string
// constructor (valid:boolean, path?:string, message?:string) {
// this.valid = valid
// this.path = path
// this.message = message
// }
// public build (): EvalResult {
// if (this.valid) {
// return { valid: true }
// }
// return { valid: false, path: this.path, message: this.message }
// }
// }
export interface IConstraint {
	eval (value:any, path:string): EvalError[]
}
export interface BuildedSchema {
	$id?: string
	$defs?: any
	// $ref?:string
	// type?: PropertyType | PropertyType[]
	// properties?: any
	// items?:BuildedSchema
	constraint?: IConstraint
}

export interface IConstraintBuilder {
	apply(rule: Rule): boolean
	build(schema:Schema, path:string, rule: Rule): Promise<IConstraint>
}
export interface IConstraintManager {
	addBuilder (constraintBuilder:IConstraintBuilder):any
	build (schema:Schema, path:string, rule: Rule): Promise<IConstraint | undefined>
}

export interface ISchemaCompleter {
	complete (source: Schema): Schema
}
export interface ISchemaProvider {
	add (key:string, schema:Schema): Schema
	solve (value: string|Schema): Promise<Schema>
	find (uri: string) : Promise<Schema>
}

export interface ISchemaBuilder {
	build (schema: Schema): Promise<BuildedSchema>
}

export interface ISchemaManager {
	validate (value: string|Schema, data:any) : Promise<ValidationResult>
}
