import { Schema, ValidationResult, ISchemaManager, ISchemaBuilder, ISchemaProvider } from '../model/schema'

export class SchemaManager implements ISchemaManager {
	private provider: ISchemaProvider
	private builder: ISchemaBuilder
	constructor (provider: ISchemaProvider, builder: ISchemaBuilder) {
		this.provider = provider
		this.builder = builder
	}

	public async validate (value: string|Schema, data:any) : Promise<ValidationResult> {
		if (data === undefined) {
			return { valid: false, errors: [{ path: '.', message: 'data is empty' }] }
		}
		const schema = await this.provider.solve(value)
		const builded = await this.builder.build(schema)
		const errors = builded.constraint ? builded.constraint.eval(data, '.') : []
		return { valid: errors.length === 0, errors: errors }
	}
}

// export class SchemaCollection {
// private buildedList:any = {}
// private completer: ISchemaCompleter
// private builder: ISchemaBuilder
// constructor (completer: ISchemaCompleter, builder: ISchemaBuilder) {
// this.completer = completer
// this.builder = builder
// }
// public async get (value: string|Schema) : Promise<Schema> {
// let builded:BuildedSchema|undefined
// if (typeof value === 'string') {
// builded = await this.find(value)
// if (builded === undefined) {
// throw new Error(`Uri ${value} not found`)
// }
// } else {
// if ((value as Schema) === undefined) {
// throw new Error('Parameter value is invalid')
// }
// // get a key that uniquely identifies a schema
// const key = value.$id ? value.$id : JSON.stringify(value)
// // look for the schema in the cache list
// builded = this.buildedList[key] as BuildedSchema | undefined
// if (builded === undefined) {
// // if it doesn't exist in cache, add it
// builded = await this.build(value)
// this.buildedList[key] = builded
// }
// }
// return builded
// }
// public async getByRef (root:Schema, parent: Schema, ref:string): Promise<BuildedSchema> {
// const rootBuilded = await this.get(root)
// const parentBuilded = await this.get(parent)
// return this._getByRef(rootBuilded, parentBuilded, ref)
// }
// public async _getByRef (root:BuildedSchema, parent: BuildedSchema, ref:string): Promise<BuildedSchema> {
// if (ref.startsWith('#/$defs')) {
// return this.findInternal(root, ref)
// } else if (ref.startsWith('#')) {
// return this.findInternal(parent, ref)
// } else if (ref.startsWith('http')) {
// return await this.find(ref)
// } else if (ref.startsWith('/')) {
// if (!root.$id) {
// throw Error('$id not defined in schema')
// }
// const uri = new URL(root.$id, ref).href
// return await this.find(uri)
// } else {
// throw Error(`Ref: ${ref} is invalid`)
// }
// }
// public async find (uri: string) : Promise<BuildedSchema> {
// if (Helper.isEmpty(uri)) {
// throw Error('uri is empty')
// }
// const parts = uri.split('#')
// const key = parts[0]
// // look for the schema in the list that makes cache
// let builded = this.buildedList[key] as BuildedSchema | undefined
// if (!builded) {
// // if it is not in cache it looks for it externally
// const schema = await this.findExternal(key)
// builded = await this.build(schema)
// this.buildedList[key] = builded
// }
// if (parts.length === 1) {
// return builded
// } else if (parts.length === 2) {
// return this.findInternal(builded, parts[1])
// } else {
// throw new Error(`${uri} invalid uri`)
// }
// }
// }
