/* eslint-disable @typescript-eslint/ban-types */
import { ISchemaValidator, BuildedSchema, PropertyType, ValidateResult, ValidateError, ISchemaCollection } from './../model/schema'

export class SchemaValidator implements ISchemaValidator {
	private schemas: ISchemaCollection
	constructor (schemas: ISchemaCollection) {
		this.schemas = schemas
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
				if (!constraint.eval(data)) {
					errors.push({ path: path, message: constraint.message })
				}
			}
		}
		return errors
	}
}
