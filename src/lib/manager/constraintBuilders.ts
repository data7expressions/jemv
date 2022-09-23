/* eslint-disable @typescript-eslint/ban-types */
import { Schema, IConstraint, IConstraintBuilder, IConstraintManager, ISchemaManager, PropertyType, EvalError } from './../model/schema'
import { FormatCollection } from './formatCollection'
import { FunctionConstraint } from './constraint'
import { Helper } from './'

export class TypeConstraintBuilder implements IConstraintBuilder {
	private formats: FormatCollection
	constructor (formats: FormatCollection) {
		this.formats = formats
	}

	public apply (rule: Schema):boolean {
		return rule.type !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.type === undefined) {
			throw new Error('type not define')
		}
		let func:(value:any, path:string) => Promise<EvalError[]>
		if (typeof rule.type === 'string') {
			switch (rule.type) {
			case PropertyType.null:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value === null ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.boolean:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null && typeof value === 'boolean' ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.string:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null && typeof value === 'string' ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.integer:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null && Number.isInteger(value) ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.decimal:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null && !isNaN(value) ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.number:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null && typeof value === 'number' ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.date:
				func = this.formatDatetime('date'); break
			case PropertyType.datetime:
				func = this.formatDatetime('datetime'); break
			case PropertyType.time:
				func = this.formatDatetime('time'); break
			case PropertyType.object:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null && typeof value === 'object' && !Array.isArray(value) ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.array:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null && Array.isArray(value) ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			default:
				func = async (value:any, path:string) : Promise<EvalError[]> => {
					return value !== null ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}; break
			}
		} else if (Array.isArray(rule.type)) {
			const types = rule.type
			func = async (value:any, path:string) : Promise<EvalError[]> => {
				const type = this.getType(value)
				if ((type === PropertyType.integer || type === PropertyType.decimal) && types.includes(PropertyType.number)) {
					return []
				} else {
					return types.includes(type) ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
				}
			}
		} else {
			func = async (value:any, path:string) : Promise<EvalError[]> => {
				return value !== null ? [] : [{ path: path, message: `invalid type ${rule.type}` }]
			}
		}
		return new FunctionConstraint(func)
	}

	private formatDatetime (format:string): ((value:any, path:string) => Promise<EvalError[]>) {
		return async (value:any, path:string) : Promise<EvalError[]> => {
			if (value === null) {
				return [{ path: path, message: 'value is null' }]
			}
			if (typeof value === 'string') {
				return this.formats.test(format, value) ? [] : [{ path: path, message: `invalid format ${format}` }]
			} else {
				return typeof value.getMonth === 'function' ? [] : [{ path: path, message: `invalid format ${format}` }]
			}
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
}
export class MultipleOfConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.multipleOf !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.multipleOf === undefined) {
			throw new Error('multipleOf not define')
		}
		let func:(value:any, path:string) => Promise<EvalError[]>
		const multipleOf = rule.multipleOf
		if (Math.floor(multipleOf.valueOf()) === multipleOf.valueOf()) {
			func = async (value:any, path:string) : Promise<EvalError[]> => {
				return isNaN(value) || value % multipleOf === 0 ? [] : [{ path: path, message: `is not multiple of ${rule.multipleOf}` }]
			}
		} else {
			// number with decimals
			const decimals = multipleOf.toString().split('.')[1].length
			const shift = Math.pow(10, decimals)
			const multipleOfShift = multipleOf * shift
			func = async (value:any, path:string) : Promise<EvalError[]> => {
				return isNaN(value) || (value * shift) % multipleOfShift === 0 ? [] : [{ path: path, message: `is not multiple of ${rule.multipleOf}` }]
			}
		}
		return new FunctionConstraint(func)
	}
}
export class MinMaxPropertiesConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.minProperties !== undefined || rule.maxProperties !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		const min = rule.minProperties
		const max = rule.maxProperties
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return []
					}
					const properties = Object.keys(value).length
					return properties >= min && properties <= max ? [] : [{ path: path, message: `outside the range from ${min} inclusive to ${max} inclusive properties` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return []
					}
					return Object.keys(value).length >= min ? [] : [{ path: path, message: `should be less or equal than ${min}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return []
					}
					return Object.keys(value).length <= max ? [] : [{ path: path, message: `should be greater or equal than ${max}` }]
				}
			)
		}
		throw new Error('constraint minProperties or maxProperties undefined')
	}
}
export class MinMaxItemsConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.minItems !== undefined || rule.maxItems !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		const min = rule.minItems
		const max = rule.maxItems
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return !Array.isArray(value) || (value.length >= min && value.length <= max) ? [] : [{ path: path, message: `outside the range from ${min} to ${max} items` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return !Array.isArray(value) || value.length >= min ? [] : [{ path: path, message: `should be less or equal than ${min}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return !Array.isArray(value) || value.length <= max ? [] : [{ path: path, message: `should be greater or equal than ${max}` }]
				}
			)
		}
		throw new Error('constraint minItems or maxItems undefined')
	}
}
export class UniqueItemsConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.uniqueItems !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.uniqueItems === undefined) {
			throw new Error('Unique items not define')
		}
		const unique = (source:any[]): boolean => {
			// in the case of serializing add _ to be able to differentiate a string "{}" from a serialized object {}
			const array = source.map(p => p !== null && typeof p === 'object' ? '_' + JSON.stringify(Helper.sortObject(source)) : p)
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
		const func: (value:any, path:string) => Promise<EvalError[]> = rule.uniqueItems
			? async (value:any, path:string) : Promise<EvalError[]> => {
				return !Array.isArray(value) || unique(value) ? [] : [{ path: path, message: 'Invalid unique items' }]
			}
			: async () : Promise<EvalError[]> => {
				return []
			}
		return new FunctionConstraint(func)
	}
}
export class MinMaxLengthConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.minLength !== undefined || rule.maxLength !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		// https://www.acuriousanimal.com/blog/20211205/javascript-handle-unicode
		// https://stackoverflow.com/questions/48009201/how-to-get-the-unicode-code-point-for-a-character-in-javascript
		const min = rule.minLength
		const max = rule.maxLength
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					if (typeof value !== 'string') {
						return []
					}
					if (value === undefined || value === null) {
						return [{ path: path, message: 'undefined value' }]
					}
					const length = Array.from(value).length
					return length >= min && length <= max ? [] : [{ path: path, message: `outside the range of ${min} to ${max}` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					if (typeof value !== 'string') {
						return []
					}
					if (value === undefined || value === null) {
						return [{ path: path, message: 'undefined value' }]
					}
					const length = Array.from(value).length
					return length >= min ? [] : [{ path: path, message: `should be less than ${min}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					if (typeof value !== 'string') {
						return []
					}
					if (value === undefined || value === null) {
						return [{ path: path, message: 'undefined value' }]
					}
					const length = Array.from(value).length
					return length <= max ? [] : [{ path: path, message: `should be greater than ${max}` }]
				}
			)
		}
		throw new Error('constraint minLength or maxLength undefined')
	}
}
export class MinMaxConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.minimum !== undefined || rule.maximum !== undefined || rule.exclusiveMinimum !== undefined || rule.exclusiveMaximum !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		const min = rule.minimum
		const max = rule.maximum
		const exclusiveMinimum = rule.exclusiveMinimum
		const exclusiveMaximum = rule.exclusiveMaximum
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || (value >= min && value) <= max ? [] : [{ path: path, message: `outside the range form ${min} to ${max}` }]
				}
			)
		} else if (exclusiveMinimum !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || (value > exclusiveMinimum && value < exclusiveMaximum) ? [] : [{ path: path, message: `outside the range form ${exclusiveMinimum} exclusive to ${exclusiveMaximum} exclusive` }]
				}
			)
		} else if (min !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || (value >= min && value < exclusiveMaximum) ? [] : [{ path: path, message: `outside the range form ${min} to ${exclusiveMaximum} exclusive` }]
				}
			)
		} else if (exclusiveMinimum !== undefined && max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || (value > exclusiveMinimum && value <= max) ? [] : [{ path: path, message: `outside the range form ${exclusiveMinimum} exclusive to ${max}` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || value >= min ? [] : [{ path: path, message: `should be less or equal than ${min}` }]
				}
			)
		} else if (exclusiveMinimum !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || value > exclusiveMinimum ? [] : [{ path: path, message: `should be less than ${exclusiveMinimum}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || value <= max ? [] : [{ path: path, message: `should be greater or equal than ${max}` }]
				}
			)
		} else if (exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					return isNaN(value) || value < exclusiveMaximum ? [] : [{ path: path, message: `should be greater than ${exclusiveMaximum}` }]
				}
			)
		}
		throw new Error('constraint minimum or maximum undefined')
	}
}
export class PrefixItemsConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.prefixItems !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.prefixItems === undefined) {
			throw new Error('Prefix items not define')
		}
		const itemsConstraint:IConstraint[] = []
		for (const item of rule.prefixItems) {
			const constraint = await this.constraints.build(root, item)
			if (constraint === undefined) {
				throw new Error(`Prefix items constraint ${JSON.stringify(rule)} undefined`)
			}
			itemsConstraint.push(constraint)
		}
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				if (!Array.isArray(value)) {
					return []
				}
				const errors:EvalError[] = []
				for (let i = 0; i < value.length; i++) {
					if (i >= itemsConstraint.length) {
						break
					}
					const childErrors = await itemsConstraint[i].eval(value[i], path + '.' + i)
					if (childErrors.length > 0) {
						errors.push(...errors)
					}
				}
				return errors
			}
		)
	}
}
export class RequiredConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.required !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.required === undefined) {
			throw new Error('required not define')
		}
		const required = rule.required
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				if (typeof value !== 'object' || Array.isArray(value)) {
					return []
				}
				let count = 0
				for (const key of Object.keys(value)) {
					if (required.includes(key)) {
						count++
					}
				}
				return count === required.length
					? []
					: [{ path: path, message: `the following fields are required [${required.join(', ')}]` }]
			}
		)
	}
}
export class EnumConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.enum !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.enum === undefined) {
			throw new Error('Enum not define')
		}
		let values:any[]
		if (Array.isArray(rule.enum)) {
			values = rule.enum
		} else {
			throw new Error('Invalid enum define')
		}
		const showValues = values.join(',')
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				return values.includes(value) ? [] : [{ path: path, message: `not in [${showValues}]` }]
			}
		)
	}
}
export class FormatConstraintBuilder implements IConstraintBuilder {
	private formats: FormatCollection
	constructor (formats: FormatCollection) {
		this.formats = formats
	}

