/* eslint-disable @typescript-eslint/ban-types */
import { Schema, Constraint, Rule, PropertyType, ValidateResult, ValidateError, BuildedSchema, ConstraintBuilder, FunctionConstraint, ConstraintValidator } from './../model/schema'
import { Helper } from './helper'

export class SchemaCompleter {
	public complete (source: Schema): Schema {
		if (!source) {
			throw new Error('source is empty')
		}
		const schema = Helper.clone(source)
		this.solveUndefined(schema)
		this.extend(schema)
		// this._complete(schema)
		return schema
	}

	private solveUndefined (schema: Schema) {
		if (!schema.$defs) {
			schema.$defs = {}
		}
		this.solvePropertyUndefined(schema)
	}

	private solvePropertyUndefined (property:Schema) {
		if (!property.properties) {
			property.properties = {}
		} else {
			for (const p in property.properties) {
				const child = property.properties[p] as Schema
				this.solvePropertyUndefined(child)
			}
		}
	}

	private extend (schema: Schema) {
		for (const def of Object.values(schema.$defs)) {
			this.extendDef(def as Schema, schema.$defs)
		}
	}

	private extendDef (def: Schema, defs:any): void {
		if (def.$extends) {
			const base = defs[def.$extends] as Schema
			if (base === undefined) {
				throw new Error(`${def.$extends} not found`)
			}
			if (base.$extends) {
				this.extendDef(base, defs)
			}
			// extend
			Helper.extendObject(def, base)
		}
		// remove since it was already extended
		if (def.$extends) {
			delete def.$extends
		}
	}

	// private _complete (schema: Schema): void {
	// this.completeProperty(schema)
	// for (const def of Object.values(schema.$defs)) {
	// this.completeProperty(def as Schema)
	// }
	// }

	// private completeProperty (property: Schema):void {
	// if (property.properties) {
	// for (const p in property.properties) {
	// const child = property.properties[p] as Schema
	// this.completeProperty(child)
	// }
	// }
	// }
}

export class FormatCollection {
	public formats: any
	constructor () {
		this.formats = {}
	}

	public add (key:string, pattern:string):void {
		this.formats[key] = new RegExp(pattern)
	}

	public get (name:string): RegExp {
		return this.formats[name]
	}

	public test (name:string, value:any): boolean {
		const format = this.formats[name] as RegExp
		if (format) {
			return format.test(value)
		}
		throw new Error(`Format ${name} not found`)
	}
}

export class CoreConstraintBuilder implements ConstraintBuilder {
	private formats: FormatCollection
	constructor (formats: FormatCollection) {
		this.formats = formats
	}

	public build (rule: Rule): Constraint[] {
		return this.createConstraints(rule)
	}

	private createConstraints (property: Rule): FunctionConstraint[] {
		const constraints: FunctionConstraint[] = []
		const valueConstraint = this.createTypeConstraint(property)
		if (valueConstraint) {
			constraints.push(valueConstraint)
		}
		if (property.required) {
			constraints.push(this.createRequiredConstraint(property))
		}
		if ((property.minProperties !== undefined || property.maxProperties !== undefined)) {
			constraints.push(this.createMinMaxPropertiesConstraint(property))
		}
		if ((property.minItems !== undefined || property.maxItems !== undefined)) {
			constraints.push(this.createMinMaxItemsConstraint(property))
		}
		if ((property.uniqueItems)) {
			constraints.push(this.createUniqueItemsConstraint(property))
		}
		if (property.minimum !== undefined || property.maximum !== undefined || property.exclusiveMinimum !== undefined || property.exclusiveMaximum !== undefined) {
			constraints.push(this.createMinMaxConstraint(property))
		}
		if (property.enum) {
			constraints.push(this.createEnumConstraint(property))
		}
		if (property.multipleOf !== undefined) {
			constraints.push(this.createMultipleOfConstraint(property))
		}
		if ((property.minLength !== undefined || property.maxLength !== undefined)) {
			constraints.push(this.createMinMaxLengthConstraint(property))
		}
		if (property.format) {
			constraints.push(this.createFormatConstraint(property))
		}
		if (property.pattern) {
			constraints.push(this.createPatternConstraint(property))
		}
		if (property.contains !== undefined || property.minContains !== undefined || property.maxContains !== undefined) {
			constraints.push(this.createContainsConstraint(property))
		}
		return constraints
	}

