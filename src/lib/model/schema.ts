import { Schema as SchemaBase } from 'schema-manager'
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

export interface InternalId {
	id: string
	path: string
}
export interface Schema extends SchemaBase {
	title?: string
	name?: string
	properties?: any
	items?: Schema
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
	contains?:Schema | Boolean // In process
	maxContains?: number // In process
	minContains?: number
	const?:any // In process
	prefixItems?: any // TODO
	additionalItems?: any // TODO
	unevaluatedItems?: any // TODO
	allOf?:Schema[]
	anyOf?:Schema[]
	oneOf?:Schema[]
	not?:Schema
	if?:Schema
	then?:Schema
	else?:Schema
}

export interface EvalError {
	message:string
	path:string
}

export interface ValidationResult {
	valid:boolean
	errors:EvalError[]
}
export interface IConstraint {
	eval (value:any, path:string): EvalError[]
}
export interface BuildedSchema {
	$id?: string
	constraint?: IConstraint
}

export interface IConstraintBuilder {
	apply(rule: Schema): boolean
	build(root:Schema, rule: Schema): IConstraint
}
export interface IConstraintManager {
	addBuilder (constraintBuilder:IConstraintBuilder):any
	build (root:Schema, rule: Schema): IConstraint | undefined
}
