/* eslint-disable @typescript-eslint/ban-types */
import { exit } from 'process'
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

	private createConstraints (rule: Rule): FunctionConstraint[] {
		const constraints: FunctionConstraint[] = []

		if (rule.type !== undefined) {
			constraints.push(this.createTypeConstraint(rule))
		}
		if (rule.required !== undefined) {
			constraints.push(this.createRequiredConstraint(rule))
		}
		if (rule.minProperties !== undefined || rule.maxProperties !== undefined) {
			constraints.push(this.createMinMaxPropertiesConstraint(rule))
		}
		if (rule.minItems !== undefined || rule.maxItems !== undefined) {
			constraints.push(this.createMinMaxItemsConstraint(rule))
		}
		if (rule.uniqueItems !== undefined) {
			constraints.push(this.createUniqueItemsConstraint(rule))
		}
		if (rule.prefixItems !== undefined) {
			constraints.push(this.createPrefixItemsConstraint(rule))
		}
		if (rule.minimum !== undefined || rule.maximum !== undefined || rule.exclusiveMinimum !== undefined || rule.exclusiveMaximum !== undefined) {
			constraints.push(this.createMinMaxConstraint(rule))
		}
		if (rule.enum) {
			constraints.push(this.createEnumConstraint(rule))
		}
		if (rule.multipleOf !== undefined) {
			constraints.push(this.createMultipleOfConstraint(rule))
		}
		if ((rule.minLength !== undefined || rule.maxLength !== undefined)) {
			constraints.push(this.createMinMaxLengthConstraint(rule))
		}
		if (rule.format !== undefined) {
			constraints.push(this.createFormatConstraint(rule))
		}
		if (rule.pattern !== undefined) {
			constraints.push(this.createPatternConstraint(rule))
		}
		if (rule.patternProperties !== undefined) {
			constraints.push(this.createPatternPropertyConstraint(rule))
		}
		if (rule.contains !== undefined || rule.minContains !== undefined || rule.maxContains !== undefined) {
			constraints.push(this.createContainsConstraint(rule))
		}
		if (rule.const !== undefined) {
			constraints.push(this.createConstConstraint(rule))
		}
		return constraints
	}

	private createTypeConstraint (rule: Rule): FunctionConstraint {
		if (rule.type === undefined) {
			throw new Error('type not define')
		}
		let func:Function
		if (typeof rule.type === 'string') {
			switch (rule.type) {
			case PropertyType.null:
				func = (p:any) => p === null; break
			case PropertyType.boolean:
				func = (p:any) => p !== null && typeof p === 'boolean'; break
			case PropertyType.string:
				func = (p:any) => p !== null && typeof p === 'string'; break
			case PropertyType.integer:
				func = (p:any) => p !== null && Number.isInteger(p); break
			case PropertyType.decimal:
				func = (p:any) => p !== null && !isNaN(p); break
			case PropertyType.number:
				func = (p:any) => {
					return p !== null && typeof p === 'number'
				}; break
			case PropertyType.date:
				func = this.formatDatetime('date'); break
			case PropertyType.datetime:
				func = this.formatDatetime('datetime'); break
			case PropertyType.time:
				func = this.formatDatetime('time'); break
			case PropertyType.object:
				func = (p:any) => p !== null && typeof p === 'object' && !Array.isArray(p); break
			case PropertyType.array:
				func = (p:any) => p !== null && Array.isArray(p); break
			default:
				func = (p:any) => p !== null; break
			}
		} else if (Array.isArray(rule.type)) {
			const types = rule.type
			func = (p:any) => {
				const type = this.getType(p)
				if ((type === PropertyType.integer || type === PropertyType.decimal) && types.includes(PropertyType.number)) {
					return true
				} else {
					return types.includes(type)
				}
			}
		} else {
			func = (p:any) => p !== null
		}
		return {
			message: `invalid type ${rule.type}`,
			func: func
		}
	}

	private getType (value: any): PropertyType {
		if (value === null) {
			return PropertyType.null
		} else if (typeof value === 'boolean') {
			return PropertyType.boolean
		} else if (Number.isInteger(value)) {
			return PropertyType.integer
		} else if (!isNaN(value)) {
			return PropertyType.decimal
		} else if (typeof value === 'object' && Array.isArray(value)) {
			return PropertyType.array
		} else if (typeof value === 'object') {
			return PropertyType.object
		} else if (typeof value === 'string' && this.formats.test('date', value)) {
			return PropertyType.date
		} else if (typeof value === 'string' && this.formats.test('time', value)) {
			return PropertyType.time
		} else if (typeof value === 'string' && this.formats.test('datetime', value)) {
			return PropertyType.datetime
		} else if (typeof value === 'string') {
			return PropertyType.string
		} else {
			return PropertyType.any
		}
	}

	private formatDatetime (format:string): Function {
		return (p:any) => {
			if (p === null) {
				return false
			}
			if (typeof p === 'string') {
				return this.formats.test(format, p)
			} else {
				return typeof p.getMonth === 'function'
			}
		}
	}

	private createMinMaxConstraint (rule: Rule): FunctionConstraint {
		const min = rule.minimum
		const max = rule.maximum
		const exclusiveMinimum = rule.exclusiveMinimum
		const exclusiveMaximum = rule.exclusiveMaximum
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

	private createMultipleOfConstraint (rule: Rule): FunctionConstraint {
		if (rule.multipleOf === undefined) {
			throw new Error('multipleOf not define')
		}
		let func:Function
		const multipleOf = rule.multipleOf
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
			message: `is not multiple of ${rule.multipleOf}`,
			func: func
		}
	}

	private createMinMaxLengthConstraint (rule: Rule): FunctionConstraint {
		// https://www.acuriousanimal.com/blog/20211205/javascript-handle-unicode
		// https://stackoverflow.com/questions/48009201/how-to-get-the-unicode-code-point-for-a-character-in-javascript
		const min = rule.minLength
		const max = rule.maxLength
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

	private createEnumConstraint (rule: Rule): FunctionConstraint {
		if (rule.enum === undefined) {
			throw new Error('Enum not define')
		}
		let values:any[]
		if (Array.isArray(rule.enum)) {
			values = rule.enum
		// } else if (typeof rule.enum === 'string') {
		// const _enum = this.config.getEnum(rule.enum)
		// if (!_enum) {
		// throw new Error(`Enum ${rule.enum} define in ${rule.name} not found`)
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

	private createFormatConstraint (rule: Rule): FunctionConstraint {
		if (rule.format === undefined) {
			throw new Error('Format not define')
		}
		const format = this.formats.get(rule.format)
		if (!format) {
			throw new Error(`Format ${rule.format} not found`)
		}
		return {
			message: `does not comply with the format ${rule.format}`,
			func: (p:string) => format.test(p)
		}
	}

	private createPatternConstraint (rule: Rule): FunctionConstraint {
		if (rule.pattern === undefined) {
			throw new Error('Pattern not define')
		}
		const regExp = new RegExp(rule.pattern)
		return {
			message: `does not comply with the format ${rule.pattern}`,
			func: (p:string) => typeof p === 'string' ? regExp.test(p) : true
		}
	}

	private createPatternPropertyConstraint (rule: Rule): FunctionConstraint {
		if (rule.patternProperties === undefined) {
			throw new Error('patternProperties not define')
		}
		const patternProperties:any[] = []
		for (const entry of Object.entries(rule.patternProperties)) {
			let constraints:FunctionConstraint[] = []
			if (typeof entry[1] === 'object') {
				constraints = this.createConstraints(entry[1] as Rule)
			} else if (typeof entry[1] === 'boolean') {
				constraints = [{ message: 'Pattern properties exists', func: (p:any) => entry[1] }]
			}
			patternProperties.push({ regExp: new RegExp(entry[0]), constraints: constraints })
		}
		return {
			message: 'Pattern properties invalid',
			func: (p:string) => {
				for (const entry of Object.entries(p)) {
					for (const patternProperty of patternProperties) {
						if (patternProperty.regExp.test(entry[0])) {
							for (const constrain of patternProperty.constraints) {
								if (!constrain.func(entry[1])) {
									return false
								}
							}
						}
					}
				}
				return true
			}
		}
	}

	private createRequiredConstraint (rule: Rule): FunctionConstraint {
		if (rule.required === undefined) {
			throw new Error('required not define')
		}
		const required = rule.required
		return {
			message: `the following fields are required [${required.join(', ')}]`,
			func: (p:any) => {
				if (typeof p !== 'object' || Array.isArray(p)) {
					return true
				}
				let count = 0
				for (const key of Object.keys(p)) {
					if (required.includes(key)) {
						count++
					}
				}
				return count === required.length
			}
		}
	}

	private createMinMaxPropertiesConstraint (rule: Rule): FunctionConstraint {
		const min = rule.minProperties
		const max = rule.maxProperties
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

	private createMinMaxItemsConstraint (rule: Rule): FunctionConstraint {
		const min = rule.minItems
		const max = rule.maxItems
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

	private createUniqueItemsConstraint (rule: Rule): FunctionConstraint {
		if (rule.uniqueItems === undefined) {
			throw new Error('Unique items not define')
		}
		const unique = (source:any[]): boolean => {
			// in the case of serializing add _ to be able to differentiate a string "{}" from a serialized object {}
			const array = source.map(p => p !== null && typeof p === 'object' ? '_' + JSON.stringify(Helper.sortObject(p)) : p)
			const uniques:any[] = []
			for (let i = 0; i < array.length; i++) {
				if (!uniques.includes(array[i])) {
					uniques.push(array[i])
				} else {
					return false
				}
			}
			return true
		}
		const func:Function = rule.uniqueItems
			? (p:any[]) => !Array.isArray(p) ? true : unique(p)
			: (p:any[]) => true
			// : (p:any[]) => !Array.isArray(p) ? true : !unique(p)
		return {
			message: 'Invalid unique items',
			func: func
		}
	}

	private createContainsConstraint (rule: Rule): FunctionConstraint {
		const min = rule.minContains
		const max = rule.maxContains
		if (rule.contains === undefined) {
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
		} else if (rule.contains !== undefined && typeof rule.contains === 'boolean') {
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
		} else if (rule.contains !== undefined) {
			const contains = rule.contains as Rule
			if (contains) {
				const constraints = this.createConstraints(contains)
				const isValid = (p:any) => {
					for (const constraint of constraints) {
						if (!constraint.func(p)) {
							return false
						}
					}
					return true
				}
				if (min !== undefined && max !== undefined) {
					return {
						message: `contains outside the range from ${min} to ${max} items`,
						func: (array:any[]) => {
							if (!Array.isArray(array)) {
								return true
							}
							let count = 0
							for (const p of array) {
								if (isValid(p)) {
									count++
								}
							}
							return count >= min && count <= max
						}
					}
				} else if (min !== undefined) {
					return {
						message: `contains should be less or equal than ${min}`,
						func: (array:any[]) => {
							if (!Array.isArray(array)) {
								return true
							}
							let count = 0
							for (const p of array) {
								if (isValid(p)) {
									count++
								}
							}
							return count >= min
						}
					}
				} else if (max !== undefined) {
					return {
						message: `contains should be greater or equal than ${max}`,
						func: (array:any[]) => {
							if (!Array.isArray(array)) {
								return true
							}
							let count = 0
							for (const p of array) {
								if (isValid(p)) {
									count++
								}
							}
							return count <= max
						}
					}
				} else {
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
		}
		throw new Error('constraint contains undefined')
	}

	private createConstConstraint (rule: Rule): FunctionConstraint {
		if (rule.const === undefined) {
			throw new Error('Const not define')
		}
		const type = typeof rule.const
		let _const:any
		let isArray = false
		if (type === 'object' && Array.isArray(rule.const)) {
			_const = JSON.stringify(rule.const)
			isArray = true
		} else if (type === 'object' && rule.const !== null) {
			_const = JSON.stringify(Helper.sortObject(rule.const))
		} else {
			_const = rule.const
		}
		return {
			message: `Is not ${JSON.stringify(rule.const)}`,
			func: (p:any) => {
				if (type === 'object' && isArray) {
					const value = JSON.stringify(p)
					return value === _const
				} else if (type === 'object' && p !== null) {
					const value = JSON.stringify(Helper.sortObject(p))
					return value === _const
				} else {
					return _const === p
				}
			}
		}
	}

	private createPrefixItemsConstraint (rule: Rule): FunctionConstraint {
		if (rule.prefixItems === undefined) {
			throw new Error('Prefix items not define')
		}
		const itemsConstraints:FunctionConstraint[][] = []
		for (const item of rule.prefixItems) {
			const constraints = this.createConstraints(item)
			itemsConstraints.push(constraints)
		}
		return {
			message: 'Prefix items invalid',
			func: (array:any[]) => {
				if (!Array.isArray(array)) {
					return true
				}
				for (let i = 0; i < array.length; i++) {
					if (i >= itemsConstraints.length) {
						break
					}
					for (const constraint of itemsConstraints[i]) {
						if (!constraint.func(array[i])) {
							return false
						}
					}
				}
				return true
			}
		}
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
		if (data === undefined) {
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
				if (value !== undefined) {
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
		} else if (property.type === PropertyType.array && property.items !== undefined) {
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
