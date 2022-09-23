import { Schema, ISchemaTransform, ISchemaManager } from '../model/schema'
import { Helper } from '.'

export class SchemaManager implements ISchemaManager {
	private schemas:any = {}
	private transformers: ISchemaTransform[] = []
	constructor (transformers: ISchemaTransform[]) {
		this.transformers = transformers
	}

	public async load (value: string|Schema): Promise<Schema> {
		if (value === null || value === undefined || typeof value === 'boolean') {
			return value
		}
		let schema:Schema | undefined
		let key:string
		if (typeof value === 'string') {
			schema = this.schemas[value] as Schema | undefined
			if (schema) {
				return schema
			}
			const content = await Helper.get(value)
			const downloaded = Helper.tryParse(content) as Schema
			if (!downloaded) {
				throw Error(`The schema in ${value} not found`)
			}
			schema = this.normalize(downloaded)
			key = schema.$id || value
		} else {
			if (value as Schema === undefined) {
				throw new Error('Parameter value is invalid')
			}
			schema = this.normalize(value)
			key = schema.$id || Helper.createKey(schema)
		}
		this.schemas[key] = schema
		const externalsRefs = this.externalRefs(schema)
		for (const externalsRef of externalsRefs) {
			this.load(externalsRef)
		}
		return schema
	}

	public add (value: Schema): Schema {
		if (value === null || value === undefined || typeof value === 'boolean') {
			return value
		}
		if (value as Schema === undefined) {
			throw new Error('Parameter value is invalid')
		}
		const schema = this.normalize(value)
		if (this.externalRefs(schema).length > 0) {
			throw new Error('You must use the load method, since it is required to load external schemas')
		}
		const key = schema.$id || Helper.createKey(schema)
		this.schemas[key] = schema
		return schema
	}

	public get (key: string) : Schema {
		const schema = this.schemas[key] as Schema | undefined
		if (!schema) {
			throw Error(`The schema ${key} not found`)
		}
		return schema
	}

	public solve (value: string|Schema) : Schema {
		if (value === null || value === undefined || typeof value === 'boolean') {
			return value
		}
		if (typeof value === 'string') {
			return this.get(value)
		}
		if (value as Schema === undefined) {
			throw new Error('Parameter value is invalid')
		}
		return this.add(value)
	}

	public externalRefs (schema: Schema):string[] {
		const ids = Helper.findAllInObject(schema, (value:any):boolean => {
			return value.$id !== undefined && value.$id.startsWith('http')
		}).map(p => p.$id)
		const refs = Helper.findAllInObject(schema, (value:any):boolean => {
			return value.$ref !== undefined && value.$ref.startsWith('http')
		}).map(p => p.$ref)
		return refs.filter(p => !ids.includes(p))
	}

	public normalize (source: Schema): Schema {
		if (source === undefined || source === null) {
			throw new Error('source is empty')
		}
		if (typeof source !== 'object') {
			return source
		}
		let schema = Helper.clone(source)
		for (const transformer of this.transformers) {
			schema = transformer.execute(schema)
		}
		return schema
	}
}
