// /* eslint-disable @typescript-eslint/ban-types */
// import { ISchemaValidator, BuildedSchema, EvalError, ValidationResult, ISchemaCollection } from './../model/schema'

// export class SchemaValidator implements ISchemaValidator {
// // private schemas: ISchemaCollection
// // constructor (schemas: ISchemaCollection) {
// // this.schemas = schemas
// // }

// public async validate (schema:BuildedSchema, data: any): Promise<ValidationResult> {
// const errors:EvalError[] = []
// if (data === undefined) {
// errors.push({ path: '.', message: 'data is empty' })
// } else if (schema.constraint) {
// const childErrors = schema.constraint.eval(data, '.')
// if (childErrors.length > 0) {
// errors.push(...childErrors)
// }
// }
// return { valid: errors.length === 0, errors: errors }
// }

// private async validateProperty (root: BuildedSchema, property: BuildedSchema, data: any, path = ''): Promise<ValidationError[]> {
// const errors:ValidationError[] = []
// if (property.constraint) {
// const result = property.constraint.eval(data)
// if (!result.valid) {
// errors.push({ path: path, message: result.message as string })
// }
// }

// if (property.properties) {
// for (const entry of Object.entries(property.properties)) {
// const name = entry[0]
// const childProperty = entry[1] as BuildedSchema
// const childPath = `${path}.${name}`
// const value = data[name]
// if (value !== undefined) {
// const child = await this.getFromProperty(root, property, childProperty)
// if (!child) {
// throw new Error(`Schema not found in ${childPath}`)
// }
// const childErrors = await this.validateProperty(property, child, value, childPath)
// if (childErrors.length > 0) {
// errors.push(...childErrors)
// }
// }
// }
// } else if (property.items) {
// const itemsSchema = await this.getFromProperty(root, property, property.items)
// if (!itemsSchema) {
// throw new Error(`Schema not found in ${path}.items`)
// }
// for (let i = 0; i < data.length; i++) {
// const childPath = `${path}.${i}`
// const item = data[i]
// if (item === null) {
// errors.push({ path: childPath, message: 'value is null' })
// } else {
// const childErrors = await this.validateProperty(root, itemsSchema, item, childPath)
// if (childErrors.length) {
// errors.push(...childErrors)
// }
// }
// }
// }
// return errors
// }

// private async getFromProperty (root: BuildedSchema, parent: BuildedSchema, property:BuildedSchema) : Promise<BuildedSchema|undefined> {
// if (property.$ref) {
// return await this.schemas.getByRef(root, parent, property.$ref)
// } else if (property) {
// return property
// } else {
// return undefined
// }
// }
// }
