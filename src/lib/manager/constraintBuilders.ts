/* eslint-disable @typescript-eslint/ban-types */
import { Rule, IConstraint, IConstraintBuilder, IConstraintFactory, PropertyType, EvalResult } from './../model/schema'
import { FormatCollection } from './formatCollection'
import { FunctionConstraint } from './constraint'
import { Helper } from './helper'

export class TypeConstraintBuilder implements IConstraintBuilder {
	private formats: FormatCollection
	constructor (formats: FormatCollection) {
		this.formats = formats
	}

	public apply (rule: Rule):boolean {
		return rule.type !== undefined
	}

	public build (rule: Rule): IConstraint {
		if (rule.type === undefined) {
			throw new Error('type not define')
		}
		let func:(value:any) => EvalResult
		if (typeof rule.type === 'string') {
			switch (rule.type) {
			case PropertyType.null:
				func = (value:any) : EvalResult => {
					return { valid: value === null, message: `invalid type ${rule.type}` }
				}; break
			case PropertyType.boolean:
				func = (value:any) : EvalResult => {
					return { valid: value !== null && typeof value === 'boolean', message: `invalid type ${rule.type}` }
				}; break
			case PropertyType.string:
				func = (value:any) : EvalResult => {
					return { valid: value !== null && typeof value === 'string', message: `invalid type ${rule.type}` }
				}; break
			case PropertyType.integer:
				func = (value:any) : EvalResult => {
					return { valid: value !== null && Number.isInteger(value), message: `invalid type ${rule.type}` }
				}; break
			case PropertyType.decimal:
				func = (value:any) : EvalResult => {
					return { valid: value !== null && !isNaN(value), message: `invalid type ${rule.type}` }
				}; break
			case PropertyType.number:
				func = (value:any) : EvalResult => {
					return { valid: value !== null && typeof value === 'number', message: `invalid type ${rule.type}` }
				}; break
			case PropertyType.date:
				func = this.formatDatetime('date'); break
			case PropertyType.datetime:
				func = this.formatDatetime('datetime'); break
			case PropertyType.time:
				func = this.formatDatetime('time'); break
			case PropertyType.object:
				func = (value:any) : EvalResult => {
					return { valid: value !== null && typeof value === 'object' && !Array.isArray(value), message: `invalid type ${rule.type}` }
				}; break
			case PropertyType.array:
				func = (value:any) : EvalResult => {
					return { valid: value !== null && Array.isArray(value), message: `invalid type ${rule.type}` }
				}; break
			default:
				func = (value:any) : EvalResult => {
					return { valid: value !== null, message: `invalid type ${rule.type}` }
				}; break
			}
		} else if (Array.isArray(rule.type)) {
			const types = rule.type
			func = (value:any) : EvalResult => {
				const type = this.getType(value)
				if ((type === PropertyType.integer || type === PropertyType.decimal) && types.includes(PropertyType.number)) {
					return { valid: true }
				} else {
					return { valid: types.includes(type), message: `invalid type ${rule.type}` }
				}
			}
		} else {
			func = (value:any) : EvalResult => {
				return { valid: value !== null, message: `invalid type ${rule.type}` }
			}
		}
		return new FunctionConstraint(func)
	}

