/* eslint-disable @typescript-eslint/ban-types */
import { Rule, IConstraint, IConstraintBuilder, IConstraintFactory, PropertyType } from './../model/schema'
import { FormatCollection } from './formatCollection'
import { FunctionConstraint } from './functionConstraint'
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
		return new FunctionConstraint(`invalid type ${rule.type}`, func)
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
		return new FunctionConstraint(`is not multiple of ${rule.multipleOf}`, func)
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
			return new FunctionConstraint(`outside the range from ${min} inclusive to ${max} inclusive properties`,
				(p:any) => {
					if (typeof p !== 'object' || Array.isArray(p)) {
						return true
					}
					const properties = Object.keys(p).length
					return properties >= min && properties <= max
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(`should be less or equal than ${min}`,
				(p:any) => {
					if (typeof p !== 'object' || Array.isArray(p)) {
						return true
					}
					return Object.keys(p).length >= min
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(`should be greater or equal than ${max}`,
				(p:any) => {
					if (typeof p !== 'object' || Array.isArray(p)) {
						return true
					}
					return Object.keys(p).length <= max
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
			return new FunctionConstraint(`outside the range from ${min} to ${max} items`,
				(p:any[]) => !Array.isArray(p) || (p.length >= min && p.length <= max)
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(`should be less or equal than ${min}`,
				(p:any[]) => !Array.isArray(p) || p.length >= min
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(`should be greater or equal than ${max}`,
				(p:any[]) => !Array.isArray(p) || p.length <= max
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
		return new FunctionConstraint('Invalid unique items', func)
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
			return new FunctionConstraint(`outside the range of ${min} to ${max}`,
				(p:string) => {
					if (typeof p !== 'string') {
						return true
					}
					if (p === undefined || p === null) {
						return false
					}
					const length = Array.from(p).length
					return length >= min && length <= max
				}
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(`should be less than ${min}`,
				(p:string) => {
					if (typeof p !== 'string') {
						return true
					}
					if (p === undefined || p === null) {
						return false
					}
					const length = Array.from(p).length
					return length >= min
				}
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(`should be greater than ${max}`,
				(p:string) => {
					if (typeof p !== 'string') {
						return true
					}
					if (p === undefined || p === null) {
						return false
					}
					const length = Array.from(p).length
					return length <= max
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
			return new FunctionConstraint(`outside the range form ${min} to ${max}`,
				(p:any) => isNaN(p) || (p >= min && p <= max)
			)
		} else if (exclusiveMinimum !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(`outside the range form ${exclusiveMinimum} exclusive to ${exclusiveMaximum} exclusive`,
				(p:any) => isNaN(p) || (p > exclusiveMinimum && p < exclusiveMaximum)
			)
		} else if (min !== undefined && exclusiveMaximum !== undefined) {
			return new FunctionConstraint(`outside the range form ${min} to ${exclusiveMaximum} exclusive`,
				(p:any) => isNaN(p) || (p >= min && p < exclusiveMaximum)
			)
		} else if (exclusiveMinimum !== undefined && max !== undefined) {
			return new FunctionConstraint(`outside the range form ${exclusiveMinimum} exclusive to ${max}`,
				(p:any) => isNaN(p) || (p > exclusiveMinimum && p <= max)
			)
		} else if (min !== undefined) {
			return new FunctionConstraint(`should be less or equal than ${min}`,
				(p:any) => isNaN(p) || p >= min
			)
		} else if (exclusiveMinimum !== undefined) {
			return new FunctionConstraint(`should be less than ${exclusiveMinimum}`,
				(p:any) => isNaN(p) || p > exclusiveMinimum
			)
		} else if (max !== undefined) {
			return new FunctionConstraint(`should be greater or equal than ${max}`,
				(p:any) => isNaN(p) || p <= max
			)
		} else if (exclusiveMaximum !== undefined) {
			return new FunctionConstraint(`should be greater than ${exclusiveMaximum}`,
				(p:any) => isNaN(p) || p < exclusiveMaximum
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
		const itemsConstraints:IConstraint[][] = []
		for (const item of rule.prefixItems) {
			const constraints = this.factory.buildConstraints(item)
			itemsConstraints.push(constraints)
		}
		return new FunctionConstraint('Prefix items invalid',
			(array:any[]) => {
				if (!Array.isArray(array)) {
					return true
				}
				for (let i = 0; i < array.length; i++) {
					if (i >= itemsConstraints.length) {
						break
					}
					for (const constraint of itemsConstraints[i]) {
						if (!constraint.eval(array[i])) {
							return false
						}
					}
				}
				return true
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
		return new FunctionConstraint(`the following fields are required [${required.join(', ')}]`,
			(p:any) => {
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
		return new FunctionConstraint(`not in [${showValues}]`,
			(p:string) => values.includes(p)
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
		return new FunctionConstraint(`does not comply with the format ${rule.format}`,
			(p:string) => format.test(p)
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
		return new FunctionConstraint(`does not comply with the format ${rule.pattern}`,
			(p:string) => typeof p === 'string' ? regExp.test(p) : true
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
		const patternProperties:any[] = []
		for (const entry of Object.entries(rule.patternProperties)) {
			let constraints:IConstraint[] = []
			if (typeof entry[1] === 'object') {
				constraints = this.factory.buildConstraints(entry[1] as Rule)
			} else if (typeof entry[1] === 'boolean') {
				constraints = [new FunctionConstraint('Pattern properties exists', (p:any) => entry[1])]
			}
			patternProperties.push({ regExp: new RegExp(entry[0]), constraints: constraints })
		}
		return new FunctionConstraint('Pattern properties invalid',
			(p:string) => {
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
				return new FunctionConstraint(`contains outside the range from ${min} to ${max} items`,
					(p:any[]) => !Array.isArray(p) || p.length === 0 || (p.length >= min && p.length <= max)
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(`contains should be less or equal than ${min}`,
					(p:any[]) => !Array.isArray(p) || p.length === 0 || p.length >= min
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(`contains should be greater or equal than ${max}`,
					(p:any[]) => !Array.isArray(p) || p.length === 0 || p.length <= max
				)
			}
		} else if (rule.contains !== undefined && typeof rule.contains === 'boolean') {
			if (min !== undefined && max !== undefined) {
				return new FunctionConstraint(`contains outside the range from ${min} to ${max} items`,
					(p:any[]) => !Array.isArray(p) || (p.length >= min && p.length <= max)
				)
			} else if (min !== undefined) {
				return new FunctionConstraint(`contains should be less or equal than ${min}`,
					(p:any[]) => !Array.isArray(p) || p.length >= min
				)
			} else if (max !== undefined) {
				return new FunctionConstraint(`contains should be greater or equal than ${max}`,
					(p:any[]) => !Array.isArray(p) || p.length <= max
				)
			} else {
				return new FunctionConstraint('must contain at least one item',
					(p:any[]) => !Array.isArray(p) || p.length > 0
				)
			}
		} else if (rule.contains !== undefined) {
			const contains = rule.contains as Rule
			if (contains) {
				const constraints = this.factory.buildConstraints(contains)
				const isValid = (p:any) => {
					for (const constraint of constraints) {
						if (!constraint.eval(p)) {
							return false
						}
					}
					return true
				}
				if (min !== undefined && max !== undefined) {
					return new FunctionConstraint(`contains outside the range from ${min} to ${max} items`,
						(array:any[]) => {
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
					)
				} else if (min !== undefined) {
					return new FunctionConstraint(`contains should be less or equal than ${min}`,
						(array:any[]) => {
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
					)
				} else if (max !== undefined) {
					return new FunctionConstraint(`contains should be greater or equal than ${max}`,
						(array:any[]) => {
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
					)
				} else {
					return new FunctionConstraint('does not meet at least one of the contain rules',
						(array:any[]) => {
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
		return new FunctionConstraint(`Is not ${JSON.stringify(rule.const)}`,
			(p:any) => {
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
		)
	}
}
