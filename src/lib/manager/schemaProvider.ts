import { Schema, ISchemaNormalizer, ISchemaProvider } from './../model/schema'
import { Helper } from './helper'

export class SchemaProvider implements ISchemaProvider {
	private schemas:any = {}
	private normalizer: ISchemaNormalizer
	constructor (normalizer: ISchemaNormalizer) {
		this.normalizer = normalizer
	}

	public async solve (value: string|Schema): Promise<Schema> {
		if (value === null || value === undefined || typeof value === 'boolean') {
			return value
		} else if (typeof value === 'string') {
			let schema = this.schemas[value] as Schema | undefined
			if (!schema) {
				schema = await this.find(value)
				if (schema === undefined) {
					throw new Error(`Uri ${value} not found`)
				}
				schema = this.normalizer.normalize(schema)
				this.schemas[value] = schema
			}
			return schema
		} else {
			if (value as Schema === undefined) {
				throw new Error('Parameter value is invalid')
			}
			const normalized = this.normalizer.normalize(value)
			const key = this.getKey(normalized)
			const schema = this.schemas[key] as Schema | undefined
			if (schema) {
				return schema
			}
			this.schemas[key] = normalized
			return normalized
		}
	}

	public getKey (schema:Schema) : string {
		return schema.$id || this.createKey(schema)
	}

	private async find (uri: string) : Promise<Schema> {
		// look for the schema in the list that makes cache
		let schema = this.schemas[uri] as Schema | undefined
		if (!schema) {
			// if it is not in cache it looks for it externally
			const content = await Helper.get(uri)
			schema = Helper.tryParse(content) as Schema
			if (!schema) {
				throw Error(`The schema with the uri ${uri} was not found`)
			}
		}
		return schema
	}

	private createKey (data:any) {
		if (data === null) {
			return 'null'
		} else if (Array.isArray(data)) {
			const items:any[] = []
			for (const item of data) {
				items.push(this.createKey(item))
			}
			return `[${items.join(',')}]`
		} else if (typeof data === 'object') {
			const values:any[] = []
			for (const entry of Object.entries(data)) {
				values.push(`${entry[0]}:${this.createKey(entry[1])}`)
			}
			return `{${values.join(',')}}`
		} else {
			return data
		}
	}
}
