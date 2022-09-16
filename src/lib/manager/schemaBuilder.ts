import { ISchemaBuilder, Schema, BuildedSchema, IConstraintFactory } from './../model/schema'

export class SchemaBuilder implements ISchemaBuilder {
	private constraintFactory: IConstraintFactory
	constructor (constraintFactory: IConstraintFactory) {
		this.constraintFactory = constraintFactory
	}

	public async build (schema: Schema): Promise<BuildedSchema> {
		if (schema === undefined || schema === null) {
			throw new Error('schema is empty')
		}
		let builded:BuildedSchema
		if (typeof schema === 'object') {
			builded = this.createSchema(schema)
			this.addDef(builded, schema)
		} else if (typeof schema === 'boolean') {
			builded = this.createBooleanSchema()
		} else {
			throw new Error(`Schema ${schema}  is invalid`)
		}
		builded.constraint = await this.constraintFactory.build(schema, schema, schema)
		return builded
	}

	private async addDef (builded:BuildedSchema, schema: Schema): Promise<void> {
		builded.$defs = {}
		if (schema.$defs) {
			for (const entry of Object.entries(schema.$defs)) {
				const name = entry[0]
				const child = entry[1] as Schema
				const buildedChild = this.createSchema(child)
				buildedChild.constraint = await this.constraintFactory.build(schema, schema, child)
				builded.$defs[name] = buildedChild
			}
		}
	}

	private createBooleanSchema ():BuildedSchema {
		return { }
	}

	private createSchema (schema: Schema):BuildedSchema {
		return { $id: schema.$id, $defs: schema.$defs }
	}

// private createConstraints (builded:BuildedSchema, schema: Schema, property: Schema):void {
// builded.constraint = this.constraintFactory.build(property)
// // iterate through the child properties
// if (property.properties && typeof property.properties === 'object') {
// builded.properties = {}
// for (const name in property.properties) {
// const child = property.properties[name] as Schema
// const buildedChild = this.createSchema(child)
// this.createConstraints(buildedChild, schema, child)
// builded.properties[name] = buildedChild
// }
// }
// // iterate through the items properties
// if (property.items && typeof property.items === 'object') {
// const buildedItems = this.createSchema(property.items)
// this.createConstraints(buildedItems, schema, property.items)
// builded.items = buildedItems
// }
// }
}