	private createTypeConstraint (property: Rule): FunctionConstraint | undefined {
		let func:Function| undefined

		if (property.type === undefined) {
			return undefined
		}
		switch (property.type) {
		case PropertyType.null:
			func = (p:any) => p === null; break
		case PropertyType.boolean:
			func = (p:any) => typeof p === 'boolean'; break
		case PropertyType.string:
			func = (p:any) => typeof p === 'string'; break
		case PropertyType.integer:
			func = (p:any) => Number.isInteger(p); break
		case PropertyType.decimal:
			func = (p:any) => !isNaN(p); break
		case PropertyType.date:
			func = this.formatDatetime('date'); break
		case PropertyType.datetime:
			func = this.formatDatetime('datetime'); break
		case PropertyType.time:
			func = this.formatDatetime('time'); break
		case PropertyType.object:
			func = (p:any) => typeof p === 'object' && !Array.isArray(p); break
		case PropertyType.array:
			func = (p:any) => Array.isArray(p); break
		}
		if (func === undefined) {
			return undefined
		}
		return {
			message: `invalid type ${property.type}`,
			func: func
		}
	}

	private formatDatetime (format:string): Function {
		return (p:any) => {
			if (typeof p === 'string') {
				return this.formats.test(format, p)
			} else {
				return typeof p.getMonth === 'function'
			}
		}
	}

	private createMinMaxConstraint (property: Rule): FunctionConstraint {
		const min = property.minimum
		const max = property.maximum
		const exclusiveMinimum = property.exclusiveMinimum
		const exclusiveMaximum = property.exclusiveMaximum
		if (min !== undefined && max !== undefined) {
			return {
				message: `outside the range form ${min} to ${max}`,
				func: (p:any) => isNaN(p) || (p >= min && p <= max)
			}
		} else if (exclusiveMinimum !== undefined && exclusiveMaximum !== undefined) {
			return {
				message: `outside the range form ${exclusiveMinimum} exclusive to ${exclusiveMaximum} exclusive`,
				func: (p:any) => isNaN(p) || (p > exclusiveMinimum && p < exclusiveMaximum)
			}
		} else if (min !== undefined && exclusiveMaximum !== undefined) {
			return {
				message: `outside the range form ${min} to ${exclusiveMaximum} exclusive`,
				func: (p:any) => isNaN(p) || (p >= min && p < exclusiveMaximum)
			}
		} else if (exclusiveMinimum !== undefined && max !== undefined) {
			return {
				message: `outside the range form ${exclusiveMinimum} exclusive to ${max}`,
				func: (p:any) => isNaN(p) || (p > exclusiveMinimum && p <= max)
			}
		} else if (min !== undefined) {
			return {
				message: `should be less or equal than ${min}`,
				func: (p:any) => isNaN(p) || p >= min
			}
		} else if (exclusiveMinimum !== undefined) {
			return {
				message: `should be less than ${exclusiveMinimum}`,
				func: (p:any) => isNaN(p) || p > exclusiveMinimum
			}
		} else if (max !== undefined) {
			return {
				message: `should be greater or equal than ${max}`,
				func: (p:any) => isNaN(p) || p <= max
			}
		} else if (exclusiveMaximum !== undefined) {
			return {
				message: `should be greater than ${exclusiveMaximum}`,
				func: (p:any) => isNaN(p) || p < exclusiveMaximum
			}
		}
		throw new Error('constraint minimum or maximum undefined')
	}

	private createMultipleOfConstraint (property: Rule): FunctionConstraint {
		if (!property.multipleOf) {
			throw new Error('multipleOf not define')
		}
		let func:Function
		const multipleOf = property.multipleOf
		if (Math.floor(multipleOf.valueOf()) === multipleOf.valueOf()) {
			func = (p:number) => isNaN(p) || p % multipleOf === 0
		} else {
			// number with decimals
			const decimals = multipleOf.toString().split('.')[1].length
			const shift = Math.pow(10, decimals)
			const multipleOfShift = multipleOf * shift
			func = (p:number) => {
				return isNaN(p) || (p * shift) % multipleOfShift === 0
			}
		}
		return {
			message: `is not multiple of ${property.multipleOf}`,
			func: func
		}
	}

