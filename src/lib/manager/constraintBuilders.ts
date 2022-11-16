/* eslint-disable @typescript-eslint/ban-types */
import { Schema, IConstraint, IConstraintBuilder, IConstraintManager, PropertyType, EvalError } from './../model/schema'
import { ISchemaManager } from 'schema-manager'
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.type === undefined) {
			throw new Error('type not define')
		}
		let func:(value:any, path:string) => EvalError[]
		if (typeof rule.type === 'string') {
			switch (rule.type) {
			case PropertyType.null:
				func = (value:any, path:string) : EvalError[] => {
					return value === null ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.boolean:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null && typeof value === 'boolean' ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.string:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null && typeof value === 'string' ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.integer:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null && Number.isInteger(value) ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.decimal:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null && !isNaN(value) ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.number:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null && typeof value === 'number' ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.date:
				func = this.formatDatetime('date'); break
			case PropertyType.datetime:
				func = this.formatDatetime('datetime'); break
			case PropertyType.time:
				func = this.formatDatetime('time'); break
			case PropertyType.object:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null && typeof value === 'object' && !Array.isArray(value) ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			case PropertyType.array:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null && Array.isArray(value) ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			default:
				func = (value:any, path:string) : EvalError[] => {
					return value !== null ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}; break
			}
		} else if (Array.isArray(rule.type)) {
			const types = rule.type
			func = (value:any, path:string) : EvalError[] => {
				const type = this.getType(value)
				if ((type === PropertyType.integer || type === PropertyType.decimal) && types.includes(PropertyType.number)) {
					return []
				} else {
					return types.includes(type) ? [] : [{ path, message: `invalid type ${rule.type}` }]
				}
			}
		} else {
			func = (value:any, path:string) : EvalError[] => {
				return value !== null ? [] : [{ path, message: `invalid type ${rule.type}` }]
			}
		}
		return new FunctionConstraint(func)
	}

	private formatDatetime (format:string): ((value:any, path:string) => EvalError[]) {
		return (value:any, path:string) : EvalError[] => {
			if (value === null) {
				return [{ path, message: 'value is null' }]
			}
			if (typeof value === 'string') {
				return this.formats.test(format, value) ? [] : [{ path, message: `invalid format ${format}` }]
			} else {
				return typeof value.getMonth === 'function' ? [] : [{ path, message: `invalid format ${format}` }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.multipleOf === undefined) {
			throw new Error('multipleOf not define')
		}
		let func:(value:any, path:string) => EvalError[]
		const multipleOf = rule.multipleOf
		if (Math.floor(multipleOf.valueOf()) === multipleOf.valueOf()) {
			func = (value:any, path:string) : EvalError[] => {
				return isNaN(value) || value % multipleOf === 0 ? [] : [{ path, message: `is not multiple of ${rule.multipleOf}` }]
			}
		} else {
			// number with decimals
			const decimals = multipleOf.toString().split('.')[1].length
			const shift = Math.pow(10, decimals)
			const multipleOfShift = multipleOf * shift
			func = (value:any, path:string) : EvalError[] => {
				return isNaN(value) || (value * shift) % multipleOfShift === 0 ? [] : [{ path, message: `is not multiple of ${rule.multipleOf}` }]
			}
		}
		return new FunctionConstraint(func)
	}
}
export class MinMaxPropertiesConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.minProperties !== undefined || rule.maxProperties !== undefined
	}

	public build (root:Schema, rule: Schema): IConstraint {
		const min = rule.minProperties
		const max = rule.maxProperties
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return []
					}
					const properties = Object.keys(value).length
					return properties >= min && properties <= max ? [] : [{ path, message: `outside the range from ${min} inclusive to ${max} inclusive properties` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return []
					}
					return Object.keys(value).length >= min ? [] : [{ path, message: `should be less or equal than ${min}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return []
					}
					return Object.keys(value).length <= max ? [] : [{ path, message: `should be greater or equal than ${max}` }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		const min = rule.minItems
		const max = rule.maxItems
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return !Array.isArray(value) || (value.length >= min && value.length <= max) ? [] : [{ path, message: `outside the range from ${min} to ${max} items` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return !Array.isArray(value) || value.length >= min ? [] : [{ path, message: `should be less or equal than ${min}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return !Array.isArray(value) || value.length <= max ? [] : [{ path, message: `should be greater or equal than ${max}` }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.uniqueItems === undefined) {
			throw new Error('Unique items not define')
		}
		const unique = (source:any[]): boolean => {
			// in the case of serializing add _ to be able to differentiate a string "{}" from a serialized object {}
			const array = source.map(p => p !== null && typeof p === 'object' ? '_' + JSON.stringify(Helper.obj.sort(source)) : p)
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
		const func: (value:any, path:string) => EvalError[] = rule.uniqueItems
			? (value:any, path:string) : EvalError[] => {
				return !Array.isArray(value) || unique(value) ? [] : [{ path, message: 'Invalid unique items' }]
			}
			: () : EvalError[] => {
				return []
			}
		return new FunctionConstraint(func)
	}
}
export class MinMaxLengthConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.minLength !== undefined || rule.maxLength !== undefined
	}

	public build (root:Schema, rule: Schema): IConstraint {
		// https://www.acuriousanimal.com/blog/20211205/javascript-handle-unicode
		// https://stackoverflow.com/questions/48009201/how-to-get-the-unicode-code-point-for-a-character-in-javascript
		const min = rule.minLength
		const max = rule.maxLength
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					if (typeof value !== 'string') {
						return []
					}
					if (value === undefined || value === null) {
						return [{ path, message: 'undefined value' }]
					}
					const length = Array.from(value).length
					return length >= min && length <= max ? [] : [{ path, message: `outside the range of ${min} to ${max}` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					if (typeof value !== 'string') {
						return []
					}
					if (value === undefined || value === null) {
						return [{ path, message: 'undefined value' }]
					}
					const length = Array.from(value).length
					return length >= min ? [] : [{ path, message: `should be less than ${min}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					if (typeof value !== 'string') {
						return []
					}
					if (value === undefined || value === null) {
						return [{ path, message: 'undefined value' }]
					}
					const length = Array.from(value).length
					return length <= max ? [] : [{ path, message: `should be greater than ${max}` }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		const min = rule.minimum
		const max = rule.maximum
		const exclusiveMinimum = rule.exclusiveMinimum
		const exclusiveMaximum = rule.exclusiveMaximum
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || (value >= min && value) <= max ? [] : [{ path, message: `outside the range form ${min} to ${max}` }]
				}
			)
		} else if (exclusiveMinimum !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || (value > exclusiveMinimum && value < exclusiveMaximum) ? [] : [{ path, message: `outside the range form ${exclusiveMinimum} exclusive to ${exclusiveMaximum} exclusive` }]
				}
			)
		} else if (min !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || (value >= min && value < exclusiveMaximum) ? [] : [{ path, message: `outside the range form ${min} to ${exclusiveMaximum} exclusive` }]
				}
			)
		} else if (exclusiveMinimum !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || (value > exclusiveMinimum && value <= max) ? [] : [{ path, message: `outside the range form ${exclusiveMinimum} exclusive to ${max}` }]
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || value >= min ? [] : [{ path, message: `should be less or equal than ${min}` }]
				}
			)
		} else if (exclusiveMinimum !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || value > exclusiveMinimum ? [] : [{ path, message: `should be less than ${exclusiveMinimum}` }]
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || value <= max ? [] : [{ path, message: `should be greater or equal than ${max}` }]
				}
			)
		} else if (exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					return isNaN(value) || value < exclusiveMaximum ? [] : [{ path, message: `should be greater than ${exclusiveMaximum}` }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.prefixItems === undefined) {
			throw new Error('Prefix items not define')
		}
		const itemsConstraint:IConstraint[] = []
		for (const item of rule.prefixItems) {
			const constraint = this.constraints.build(root, item)
			if (constraint === undefined) {
				throw new Error(`Prefix items constraint ${JSON.stringify(rule)} undefined`)
			}
			itemsConstraint.push(constraint)
		}
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
				if (!Array.isArray(value)) {
					return []
				}
				const errors:EvalError[] = []
				for (let i = 0; i < value.length; i++) {
					if (i >= itemsConstraint.length) {
						break
					}
					const childErrors = itemsConstraint[i].eval(value[i], path + '.' + i)
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.required === undefined) {
			throw new Error('required not define')
		}
		const required = rule.required
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
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
					: [{ path, message: `the following fields are required [${required.join(', ')}]` }]
			}
		)
	}
}
export class EnumConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.enum !== undefined
	}

	public build (root:Schema, rule: Schema): IConstraint {
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
			(value:any, path:string) : EvalError[] => {
				return values.includes(value) ? [] : [{ path, message: `not in [${showValues}]` }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.format === undefined) {
			throw new Error('Format not define')
		}
		const format = this.formats.get(rule.format)
		if (!format) {
			throw new Error(`Format ${rule.format} not found`)
		}
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
				if (typeof value !== 'string') {
					return []
				}
				return format.test(value) ? [] : [{ path, message: `does not comply with the format ${rule.format}` }]
			}
		)
	}
}
export class PatternConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return rule.pattern !== undefined
	}

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.pattern === undefined) {
			throw new Error('Pattern not define')
		}
		const regExp = new RegExp(rule.pattern)
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
				return typeof value !== 'string' || regExp.test(value) ? [] : [{ path, message: `does not comply with the format ${rule.pattern}` }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		const min = rule.minContains
		const max = rule.maxContains
		if (rule.contains === undefined) {
			if (min !== undefined && max !== undefined) {
				return new FunctionConstraint(
					(value:any, path:string) : EvalError[] => {
						return !Array.isArray(value) || value.length === 0 || (value.length >= min && value.length <= max)
							? []
							: [{ path, message: `contains outside the range from ${min} to ${max} items` }]
					}
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(
					(value:any, path:string) : EvalError[] => {
						return !Array.isArray(value) || value.length === 0 || value.length >= min
							? []
							: [{ path, message: `contains should be less or equal than ${min}` }]
					}
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(
					(value:any, path:string) : EvalError[] => {
						return !Array.isArray(value) || value.length === 0 || value.length <= max
							? []
							: [{ path, message: `contains should be greater or equal than ${max}` }]
					}
				)
			}
		} else if (rule.contains !== undefined && typeof rule.contains === 'boolean') {
			if (min !== undefined && max !== undefined) {
				return new FunctionConstraint(
					(value:any, path:string) : EvalError[] => {
						return !Array.isArray(value) || (value.length >= min && value.length <= max)
							? []
							: [{ path, message: `contains outside the range from ${min} to ${max} items` }]
					}
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(
					(value:any, path:string) : EvalError[] => {
						return !Array.isArray(value) || value.length >= min
							? []
							: [{ path, message: `contains should be less or equal than ${min}` }]
					}
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(
					(value:any, path:string) : EvalError[] => {
						return !Array.isArray(value) || value.length <= max
							? []
							: [{ path, message: `contains should be greater or equal than ${max}` }]
					}
				)
			} else {
				return new FunctionConstraint(
					(value:any, path:string) : EvalError[] => {
						return !Array.isArray(value) || value.length > 0
							? []
							: [{ path, message: 'must contain at least one item' }]
					}
				)
			}
		} else if (rule.contains !== undefined) {
			const contains = rule.contains as Schema
			if (contains) {
				const constraint = this.constraints.build(root, contains)
				if (constraint === undefined) {
					throw new Error(`Contains constraint ${JSON.stringify(rule)} undefined`)
				}
				const getCount = (value:any[], path:string): number => {
					let count = 0
					for (let i = 0; i < value.length; i++) {
						const errors = constraint.eval(value[i], path)
						if (errors.length === 0) {
							count++
						}
					}
					return count
				}
				if (min !== undefined && max !== undefined) {
					return new FunctionConstraint(
						(value:any, path:string) : EvalError[] => {
							if (!Array.isArray(value)) {
								return []
							}
							const count = getCount(value, path)
							return count >= min && count <= max
								? []
								: [{ path, message: `contains outside the range from ${min} to ${max} items` }]
						}
					)
				} else if (min !== undefined) {
					return new FunctionConstraint(
						(value:any, path:string) : EvalError[] => {
							if (!Array.isArray(value)) {
								return []
							}
							const count = getCount(value, path)
							return count >= min ? [] : [{ path, message: `contains constraint should be less or equal than ${min}` }]
						}
					)
				} else if (max !== undefined) {
					return new FunctionConstraint(
						(value:any, path:string) : EvalError[] => {
							if (!Array.isArray(value)) {
								return []
							}
							const count = getCount(value, path)
							return count <= max ? [] : [{ path, message: `contains should be greater or equal than ${max}` }]
						}
					)
				} else {
					return new FunctionConstraint(
						(value:any, path:string) : EvalError[] => {
							const errors:EvalError[] = []
							if (!Array.isArray(value)) {
								return []
							}
							// at least one item must meet the constraint
							for (let i = 0; i < value.length; i++) {
								const childErrors = constraint.eval(value[i], path)
								if (childErrors.length === 0) {
									return []
								} else {
									errors.push(...childErrors)
								}
							}
							errors.push({ path, message: 'does not meet at least one of the contain rules' })
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

	public build (root:Schema, rule: Schema): IConstraint {
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
			_const = JSON.stringify(Helper.obj.sort(rule.const))
		} else {
			_const = rule.const
		}
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
				if (type === 'object' && isArray) {
					const array = JSON.stringify(value)
					return array === _const ? [] : [{ path, message: `Is not ${JSON.stringify(rule.const)}` }]
				} else if (type === 'object' && value !== null) {
					const array = JSON.stringify(Helper.obj.sort(value))
					return array === _const ? [] : [{ path, message: `Is not ${JSON.stringify(rule.const)}` }]
				} else {
					return _const === value ? [] : [{ path, message: `Is not ${JSON.stringify(rule.const)}` }]
				}
			}
		)
	}
}
export class BooleanSchemaConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Schema):boolean {
		return typeof rule === 'boolean'
	}

	public build (root:Schema, rule: Schema): IConstraint {
		if (typeof rule !== 'boolean') {
			throw new Error('boolean schema not define')
		}
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
				return rule ? [] : [{ path, message: 'Boolean schema invalid' }]
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.if === undefined) {
			throw new Error('if not define')
		}
		if (rule.then === undefined && rule.else === undefined) {
			throw new Error('then or else not define')
		}
		const _if = this.constraints.build(root, rule.if)
		if (_if === undefined) {
			throw new Error(`constraint ${JSON.stringify(rule)} undefined`)
		}
		const _then = rule.then !== undefined ? this.constraints.build(root, rule.then) : undefined
		const _else = rule.else !== undefined ? this.constraints.build(root, rule.else) : undefined
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
				const ifErrors = _if.eval(value, path)
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.not === undefined) {
			throw new Error('Not rule not define')
		}
		const notConstraint = this.constraints.build(root, rule.not)
		return new FunctionConstraint(
			(value:any, path:string) : EvalError[] => {
				if (notConstraint) {
					const errors = notConstraint.eval(value, path)
					return errors.length > 0 ? [] : [{ path, message: 'not rule is invalid' }]
				}
				return []
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

	public build (root:Schema, rule: Schema): IConstraint {
		if (rule.items === undefined) {
			throw new Error('Items rule not define')
		}
		if (Array.isArray(rule.items)) {
			throw new Error('Items should be object and not array')
		}
		if (typeof rule.items !== 'object') {
			throw new Error('Items should be object')
		}
		const constraint = this.constraints.build(root, rule.items)
		return new FunctionConstraint(
			(array:any, path:string) : EvalError[] => {
				const errors:EvalError[] = []
				if (constraint && array && Array.isArray(array)) {
					for (let i = 0; i < array.length; i++) {
						const item = array[i]
						const childErrors = constraint.eval(item, path + '.' + i)
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
	private schemaManager: ISchemaManager
	private constraints: IConstraintManager
	constructor (schemaManager: ISchemaManager, constraints: IConstraintManager) {
		this.schemaManager = schemaManager
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.$ref !== undefined && typeof rule.$ref === 'string'
	}

	public build (root:Schema, rule: Schema): IConstraint {
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
			const refInfo = this.schemaManager.solveRef(root, rule.$ref)
			if (refInfo === undefined || refInfo.schema === undefined || refInfo.referenced === undefined) {
				throw new Error(`Ref ${rule.$ref} not found`)
			}
			const referencedSchema = refInfo.schema as Schema
			const referencedRule = refInfo.referenced as Schema
			constraint = new FunctionConstraint(
				(value:any, path:string) : EvalError[] => {
					const constraint = this.constraints.build(referencedSchema, referencedRule)
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
		const schemaId = current.$id || Helper.obj.createKey(current)
		if (path.startsWith('#') || path.startsWith('/')) {
			return `${schemaId}/${path}`
		} else if (current.$id) {
			return Helper.http.urlJoin(current.$id, path)
		} else {
			throw new Error(`${path} invalid uri`)
		}
	}
}

export class PropertiesConstraintBuilder implements IConstraintBuilder {
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public apply (rule: Schema):boolean {
		return rule.properties !== undefined ||
			rule.patternProperties !== undefined ||
			rule.additionalProperties !== undefined
	}

	public build (root:Schema, rule: Schema): IConstraint {
		const propertiesConstraint:{ name:string, constraint:IConstraint | undefined }[] = []
		const patternProperties:{ regExp:RegExp, constraint:IConstraint | undefined }[] = []

		if (rule.properties !== undefined && typeof rule.properties === 'object') {
			for (const entry of Object.entries(rule.properties)) {
				const propertyConstraint = this.constraints.build(root, entry[1] as Schema)
				propertiesConstraint.push({ name: entry[0], constraint: propertyConstraint })
			}
		}
		if (rule.patternProperties !== undefined) {
			for (const entry of Object.entries(rule.patternProperties)) {
				let constraint:IConstraint| undefined
				if (typeof entry[1] === 'object') {
					constraint = this.constraints.build(root, entry[1] as Schema)
				} else if (typeof entry[1] === 'boolean') {
					constraint = new FunctionConstraint((value: string, path:string) : EvalError[] => {
						return entry[1] as boolean ? [] : [{ path, message: 'Pattern properties exists' }]
					})
				}
				patternProperties.push({ regExp: new RegExp(entry[0]), constraint })
			}
		}
		const additionalProperties = rule.additionalProperties === undefined ||
									typeof rule.additionalProperties !== 'boolean' ||
									rule.additionalProperties
		const additionalPropertiesConstraint = rule.additionalProperties !== undefined && typeof rule.additionalProperties !== 'boolean'
			? this.constraints.build(root, rule.additionalProperties as Schema)
			: undefined
		return new FunctionConstraint(
			(obj:any, path:string) : EvalError[] => {
				const errors:EvalError[] = []
				if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
					for (const entry of Object.entries(obj)) {
						const propertyErrors:EvalError[] = []
						const patternErrors:EvalError[] = []
						let isAdditional = true

						const propertyConstraint = propertiesConstraint.find(p => p.name === entry[0])
						if (propertyConstraint) {
							isAdditional = false
							if (propertyConstraint.constraint) {
								const childErrors = propertyConstraint.constraint.eval(entry[1], path + '.' + propertyConstraint.name)
								if (childErrors.length) {
									propertyErrors.push(...childErrors)
								}
							}
						}
						for (const patternProperty of patternProperties) {
							if (patternProperty.regExp.test(entry[0])) {
								isAdditional = false
								if (patternProperty.constraint) {
									const childErrors = patternProperty.constraint.eval(entry[1], path)
									if (childErrors.length) {
										patternErrors.push(...childErrors)
									}
								}
							}
						}

						if (propertyConstraint && patternProperties.length > 0) {
							// en el caso que están las dos reglas definidas , con que cumpla una alcanza
							if (propertyErrors.length > 0 && patternErrors.length > 0) {
								errors.push(...propertyErrors, ...patternErrors)
							}
						} else if (propertyConstraint && propertyErrors.length > 0) {
							errors.push(...propertyErrors)
						} else if (patternProperties.length > 0 && patternErrors.length > 0) {
							errors.push(...patternErrors)
						}
						if (!additionalProperties && isAdditional) {
							errors.push({ path, message: `The additional property ${entry[0]} is not allowed` })
						}
						if (additionalPropertiesConstraint !== undefined && isAdditional) {
							const childErrors = additionalPropertiesConstraint.eval(entry[1], path)
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
