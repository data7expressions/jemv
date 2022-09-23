import { ISchemaBuilder, Schema, BuildedSchema, IConstraintManager } from './../model/schema'

export class SchemaBuilder implements ISchemaBuilder {
	private built:any = {}
	private constraints: IConstraintManager
	constructor (constraints: IConstraintManager) {
		this.constraints = constraints
	}

	public async build (schema: Schema): Promise<BuildedSchema> {
		if (schema === undefined || schema === null) {
			throw new Error('schema is empty')
		}
		// get a key that uniquely identifies a schema
		const key = schema.$id ? schema.$id : JSON.stringify(schema)
		// look for the schema in the cache list
		let builded = this.built[key] as BuildedSchema | undefined
		if (builded === undefined) {
			// if it doesn't exist in cache, add it
			if (typeof schema === 'object') {
				builded = this.createSchema(schema)
				// this.addDef(builded, schema)
			} else if (typeof schema === 'boolean') {
				builded = this.createBooleanSchema()
			} else {
				throw new Error(`Schema ${schema}  is invalid`)
			}
			builded.constraint = await this.constraints.build(schema, schema)
			this.built[key] = builded
		}
		return builded
	}

	private createBooleanSchema ():BuildedSchema {
		return { }
	}

	private createSchema (schema: Schema):BuildedSchema {
		return { $id: schema.$id }
	}
}