	private createMinMaxLengthConstraint (property: Rule): FunctionConstraint {
		// https://www.acuriousanimal.com/blog/20211205/javascript-handle-unicode
		// https://stackoverflow.com/questions/48009201/how-to-get-the-unicode-code-point-for-a-character-in-javascript
		const min = property.minLength
		const max = property.maxLength
		if (min !== undefined && max !== undefined) {
			return {
				message: `outside the range of ${min} to ${max}`,
				func: (p:string) => {
					if (typeof p !== 'string') {
						return true
					}
					if (p === undefined || p === null) {
						return false
					}
					const length = Array.from(p).length
					return length >= min && length <= max
				}
			}
		} else if (min !== undefined) {
			return {
				message: `should be less than ${min}`,
				func: (p:string) => {
					if (typeof p !== 'string') {
						return true
					}
					if (p === undefined || p === null) {
						return false
					}
					const length = Array.from(p).length
					return length >= min
				}
			}
		} else if (max !== undefined) {
			return {
				message: `should be greater than ${max}`,
				func: (p:string) => {
					if (typeof p !== 'string') {
						return true
					}
					if (p === undefined || p === null) {
						return false
					}
					const length = Array.from(p).length
					return length <= max
				}
			}
		}
		throw new Error('constraint minLength or maxLength undefined')
	}

	private createEnumConstraint (property: Rule): FunctionConstraint {
		if (!property.enum) {
			throw new Error('Enum not define')
		}
		let values:any[]
		if (Array.isArray(property.enum)) {
			values = property.enum
		// } else if (typeof property.enum === 'string') {
		// const _enum = this.config.getEnum(property.enum)
		// if (!_enum) {
		// throw new Error(`Enum ${property.enum} define in ${property.name} not found`)
		// }
		// values = Object.values(_enum.values)
		} else {
			throw new Error('Invalid enum define')
		}
		const showValues = values.join(',')
		return {
			message: `not in [${showValues}]`,
			func: (p:string) => values.includes(p)
		}
	}

	private createFormatConstraint (property: Rule): FunctionConstraint {
		if (!property.format) {
			throw new Error('Format not define')
		}
		const format = this.formats.get(property.format)
		if (!format) {
			throw new Error(`Format ${property.format} not found`)
		}
		return {
			message: `does not comply with the format ${property.format}`,
			func: (p:string) => format.test(p)
		}
	}

	private createPatternConstraint (property: Rule): FunctionConstraint {
		if (!property.pattern) {
			throw new Error('Pattern not define')
		}
		const regExp = new RegExp(property.pattern)
		return {
			message: `does not comply with the format ${property.pattern}`,
			func: (p:string) => regExp.test(p)
		}
	}

	private createRequiredConstraint (property: Rule): FunctionConstraint {
		return {
			message: `the following fields are required [${property.required?.join(', ')}]`,
			func: (p:any) => {
				if (!property.required) {
					return false
				}
				for (const entry of Object.entries(p)) {
					if (!property.required.includes(entry[0]) || entry[1] === null) {
						return false
					}
				}
				return true
			}
		}
	}

	private createMinMaxPropertiesConstraint (property: Rule): FunctionConstraint {
		const min = property.minProperties
		const max = property.maxProperties
		if (min !== undefined && max !== undefined) {
			return {
				message: `outside the range from ${min} inclusive to ${max} inclusive properties`,
				func: (p:any) => {
					if (typeof p !== 'object' || Array.isArray(p)) {
						return true
					}
					const properties = Object.keys(p).length
					return properties >= min && properties <= max
				}
			}
		} else if (min !== undefined) {
			return {
				message: `should be less or equal than ${min}`,
				func: (p:any) => {
					if (typeof p !== 'object' || Array.isArray(p)) {
						return true
					}
					return Object.keys(p).length >= min
				}
			}
		} else if (max !== undefined) {
			return {
				message: `should be greater or equal than ${max}`,
				func: (p:any) => {
					if (typeof p !== 'object' || Array.isArray(p)) {
						return true
					}
					return Object.keys(p).length <= max
				}
			}
		}
		throw new Error('constraint minProperties or maxProperties undefined')
	}