	private formatDatetime (format:string): ((value:any) => EvalResult) {
		return (value:any) : EvalResult => {
			if (value === null) {
				return { valid: false, message: 'value is null' }
			}
			if (typeof value === 'string') {
				return { valid: this.formats.test(format, value), message: `invalid format ${format}` }
			} else {
				return { valid: typeof value.getMonth === 'function', message: `invalid format ${format}` }
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
	public apply (rule: Rule):boolean {
		return rule.multipleOf !== undefined
	}

	public build (rule: Rule): IConstraint {
		if (rule.multipleOf === undefined) {
			throw new Error('multipleOf not define')
		}
		let func:(value:any) => EvalResult
		const multipleOf = rule.multipleOf
		if (Math.floor(multipleOf.valueOf()) === multipleOf.valueOf()) {
			func = (value:any) : EvalResult => {
				return { valid: isNaN(value) || value % multipleOf === 0, message: `is not multiple of ${rule.multipleOf}` }
			}
		} else {
			// number with decimals
			const decimals = multipleOf.toString().split('.')[1].length
			const shift = Math.pow(10, decimals)
			const multipleOfShift = multipleOf * shift
			func = (value:any) : EvalResult => {
				return { valid: isNaN(value) || (value * shift) % multipleOfShift === 0, message: `is not multiple of ${rule.multipleOf}` }
			}
		}
		return new FunctionConstraint(func)
	}
}
export class MinMaxPropertiesConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.minProperties !== undefined || rule.maxProperties !== undefined
	}

	public build (rule: Rule): IConstraint {
		const min = rule.minProperties
		const max = rule.maxProperties
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return { valid: true }
					}
					const properties = Object.keys(value).length
					return { valid: properties >= min && properties <= max, message: `outside the range from ${min} inclusive to ${max} inclusive properties` }
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return { valid: true }
					}
					return { valid: Object.keys(value).length >= min, message: `should be less or equal than ${min}` }
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					if (typeof value !== 'object' || Array.isArray(value)) {
						return { valid: true }
					}
					return { valid: Object.keys(value).length <= max, message: `should be greater or equal than ${max}` }
				}
			)
		}
		throw new Error('constraint minProperties or maxProperties undefined')
	}
}
export class MinMaxItemsConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.minItems !== undefined || rule.maxItems !== undefined
	}

	public build (rule: Rule): IConstraint {
		const min = rule.minItems
		const max = rule.maxItems
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: !Array.isArray(value) || (value.length >= min && value.length <= max), message: `outside the range from ${min} to ${max} items` }
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: !Array.isArray(value) || value.length >= min, message: `should be less or equal than ${min}` }
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: !Array.isArray(value) || value.length <= max, message: `should be greater or equal than ${max}` }
				}
			)
		}
		throw new Error('constraint minItems or maxItems undefined')
	}
}
export class UniqueItemsConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.uniqueItems !== undefined
	}

	public build (rule: Rule): IConstraint {
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
		const func:(value:any) => EvalResult = rule.uniqueItems
			? (value:any) : EvalResult => {
				return { valid: !Array.isArray(value) ? true : unique(value), message: 'Invalid unique items' }
			}
			: () : EvalResult => {
				return { valid: true }
			}
		return new FunctionConstraint(func)
	}
}
export class MinMaxLengthConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.minLength !== undefined || rule.maxLength !== undefined
	}

	public build (rule: Rule): IConstraint {
		// https://www.acuriousanimal.com/blog/20211205/javascript-handle-unicode
		// https://stackoverflow.com/questions/48009201/how-to-get-the-unicode-code-point-for-a-character-in-javascript
		const min = rule.minLength
		const max = rule.maxLength
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					if (typeof value !== 'string') {
						return { valid: true }
					}
					if (value === undefined || value === null) {
						return { valid: false, message: 'undefined value' }
					}
					const length = Array.from(value).length
					return { valid: length >= min && length <= max, message: `outside the range of ${min} to ${max}` }
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					if (typeof value !== 'string') {
						return { valid: true }
					}
					if (value === undefined || value === null) {
						return { valid: false, message: 'undefined value' }
					}
					const length = Array.from(value).length
					return { valid: length >= min, message: `should be less than ${min}` }
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					if (typeof value !== 'string') {
						return { valid: true }
					}
					if (value === undefined || value === null) {
						return { valid: false, message: 'undefined value' }
					}
					const length = Array.from(value).length
					return { valid: length <= max, message: `should be greater than ${max}` }
				}
			)
		}
		throw new Error('constraint minLength or maxLength undefined')
	}
}
export class MinMaxConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.minimum !== undefined || rule.maximum !== undefined || rule.exclusiveMinimum !== undefined || rule.exclusiveMaximum !== undefined
	}

	public build (rule: Rule): IConstraint {
		const min = rule.minimum
		const max = rule.maximum
		const exclusiveMinimum = rule.exclusiveMinimum
		const exclusiveMaximum = rule.exclusiveMaximum
		if (min !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || (value >= min && value <= max), message: `outside the range form ${min} to ${max}` }
				}
			)
		} else if (exclusiveMinimum !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || (value > exclusiveMinimum && value < exclusiveMaximum), message: `outside the range form ${exclusiveMinimum} exclusive to ${exclusiveMaximum} exclusive` }
				}
			)
		} else if (min !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || (value >= min && value < exclusiveMaximum), message: `outside the range form ${min} to ${exclusiveMaximum} exclusive` }
				}
			)
		} else if (exclusiveMinimum !== undefined && max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || (value > exclusiveMinimum && value <= max), message: `outside the range form ${exclusiveMinimum} exclusive to ${max}` }
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || value >= min, message: `should be less or equal than ${min}` }
				}
			)
		} else if (exclusiveMinimum !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || value > exclusiveMinimum, message: `should be less than ${exclusiveMinimum}` }
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || value <= max, message: `should be greater or equal than ${max}` }
				}
			)
		} else if (exclusiveMaximum !== undefined) {
			return new FunctionConstraint(
				(value:any) : EvalResult => {
					return { valid: isNaN(value) || value < exclusiveMaximum, message: `should be greater than ${exclusiveMaximum}` }
				}
			)
		}
		throw new Error('constraint minimum or maximum undefined')
	}
}
export class PrefixItemsConstraintBuilder implements IConstraintBuilder {
	private factory: IConstraintFactory
	constructor (factory: IConstraintFactory) {
		this.factory = factory
	}

