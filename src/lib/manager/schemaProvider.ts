import { Schema, ISchemaCompleter, ISchemaProvider } from './../model/schema'
import { Helper } from './helper'

export class SchemaProvider implements ISchemaProvider {
	private schemas:any = {}

	private completer: ISchemaCompleter
	constructor (completer: ISchemaCompleter) {
		this.completer = completer
	}

	public add (key:string, schema:Schema): Schema {
		const completed = this.completer.complete(schema)
		this.schemas[key] = completed
		return completed
	}

	public async solve (value: string|Schema): Promise<Schema> {
		if (typeof value === 'string') {
			const schema = await this.find(value)
			if (schema === undefined) {
				throw new Error(`Uri ${value} not found`)
			}
			return schema
		} else {
			if (value as Schema === undefined) {
				throw new Error('Parameter value is invalid')
			}
			// get a key that uniquely identifies a schema
			const key = value.$id ? value.$id : JSON.stringify(value)
			return this.add(key, value)
		}
	}

	// public async find (uri: string) : Promise<Rule> {
	// if (Helper.isEmpty(uri)) {
	// throw Error('uri is empty')
	// }
	// const parts = uri.split('#')
	// const key = parts[0]
	// const schema = await this.findSchema(key)
	// if (parts.length === 1) {
	// return schema
	// } else if (parts.length === 2) {
	// return this.findRule(schema, parts[1])
	// } else {
	// throw new Error(`${uri} invalid uri`)
	// }
	// }

	public async find (uri: string) : Promise<Schema> {
		// look for the schema in the list that makes cache
		let schema = this.schemas[uri] as Schema | undefined
		if (!schema) {
			// if it is not in cache it looks for it externally
			const content = await Helper.get(uri)
			schema = Helper.tryParse(content) as Schema
			if (!schema) {
				throw Error(`The schema with the uri ${uri} was not found`)
			}
			schema = this.add(uri, schema)
		}
		return schema
	}
}
