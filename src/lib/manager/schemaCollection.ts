/* eslint-disable @typescript-eslint/ban-types */
import { Schema, BuildedSchema, ISchemaCompleter, ISchemaBuilder } from './../model/schema'
import { Helper } from './helper'

export class SchemaCollection {
	private list:any
	private completer: ISchemaCompleter
	private builder: ISchemaBuilder
	constructor (completer: ISchemaCompleter, builder: ISchemaBuilder) {
		this.list = {}
		this.completer = completer
		this.builder = builder
	}

	public async get (value: string|Schema) : Promise<BuildedSchema> {
		let builded:BuildedSchema|undefined
		if (typeof value === 'string') {
			builded = await this.find(value)
			if (builded === undefined) {
				throw new Error(`Uri ${value} not found`)
			}
		} else {
			if ((value as Schema) === undefined) {
				throw new Error('Parameter value is invalid')
			}
			// get a key that uniquely identifies a schema
			const key = value.$id ? value.$id : JSON.stringify(value)
			// look for the schema in the cache list
			builded = this.list[key] as BuildedSchema | undefined
			if (builded === undefined) {
				// if it doesn't exist in cache, add it
				builded = this.build(value)
				this.list[key] = builded
			}
		}
		return builded
	}

	public async getByRef (root:BuildedSchema, parent: BuildedSchema, ref:string): Promise<BuildedSchema> {
		if (ref.startsWith('#/$defs')) {
			return this.findInternal(root, ref)
		} else if (ref.startsWith('#')) {
			return this.findInternal(parent, ref)
		} else if (ref.startsWith('http')) {
			return await this.find(ref)
		} else if (ref.startsWith('/')) {
			if (!root.$id) {
				throw Error('$id not defined in schema')
			}
			const uri = new URL(root.$id, ref).href
			return await this.find(uri)
		} else {
			throw Error(`Ref: ${ref} is invalid`)
		}
	}

	public async find (uri: string) : Promise<BuildedSchema> {
		if (Helper.isEmpty(uri)) {
			throw Error('uri is empty')
		}
		const parts = uri.split('#')
		const key = parts[0]
		// look for the schema in the list that makes cache
		let builded = this.list[key] as BuildedSchema | undefined
		if (!builded) {
			// if it is not in cache it looks for it externally
			const schema = await this.findExternal(key)
			builded = this.build(schema)
			this.list[key] = builded
		}
		if (parts.length === 1) {
			return builded
		} else if (parts.length === 2) {
			return this.findInternal(builded, parts[1])
		} else {
			throw new Error(`${uri} invalid uri`)
		}
	}

	private async findExternal (uri: string) : Promise<Schema> {
		const content = await Helper.get(uri)
		const schema = Helper.tryParse(content) as Schema
		if (!schema) {
			throw Error(`The schema with the uri ${uri} was not found`)
		}
		return schema
	}

	private findInternal (property: BuildedSchema, ref:string):BuildedSchema {
		if (!ref.startsWith('#')) {
			throw Error(`${ref} invalid internal ref`)
		}
		if (ref === '#') {
			return property
		} else if (ref.startsWith('#/')) {
			const parts = ref.replace('#/', '').split('/')
			let _current = property as any
			for (let i = 0; i < parts.length; i++) {
				const part = parts[i]
				const child = _current[part]
				if (child === undefined) {
					throw Error(`path ${parts.splice(0, i).join('.')} not fount in ${ref} ref`)
				}
				_current = child
			}
			return _current as BuildedSchema
		} else {
			throw Error(`Invalid ${ref} ref`)
		}
	}

	private build (schema: Schema): BuildedSchema {
		const completed = this.completer.complete(schema)
		return this.builder.build(completed)
	}
}