	public apply (rule: Rule):boolean {
		return rule.prefixItems !== undefined
	}

	public build (rule: Rule): IConstraint {
		if (rule.prefixItems === undefined) {
			throw new Error('Prefix items not define')
		}
		const itemsConstraint:IConstraint[] = []
		for (const item of rule.prefixItems) {
			const constraint = this.factory.build(item)
			if (constraint === undefined) {
				throw new Error(`Prefix items constraint ${JSON.stringify(rule)} undefined`)
			}
			itemsConstraint.push(constraint)
			// if (constraint) {
			// itemsConstraint.push(constraint)
			// }
		}
		return new FunctionConstraint(
			(value:any) : EvalResult => {
				if (!Array.isArray(value)) {
					return { valid: true }
				}
				for (let i = 0; i < value.length; i++) {
					if (i >= itemsConstraint.length) {
						break
					}
					const result = itemsConstraint[i].eval(value[i])
					if (!result.valid) {
						return result
					}
				}
				return { valid: true }
			}
		)
	}
}
export class RequiredConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.required !== undefined
	}

	public build (rule: Rule): IConstraint {
		if (rule.required === undefined) {
			throw new Error('required not define')
		}
		const required = rule.required
		return new FunctionConstraint(
			(value:any) : EvalResult => {
				if (typeof value !== 'object' || Array.isArray(value)) {
					return { valid: true }
				}
				let count = 0
				for (const key of Object.keys(value)) {
					if (required.includes(key)) {
						count++
					}
				}
				return { valid: count === required.length, message: `the following fields are required [${required.join(', ')}]` }
			}
		)
	}
}
export class EnumConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.enum !== undefined
	}

	public build (rule: Rule): IConstraint {
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
			(value:any) : EvalResult => {
				return { valid: values.includes(value), message: `not in [${showValues}]` }
			}
		)
	}
}
export class FormatConstraintBuilder implements IConstraintBuilder {
	private formats: FormatCollection
	constructor (formats: FormatCollection) {
		this.formats = formats
	}

	public apply (rule: Rule):boolean {
		return rule.format !== undefined
	}

	public build (rule: Rule): IConstraint {
		if (rule.format === undefined) {
			throw new Error('Format not define')
		}
		const format = this.formats.get(rule.format)
		if (!format) {
			throw new Error(`Format ${rule.format} not found`)
		}
		return new FunctionConstraint(
			(value:any) : EvalResult => {
				if (typeof value !== 'string') {
					return { valid: true }
				}
				return { valid: format.test(value), message: `does not comply with the format ${rule.format}` }
			}
		)
	}
}
export class PatternConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.pattern !== undefined
	}

	public build (rule: Rule): IConstraint {
		if (rule.pattern === undefined) {
			throw new Error('Pattern not define')
		}
		const regExp = new RegExp(rule.pattern)
		return new FunctionConstraint(
			(value:any) : EvalResult => {
				return { valid: typeof value === 'string' ? regExp.test(value) : true, message: `does not comply with the format ${rule.pattern}` }
			}
		)
	}
}
export class PatternPropertyConstraintBuilder implements IConstraintBuilder {
	private factory: IConstraintFactory
	constructor (factory: IConstraintFactory) {
		this.factory = factory
	}