	private createMinMaxItemsConstraint (property: Rule): FunctionConstraint {
		const min = property.minItems
		const max = property.maxItems
		if (min !== undefined && max !== undefined) {
			return {
				message: `outside the range from ${min} to ${max} items`,
				func: (p:any[]) => !Array.isArray(p) || (p.length >= min && p.length <= max)
			}
		} else if (min !== undefined) {
			return {
				message: `should be less or equal than ${min}`,
				func: (p:any[]) => !Array.isArray(p) || p.length >= min
			}
		} else if (max !== undefined) {
			return {
				message: `should be greater or equal than ${max}`,
				func: (p:any[]) => !Array.isArray(p) || p.length <= max
			}
		}
		throw new Error('constraint minItems or maxItems undefined')
	}

	private createUniqueItemsConstraint (property: Rule): FunctionConstraint {
		return {
			message: `Does not comply with the format ${property.uniqueItems}`,
			func: (p:any[]) => {
				const unique = (value:any, index:number, self:any) => {
					return self.indexOf(value) !== index
				}
				return p.filter(unique).length > 0
			}
		}
	}

	private createContainsConstraint (property: Rule): FunctionConstraint {
		const min = property.minContains
		const max = property.maxContains
		if (property.contains === undefined) {
			if (min !== undefined && max !== undefined) {
				return {
					message: `contains outside the range from ${min} to ${max} items`,
					func: (p:any[]) => !Array.isArray(p) || p.length === 0 || (p.length >= min && p.length <= max)
				}
			} else if (min !== undefined) {
				return {
					message: `contains should be less or equal than ${min}`,
					func: (p:any[]) => !Array.isArray(p) || p.length === 0 || p.length >= min
				}
			} else if (max !== undefined) {
				return {
					message: `contains should be greater or equal than ${max}`,
					func: (p:any[]) => !Array.isArray(p) || p.length === 0 || p.length <= max
				}
			}
		} else if (property.contains !== undefined && typeof property.contains === 'boolean') {
			if (min !== undefined && max !== undefined) {
				return {
					message: `contains outside the range from ${min} to ${max} items`,
					func: (p:any[]) => !Array.isArray(p) || (p.length >= min && p.length <= max)
				}
			} else if (min !== undefined) {
				return {
					message: `contains should be less or equal than ${min}`,
					func: (p:any[]) => !Array.isArray(p) || p.length >= min
				}
			} else if (max !== undefined) {
				return {
					message: `contains should be greater or equal than ${max}`,
					func: (p:any[]) => !Array.isArray(p) || p.length <= max
				}
			} else {
				return {
					message: 'must contain at least one item',
					func: (p:any[]) => !Array.isArray(p) || p.length > 0
				}
			}
		} else if (property.contains !== undefined) {
			const rule = property.contains as Rule
			if (rule) {
				const constraints = this.createConstraints(rule)
				const isValid = (p:any) => {
					for (const constraint of constraints) {
						if (!constraint.func(p)) {
							return false
						}
					}
					return true
				}
				return {
					message: 'does not meet at least one of the contain rules',
					func: (array:any[]) => {
						if (!Array.isArray(array)) {
							return true
						}
						// at least one item must meet the constraint
						for (const p of array) {
							if (isValid(p)) {
								return true
							}
						}
						return false
					}
				}
			}
		}
		throw new Error('constraint minItems or maxItems undefined')
	}
}

export class SchemaBuilder {
	private constraintBuilders:ConstraintBuilder[] = []

	public add (constraintBuilder:ConstraintBuilder) {
		this.constraintBuilders.push(constraintBuilder)
	}

	public build (schema: Schema): BuildedSchema {
		if (!schema) {
			throw new Error('schema is empty')
		}
		const builded = this.create(schema)
		this.createConstraints(builded, schema, schema)
		this.addDef(builded, schema)
		return builded
	}

	private addDef (builded:BuildedSchema, schema: Schema):void {
		if (schema.$defs) {
			builded.$defs = {}
			for (const entry of Object.entries(schema.$defs)) {
				const name = entry[0]
				const child = entry[1] as Schema
				const buildedChild = this.create(child)
				this.createConstraints(buildedChild, schema, child)
				builded.$defs[name] = buildedChild
			}
		}
	}