	public apply (rule: Schema):boolean {
		return rule.format !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.format === undefined) {
			throw new Error('Format not define')
		}
		const format = this.formats.get(rule.format)
		if (!format) {
			throw new Error(`Format ${rule.format} not found`)
		}
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				if (typeof value !== 'string') {
					return []
				}
				return format.test(value) ? [] : [{ path: path, message: `does not comply with the format ${rule.format}` }]
			}
		)
	}
}
export class PatternConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.pattern !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.pattern === undefined) {
			throw new Error('Pattern not define')
		}
		const regExp = new RegExp(rule.pattern)
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				return typeof value !== 'string' || regExp.test(value) ? [] : [{ path: path, message: `does not comply with the format ${rule.pattern}` }]
			}
		)
	}
}
export class PatternPropertyConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.patternProperties !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.patternProperties === undefined) {
			throw new Error('patternProperties not define')
		}
		const patternProperties:{ regExp:RegExp, constraint:IConstraint }[] = []
		for (const entry of Object.entries(rule.patternProperties)) {
			let constraint:IConstraint| undefined
			if (typeof entry[1] === 'object') {
				constraint = await this.constraints.build(root, entry[1] as Schema)
			} else if (typeof entry[1] === 'boolean') {
				constraint = new FunctionConstraint(async (value: string, path:string) : Promise<EvalError[]> => {
					return entry[1] as boolean ? [] : [{ path: path, message: 'Pattern properties exists' }]
				})
			}
			if (constraint) {
				patternProperties.push({ regExp: new RegExp(entry[0]), constraint: constraint })
			}
		}
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				const errors:EvalError[] = []
				for (const entry of Object.entries(value)) {
					for (const patternProperty of patternProperties) {
						if (patternProperty.regExp.test(entry[0])) {
							const childErrors = await patternProperty.constraint.eval(entry[1], path)
							if (childErrors.length) {
								errors.push(...childErrors)
							}
						}
					}
				}
				return errors
			}
		)
	}
}
export class ContainsConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.contains !== undefined || rule.minContains !== undefined || rule.maxContains !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		const min = rule.minContains
		const max = rule.maxContains
		if (rule.contains === undefined) {
			if (min !== undefined && max !== undefined) {
				return new FunctionConstraint(
					async (value:any, path:string) : Promise<EvalError[]> => {
						return !Array.isArray(value) || value.length === 0 || (value.length >= min && value.length <= max)
							? []
							: [{ path: path, message: `contains outside the range from ${min} to ${max} items` }]
					}
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(
					async (value:any, path:string) : Promise<EvalError[]> => {
						return !Array.isArray(value) || value.length === 0 || value.length >= min
							? []
							: [{ path: path, message: `contains should be less or equal than ${min}` }]
					}
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(
					async (value:any, path:string) : Promise<EvalError[]> => {
						return !Array.isArray(value) || value.length === 0 || value.length <= max
							? []
							: [{ path: path, message: `contains should be greater or equal than ${max}` }]
					}
				)
			}
		} else if (rule.contains !== undefined && typeof rule.contains === 'boolean') {
			if (min !== undefined && max !== undefined) {
				return new FunctionConstraint(
					async (value:any, path:string) : Promise<EvalError[]> => {
						return !Array.isArray(value) || (value.length >= min && value.length <= max)
							? []
							: [{ path: path, message: `contains outside the range from ${min} to ${max} items` }]
					}
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(
					async (value:any, path:string) : Promise<EvalError[]> => {
						return !Array.isArray(value) || value.length >= min
							? []
							: [{ path: path, message: `contains should be less or equal than ${min}` }]
					}
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(
					async (value:any, path:string) : Promise<EvalError[]> => {
						return !Array.isArray(value) || value.length <= max
							? []
							: [{ path: path, message: `contains should be greater or equal than ${max}` }]
					}
				)
			} else {
				return new FunctionConstraint(
					async (value:any, path:string) : Promise<EvalError[]> => {
						return !Array.isArray(value) || value.length > 0
							? []
							: [{ path: path, message: 'must contain at least one item' }]
					}
				)
			}
		} else if (rule.contains !== undefined) {
			const contains = rule.contains as Schema
			if (contains) {
				const constraint = await this.constraints.build(root, contains)
				if (constraint === undefined) {
					throw new Error(`Contains constraint ${JSON.stringify(rule)} undefined`)
				}
				const getCount = async (value:any[], path:string): Promise<number> => {
					let count = 0
					for (let i = 0; i < value.length; i++) {
						const errors = await constraint.eval(value[i], path)
						if (errors.length === 0) {
							count++
						}
					}
					return count
				}
				if (min !== undefined && max !== undefined) {
					return new FunctionConstraint(
						async (value:any, path:string) : Promise<EvalError[]> => {
							if (!Array.isArray(value)) {
								return []
							}
							const count = await getCount(value, path)
							return count >= min && count <= max
								? []
								: [{ path: path, message: `contains outside the range from ${min} to ${max} items` }]
						}
					)
				} else if (min !== undefined) {
					return new FunctionConstraint(
						async (value:any, path:string) : Promise<EvalError[]> => {
							if (!Array.isArray(value)) {
								return []
							}
							const count = await getCount(value, path)
							return count >= min ? [] : [{ path: path, message: `contains constraint should be less or equal than ${min}` }]
						}
					)
				} else if (max !== undefined) {
					return new FunctionConstraint(
						async (value:any, path:string) : Promise<EvalError[]> => {
							if (!Array.isArray(value)) {
								return []
							}
							const count = await getCount(value, path)
							return count <= max ? [] : [{ path: path, message: `contains should be greater or equal than ${max}` }]
						}
					)
				} else {
					return new FunctionConstraint(
						async (value:any, path:string) : Promise<EvalError[]> => {
							const errors:EvalError[] = []
							if (!Array.isArray(value)) {
								return []
							}
							// at least one item must meet the constraint
							for (let i = 0; i < value.length; i++) {
								const childErrors = await constraint.eval(value[i], path)
								if (childErrors.length === 0) {
									return []
								} else {
									errors.push(...childErrors)
								}
							}
							errors.push({ path: path, message: 'does not meet at least one of the contain rules' })
							return errors
						}
					)
				}
			}
		}
		throw new Error('constraint contains undefined')
	}
}
export class ConstConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.const !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
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
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				if (type === 'object' && isArray) {
					const array = JSON.stringify(value)
					return array === _const ? [] : [{ path: path, message: `Is not ${JSON.stringify(rule.const)}` }]
				} else if (type === 'object' && value !== null) {
					const array = JSON.stringify(Helper.sortObject(value))
					return array === _const ? [] : [{ path: path, message: `Is not ${JSON.stringify(rule.const)}` }]
				} else {
					return _const === value ? [] : [{ path: path, message: `Is not ${JSON.stringify(rule.const)}` }]
				}
			}
		)
	}
}
export class BooleanSchemaConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return typeof rule === 'boolean'
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (typeof rule !== 'boolean') {
			throw new Error('boolean schema not define')
		}
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				return rule ? [] : [{ path: path, message: 'Boolean schema invalid' }]
			}
		)
	}
}
export class IfConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.if !== undefined && (rule.then !== undefined || rule.else !== undefined)
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.if === undefined) {
			throw new Error('if not define')
		}
		if (rule.then === undefined && rule.else === undefined) {
			throw new Error('then or else not define')
		}
		const _if = await this.constraints.build(root, rule.if)
		if (_if === undefined) {
			throw new Error(`constraint ${JSON.stringify(rule)} undefined`)
		}
		const _then = rule.then !== undefined ? await this.constraints.build(root, rule.then) : undefined
		const _else = rule.else !== undefined ? await this.constraints.build(root, rule.else) : undefined
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				const ifErrors = await _if.eval(value, path)
				if (ifErrors.length === 0 && _then !== undefined) {
					return _then !== undefined ? _then.eval(value, path) : []
				} else if (ifErrors.length > 0 && _else !== undefined) {
					return _else.eval(value, path)
				} else {
					return []
				}
			}
		)
	}
}
export class NotConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.not !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.not === undefined) {
			throw new Error('Not rule not define')
		}
		const notConstraint = await this.constraints.build(root, rule.not)
		return new FunctionConstraint(
			async (value:any, path:string) : Promise<EvalError[]> => {
				if (notConstraint) {
					const errors = await notConstraint.eval(value, path)
					return errors.length > 0 ? [] : [{ path: path, message: 'not rule is invalid' }]
				}
				return []
			}
		)
	}
}
export class PropertiesConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.properties !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.properties === undefined) {
			throw new Error('Properties rule not define')
		}
		if (Array.isArray(rule.properties)) {
			throw new Error('Properties should be object and not array')
		}
		const propertiesConstraint: { name:string, constraint:IConstraint}[] = []
		if (typeof rule.properties === 'object') {
			for (const entry of Object.entries(rule.properties)) {
				const propertyConstraint = await this.constraints.build(root, entry[1] as Schema)
				if (propertyConstraint) {
					propertiesConstraint.push({ name: entry[0], constraint: propertyConstraint })
				}
			}
		}
		return new FunctionConstraint(
			async (obj:any, path:string) : Promise<EvalError[]> => {
				const errors:EvalError[] = []
				if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
					for (const propertyConstraint of propertiesConstraint) {
						const value = obj[propertyConstraint.name]
						if (value === undefined) {
							errors.push({ path: path, message: `Property ${propertyConstraint.name} not fount` })
						} else {
							const childErrors = await propertyConstraint.constraint.eval(value, path + '.' + propertyConstraint.name)
							if (childErrors.length > 0) {
								errors.push(...childErrors)
							}
						}
					}
				}
				return errors
			}
		)
	}
}
export class ItemsConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.items !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.items === undefined) {
			throw new Error('Items rule not define')
		}
		if (Array.isArray(rule.items)) {
			throw new Error('Items should be object and not array')
		}
		if (typeof rule.items !== 'object') {
			throw new Error('Items should be object')
		}
		const constraint = await this.constraints.build(root, rule.items)
		return new FunctionConstraint(
			async (array:any, path:string) : Promise<EvalError[]> => {
				const errors:EvalError[] = []
				if (constraint && array && Array.isArray(array)) {
					for (let i = 0; i < array.length; i++) {
						const item = array[i]
						const childErrors = await constraint.eval(item, path + '.' + i)
						if (childErrors.length > 0) {
							errors.push(...childErrors)
						}
					}
				}
				return errors
			}
		)
	}
}
export class RefConstraintBuilder implements IConstraintBuilder {
	private built:any = {}
	private manager: ISchemaManager
	private constraints: IConstraintManager
	constructor (manager: ISchemaManager, constraints: IConstraintManager) {
		this.manager = manager
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.$ref !== undefined
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint> {
		if (rule.$ref === undefined) {
			throw new Error('Reference not define')
		}
		let key:string | undefined
		try {
			key = this.getKey(root, rule.$ref)
			let constraint = this.built[key] as IConstraint | undefined
			if (constraint) {
				return constraint
			}
			let referencedSchema:Schema
			let referencedRule:Schema | undefined
			if (rule.$ref.startsWith('#')) {
				referencedSchema = root
				referencedRule = this.findRule(root, rule.$ref)
				if (referencedRule === undefined) {
					referencedRule = this.findRule(rule, rule.$ref)
					if (referencedRule === undefined) {
						throw new Error(`Ref ${rule.$ref} in schema not found `)
					}
				}
			} else if ((/\w/g).test(rule.$ref) && root.$defs && Object.keys(root.$defs).includes(rule.$ref)) {
				referencedSchema = root
				const found = this.findById(root, rule.$ref)
				if (found === undefined) {
					referencedRule = root.$defs[Helper.decodeUrl(rule.$ref)]
					if (referencedRule === undefined) {
						throw new Error(`Ref ${rule.$ref} schema not found `)
					}
				}
			} else {
				const parts = rule.$ref.split('#')
				referencedSchema = await this.findSchema(root, parts[0])
				if (parts.length === 1) {
					referencedRule = referencedSchema
				} else if (parts.length === 2) {
					referencedRule = this.findRule(referencedSchema, '#' + parts[1])
					if (referencedRule === undefined) {
						throw new Error(`Ref ${parts[1]} in ${parts[0]} schema not found`)
					}
				} else {
					throw new Error(`Ref ${rule.$ref} is invalid`)
				}
			}
			constraint = new FunctionConstraint(
				async (value:any, path:string) : Promise<EvalError[]> => {
					if (referencedRule === undefined) {
						throw new Error(`Ref ${rule.$ref} not found `)
					}
					const constraint = await this.constraints.build(referencedSchema, referencedRule)
					if (constraint) {
						return constraint.eval(value, path)
					}
					return []
				}
			)
			this.built[key] = constraint
			return constraint
		} catch (error:any) {
			if (key !== undefined) {
				throw Error(`Ref ${rule.$ref} in ${key} error: ${error.message} `)
			} else {
				throw Error(`Ref ${rule.$ref} error: ${error.message} `)
			}
		}
	}

	private getKey (current:Schema, path:string) : string {
		if (path.startsWith('http')) {
			return path
		}
		const schemaId = current.$id || Helper.createKey(current)
		if (path.startsWith('#') || path.startsWith('/')) {
			return `${schemaId}/${path}`
		} else if (current.$id) {
			return Helper.urlJoin(current.$id, path)
		} else {
			throw new Error(`${path} invalid uri`)
		}
	}

	private async findSchema (current:Schema, path:string) : Promise<Schema> {
		if (path.startsWith('http')) {
			return this.manager.solve(path)
		} else {
			if (!current.$id) {
				throw Error('$id not defined in current schema')
			}
			// check if the path matches any $id within the current schema
			let found = this.findById(current, path)
			if (found !== undefined) {
				return found
			}
			const uri = Helper.urlJoin(current.$id, path)
			if (uri === path || uri === current.$id) {
				return current
			}
			// check if the uri matches any $id within the current schema
			found = this.findById(current, uri)
			if (found !== undefined) {
				return found
			}
			return this.manager.solve(uri)
		}
	}

	private findRule (schema: Schema, ref:string): Schema | undefined {
		if (!ref.startsWith('#')) {
			// throw Error(`${ref} invalid internal ref`)
			return undefined
		}
		if (ref === '#' || schema.$id === ref) {
			return schema
		} else if (ref.startsWith('#/')) {
			const parts = ref.replace('#/', '').split('/')
			let _current = schema as any
			for (let i = 0; i < parts.length; i++) {
				let part = parts[i]
				part = Helper.decodeUrl(part)
				const child = _current[part]
				if (child === undefined) {
					// throw Error(`path ${parts.splice(0, i).join('.')} not fount in ${ref} ref`)
					return undefined
				}
				_current = child
			}
			return _current as Schema
		} else {
			// throw Error(`Invalid ${ref} ref`)
			return undefined
		}
	}

	private findById (schema: Schema, id:string): Schema | undefined {
		if (Array.isArray(schema)) {
			for (const item of schema) {
				const found = this.findById(item, id)
				if (found) {
					return found
				}
			}
		} else if (typeof schema === 'object') {
			if (schema.$id && schema.$id === id) {
				return schema
			}
			for (const property of Object.values(schema)) {
				const found = this.findById(property, id)
				if (found) {
					return found
				}
			}
		}
		return undefined
	}
}