	public apply (rule: Rule):boolean {
		return rule.patternProperties !== undefined
	}

	public build (rule: Rule): IConstraint {
		if (rule.patternProperties === undefined) {
			throw new Error('patternProperties not define')
		}
		const patternProperties:{ regExp:RegExp, constraint:IConstraint }[] = []
		for (const entry of Object.entries(rule.patternProperties)) {
			let constraint:IConstraint| undefined
			if (typeof entry[1] === 'object') {
				constraint = this.factory.build(entry[1] as Rule)
			} else if (typeof entry[1] === 'boolean') {
				constraint = new FunctionConstraint(() : EvalResult => {
					return { valid: entry[1] as boolean, message: 'Pattern properties exists' }
				})
			}
			if (constraint) {
				patternProperties.push({ regExp: new RegExp(entry[0]), constraint: constraint })
			}
		}
		return new FunctionConstraint(
			(value:any) : EvalResult => {
				for (const entry of Object.entries(value)) {
					for (const patternProperty of patternProperties) {
						if (patternProperty.regExp.test(entry[0])) {
							if (!patternProperty.constraint.eval(entry[1]).valid) {
								return { valid: false, message: 'Pattern properties invalid' }
							}
						}
					}
				}
				return { valid: true }
			}
		)
	}
}
export class ContainsConstraintBuilder implements IConstraintBuilder {
	private factory: IConstraintFactory
	constructor (factory: IConstraintFactory) {
		this.factory = factory
	}

	public apply (rule: Rule):boolean {
		return rule.contains !== undefined || rule.minContains !== undefined || rule.maxContains !== undefined
	}

	public build (rule: Rule): IConstraint {
		const min = rule.minContains
		const max = rule.maxContains
		if (rule.contains === undefined) {
			if (min !== undefined && max !== undefined) {
				return new FunctionConstraint(
					(value:any) : EvalResult => {
						return { valid: !Array.isArray(value) || value.length === 0 || (value.length >= min && value.length <= max), message: `contains outside the range from ${min} to ${max} items` }
					}
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(
					(value:any) : EvalResult => {
						return { valid: !Array.isArray(value) || value.length === 0 || value.length >= min, message: `contains should be less or equal than ${min}` }
					}
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(
					(value:any) : EvalResult => {
						return { valid: !Array.isArray(value) || value.length === 0 || value.length <= max, message: `contains should be greater or equal than ${max}` }
					}
				)
			}
		} else if (rule.contains !== undefined && typeof rule.contains === 'boolean') {
			if (min !== undefined && max !== undefined) {
				return new FunctionConstraint(
					(value:any) : EvalResult => {
						return { valid: !Array.isArray(value) || (value.length >= min && value.length <= max), message: `contains outside the range from ${min} to ${max} items` }
					}
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(
					(value:any) : EvalResult => {
						return { valid: !Array.isArray(value) || value.length >= min, message: `contains should be less or equal than ${min}` }
					}
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(
					(value:any) : EvalResult => {
						return { valid: !Array.isArray(value) || value.length <= max, message: `contains should be greater or equal than ${max}` }
					}
				)
			} else {
				return new FunctionConstraint(
					(value:any) : EvalResult => {
						return { valid: !Array.isArray(value) || value.length > 0, message: 'must contain at least one item' }
					}
				)
			}
		} else if (rule.contains !== undefined) {
			const contains = rule.contains as Rule
			if (contains) {
				const constraint = this.factory.build(contains)
				if (constraint === undefined) {
					throw new Error(`Contains constraint ${JSON.stringify(rule)} undefined`)
				}
				const getCount = (value:any[]): number => {
					let count = 0
					for (let i = 0; i < value.length; i++) {
						if (constraint.eval(value[i]).valid) {
							count++
						}
					}
					return count
				}
				if (min !== undefined && max !== undefined) {
					return new FunctionConstraint(
						(value:any) : EvalResult => {
							if (!Array.isArray(value)) {
								return { valid: true }
							}
							const count = getCount(value)
							return { valid: count >= min && count <= max, message: `contains outside the range from ${min} to ${max} items` }
						}
					)
				} else if (min !== undefined) {
					return new FunctionConstraint(
						(value:any) : EvalResult => {
							if (!Array.isArray(value)) {
								return { valid: true }
							}
							const count = getCount(value)
							return { valid: count >= min, message: `contains sconstrainthould be less or equal than ${min}` }
						}
					)
				} else if (max !== undefined) {
					return new FunctionConstraint(
						(value:any) : EvalResult => {
							if (!Array.isArray(value)) {
								return { valid: true }
							}
							const count = getCount(value)
							return { valid: count <= max, message: `contains should be greater or equal than ${max}` }
						}
					)
				} else {
					return new FunctionConstraint(
						(value:any) : EvalResult => {
							if (!Array.isArray(value)) {
								return { valid: true }
							}
							// at least one item must meet the constraint
							for (let i = 0; i < value.length; i++) {
								if (constraint.eval(value[i]).valid) {
									return { valid: true }
								}
							}
							return { valid: false, message: 'does not meet at least one of the contain rules' }
						}
					)
				}
			}
		}
		throw new Error('constraint contains undefined')
	}
}
export class ConstConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return rule.const !== undefined
	}

	public build (rule: Rule): IConstraint {
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
			(value:any) : EvalResult => {
				if (type === 'object' && isArray) {
					const array = JSON.stringify(value)
					return { valid: array === _const, message: `Is not ${JSON.stringify(rule.const)}` }
				} else if (type === 'object' && value !== null) {
					const array = JSON.stringify(Helper.sortObject(value))
					return { valid: array === _const, message: `Is not ${JSON.stringify(rule.const)}` }
				} else {
					return { valid: _const === value, message: `Is not ${JSON.stringify(rule.const)}` }
				}
			}
		)
	}
}
export class BooleanSchemaConstraintBuilder implements IConstraintBuilder {
	public apply (rule: Rule):boolean {
		return typeof rule === 'boolean'
	}

