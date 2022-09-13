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
	// https://json-schema.org/understanding-json-schema/structuring.html?highlight=ref
	$ref?: string
	items?: Rule
	properties?: any
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
	patternProperties?: any // TODO
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
	minContains?: number // In process
	const?:any // In process
	prefixItems?: any // TODO
	additionalItems?: any // TODO
	unevaluatedItems?: any // TODO
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

export interface IConstraint {
	message: string
	eval (data: any): boolean
}
export interface BuildedSchema {
	$id?: string
	$defs?: any
	$ref?:string
	type?: PropertyType | PropertyType[]
	properties?: any
	items?:BuildedSchema
	constraints: IConstraint[]
}
export interface ValidateError {
	message:string
	path:string
}
export interface ValidateResult {
	errors:ValidateError[]
	valid: boolean
}

export interface IConstraintBuilder {
	apply(rule: Rule):boolean
	build(rule: Rule): IConstraint
}
export interface IConstraintFactory {
	addConstraintBuilder (constraintBuilder:IConstraintBuilder):any
	buildConstraints (rule: Rule):IConstraint[]
}

export interface ISchemaCompleter {
	complete (source: Schema): Schema
}
export interface ISchemaCollection {
	get (value: string|Schema) : Promise<BuildedSchema>
	getByRef (root:BuildedSchema, parent: BuildedSchema, ref:string): Promise<BuildedSchema>
	find (uri: string) : Promise<BuildedSchema>
}

export interface ISchemaBuilder {
	build (schema: Schema): BuildedSchema
}

export interface ISchemaValidator {
	validate (schema:BuildedSchema, data: any): Promise<ValidateResult>
}