	private create (source: Schema):BuildedSchema {
		return { $id: source.$id, type: source.type, $ref: source.$ref, $defs: source.$defs, properties: {}, constraints: [] }
	}

	private createConstraints (builded:BuildedSchema, schema: Schema, property: Schema):void {
		for (const constraintBuilder of this.constraintBuilders) {
			const constraints = constraintBuilder.build(property)
			if (constraints.length > 0) {
				builded.constraints.push(...constraints)
			}
		}

		if (property.type === PropertyType.object) {
			// iterate through the child properties
			if (property.properties) {
				for (const name in property.properties) {
					const child = property.properties[name] as Schema
					const buildedChild = this.create(child)
					this.createConstraints(buildedChild, schema, child)
					builded.properties[name] = buildedChild
				}
			}
		} else if (property.type === PropertyType.array) {
			// iterate through the items properties
			if (property.items) {
				const buildedItems = this.create(property.items)
				this.createConstraints(buildedItems, schema, property.items)
				builded.items = buildedItems
			}
		}
	}
}

export class SchemaCollection {
	private list:any
	private completer: SchemaCompleter
	private builder: SchemaBuilder
	constructor (completer: SchemaCompleter, builder: SchemaBuilder) {
		this.list = {}
		this.completer = completer
		this.builder = builder
	}

	public async get (value: string|Schema) : Promise<BuildedSchema> {
		let builded:BuildedSchema|undefined
		if (typeof value === 'string') {
			builded = await this.find(value)
			if (builded === undefined) {
				throw new Error(`Uri ${value} not found`)
			}
		} else {
			if ((value as Schema) === undefined) {
				throw new Error('Parameter value is invalid')
			}
			// get a key that uniquely identifies a schema
			const key = value.$id ? value.$id : JSON.stringify(value)
			// look for the schema in the cache list
			builded = this.list[key] as BuildedSchema | undefined
			if (builded === undefined) {
				// if it doesn't exist in cache, add it
				builded = this.build(value)
				this.list[key] = builded
			}
		}
		return builded
	}

	public async getByRef (root:BuildedSchema, parent: BuildedSchema, ref:string): Promise<BuildedSchema> {
		if (ref.startsWith('#/$defs')) {
			return this.findInternal(root, ref)
		} else if (ref.startsWith('#')) {
			return this.findInternal(parent, ref)
		} else if (ref.startsWith('http')) {
			return await this.find(ref)
		} else if (ref.startsWith('/')) {
			if (!root.$id) {
				throw Error('$id not defined in schema')
			}
			const uri = new URL(root.$id, ref).href
			return await this.find(uri)
		} else {
			throw Error(`Ref: ${ref} is invalid`)
		}
	}

	public async find (uri: string) : Promise<BuildedSchema> {
		if (Helper.isEmpty(uri)) {
			throw Error('uri is empty')
		}
		const parts = uri.split('#')
		const key = parts[0]
		// look for the schema in the list that makes cache
		let builded = this.list[key] as BuildedSchema | undefined
		if (!builded) {
			// if it is not in cache it looks for it externally
			const schema = await this.findExternal(key)
			builded = this.build(schema)
			this.list[key] = builded
		}
		if (parts.length === 1) {
			return builded
		} else if (parts.length === 2) {
			return this.findInternal(builded, parts[1])
		} else {
			throw new Error(`${uri} invalid uri`)
		}
	}

	private async findExternal (uri: string) : Promise<Schema> {
		const content = await Helper.get(uri)
		const schema = Helper.tryParse(content) as Schema
		if (!schema) {
			throw Error(`The schema with the uri ${uri} was not found`)
		}
		return schema
	}

	private findInternal (property: BuildedSchema, ref:string):BuildedSchema {
		if (!ref.startsWith('#')) {
			throw Error(`${ref} invalid internal ref`)
		}
		if (ref === '#') {
			return property
		} else if (ref.startsWith('#/')) {
			const parts = ref.replace('#/', '').split('/')
			let _current = property as any
			for (let i = 0; i < parts.length; i++) {
				const part = parts[i]
				const child = _current[part]
				if (child === undefined) {
					throw Error(`path ${parts.splice(0, i).join('.')} not fount in ${ref} ref`)
				}
				_current = child
			}
			return _current as BuildedSchema
		} else {
			throw Error(`Invalid ${ref} ref`)
		}
	}