	public build (rule: Rule): IConstraint {
		if (typeof rule !== 'boolean') {
			throw new Error('boolean schema not define')
		}
		return new FunctionConstraint(
			() : EvalResult => {
				return { valid: rule, message: 'Boolean schema invalid' }
			}
		)
	}
}

export class IfConstraintBuilder implements IConstraintBuilder {
	private factory: IConstraintFactory
	constructor (factory: IConstraintFactory) {
		this.factory = factory
	}

	public apply (rule: Rule):boolean {
		return rule.if !== undefined && (rule.then !== undefined || rule.else !== undefined)
	}

	public build (rule: Rule): IConstraint {
		if (rule.if === undefined) {
			throw new Error('if not define')
		}
		if (rule.then === undefined && rule.else === undefined) {
			throw new Error('then or else not define')
		}
		const _if = this.factory.build(rule.if)
		if (_if === undefined) {
			throw new Error(`constraint ${JSON.stringify(rule)} undefined`)
		}
		const _then = rule.then !== undefined ? this.factory.build(rule.then) : undefined
		const _else = rule.else !== undefined ? this.factory.build(rule.else) : undefined
		return new FunctionConstraint(
			(value:any) : EvalResult => {
				const result = _if.eval(value)
				if (result.valid && _then !== undefined) {
					return _then !== undefined ? _then.eval(value) : { valid: true }
				} else if (!result.valid && _else !== undefined) {
					return _else.eval(value)
				} else {
					return { valid: true }
				}
			}
		)
	}
}

// allOf?:Rule[]
// anyOf?:Rule[]
// oneOf?:Rule[]
// not?:Rule
// export class AllOfConstraintBuilder implements IConstraintBuilder {
// private factory: IConstraintFactory
// constructor (factory: IConstraintFactory) {
// this.factory = factory
// }

// public apply (rule: Rule):boolean {
// return rule.allOf !== undefined && typeof rule.allOf === 'object'
// }

// public build (rule: Rule): IConstraint {
// if (rule.allOf === undefined) {
// throw new Error('allOf not define')
// }
// const groupConstraints:{ constraints:IConstraint[] }[] = []
// for (const child of rule.allOf) {
// const constraints = this.factory.buildConstraints(child)
// if (constraints.length > 0) {
// groupConstraints.push({ constraints: constraints })
// }
// }
// return new FunctionConstraint('allOf invalid',
// (value:any) => {
// for (const groupConstraint of groupConstraints) {
// if (propertyConstraints) {
// for (const constrain of propertyConstraints.constraints) {
// if (!constrain.eval(entry[1])) {
// return false
// }
// }
// }
// }
// return true
// }
// )
// }
// }