	private build (schema: Schema): BuildedSchema {
		const completed = this.completer.complete(schema)
		return this.builder.build(completed)
	}
}

export class FunctionConstraintValidator implements ConstraintValidator {
	public apply (constraint: Constraint): boolean {
		return 'func' in (constraint as FunctionConstraint)
	}

	public validate (constraint: Constraint, data: any): boolean {
		const functionConstraint = constraint as FunctionConstraint
		if (functionConstraint !== undefined) {
			return functionConstraint.func(data)
		} else {
			throw new Error('Undefined FunctionConstraint')
		}
	}
}

export class SchemaValidator {
	private schemas: SchemaCollection
	private constraintsValidator: ConstraintValidator[] = []
	constructor (schemas: SchemaCollection) {
		this.schemas = schemas
	}

	public add (constraintValidator:ConstraintValidator) {
		this.constraintsValidator.push(constraintValidator)
	}

	public async validate (schema:BuildedSchema, data: any): Promise<ValidateResult> {
		const errors:ValidateError[] = []
		if (data === undefined || data === null) {
			errors.push({ message: 'data is empty', path: '.' })
		} else {
			const propertyErrors = await this.validateProperty(schema, schema, data)
			if (propertyErrors.length > 0) {
				errors.push(...propertyErrors)
			}
		}
		return { errors: errors, valid: errors.length === 0 }
	}

	private async validateProperty (root: BuildedSchema, property: BuildedSchema, data: any, path = ''): Promise<ValidateError[]> {
		const errors:ValidateError[] = []
		const propertyErrors = this.validateConstraints(property, path, data)
		if (propertyErrors.length) {
			errors.push(...propertyErrors)
		}
		if (property.type === PropertyType.object && property.properties) {
			for (const entry of Object.entries(property.properties)) {
				const name = entry[0]
				const childProperty = entry[1] as BuildedSchema
				const childPath = `${path}.${name}`
				const value = data[name]
				if (value !== undefined && value !== null) {
					const child = await this.getFromProperty(root, property, childProperty)
					if (!child) {
						throw new Error(`Schema not found in ${childPath}`)
					}
					const childErrors = await this.validateProperty(property, child, value, childPath)
					if (childErrors.length) {
						errors.push(...childErrors)
					}
				}
			}
		} else if (property.type === PropertyType.array) {
			if (!property.items) {
				throw new Error(`Schema items not found in ${path}.items`)
			}
			const itemsSchema = await this.getFromProperty(root, property, property.items)
			if (!itemsSchema) {
				throw new Error(`Schema not found in ${path}.items`)
			}
			for (let i = 0; i < data.length; i++) {
				const childPath = `${path}.${i}`
				const item = data[i]
				if (item === null) {
					errors.push({ path: childPath, message: 'value is null' })
				} else {
					const childErrors = await this.validateProperty(root, itemsSchema, item, childPath)
					if (childErrors.length) {
						errors.push(...childErrors)
					}
				}
			}
		}
		return errors
	}

	private async getFromProperty (root: BuildedSchema, parent: BuildedSchema, property:BuildedSchema) : Promise<BuildedSchema|undefined> {
		if (property.$ref) {
			return await this.schemas.getByRef(root, parent, property.$ref)
		} else if (property) {
			return property
		} else {
			return undefined
		}
	}

	private validateConstraints (source: BuildedSchema, path:string, data: any): ValidateError[] {
		const errors:ValidateError[] = []
		if (source.constraints) {
			for (const constraint of source.constraints) {
				const constraintValidator = this.getConstraintValidator(constraint)
				if (!constraintValidator.validate(constraint, data)) {
					errors.push({ path: path, message: constraint.message })
				}
			}
		}
		return errors
	}

	private getConstraintValidator (constraint: Constraint): ConstraintValidator {
		for (const constraintValidator of this.constraintsValidator) {
			if (constraintValidator.apply(constraint)) {
				return constraintValidator
			}
		}
		throw new Error('Constraint Validator not found')
	}
}
