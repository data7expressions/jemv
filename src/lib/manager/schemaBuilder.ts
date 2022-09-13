import { ISchemaBuilder, Schema, Rule, BuildedSchema, IConstraint, IConstraintBuilder, IConstraintFactory, PropertyType } from './../model/schema'

export class SchemaBuilder implements IConstraintFactory, ISchemaBuilder {
	private constraintBuilders:IConstraintBuilder[] = []

	public addConstraintBuilder (constraintBuilder:IConstraintBuilder) {
		this.constraintBuilders.push(constraintBuilder)
	}

	public buildConstraints (rule: Rule):IConstraint[] {
		const constraints:IConstraint[] = []
		for (const constraintBuilder of this.constraintBuilders) {
			if (constraintBuilder.apply(rule)) {
				constraints.push(constraintBuilder.build(rule))
			}
		}
		return constraints
	}

	public build (schema: Schema): BuildedSchema {
		if (!schema) {
			throw new Error('schema is empty')
		}
		const builded = this.createSchema(schema)
		this.createConstraints(builded, schema, schema)
		this.addDef(builded, schema)
		return builded
	}

	private addDef (builded:BuildedSchema, schema: Schema):void {
		if (schema.$defs) {
			builded.$defs = {}
			for (const entry of Object.entries(schema.$defs)) {
				const name = entry[0]
				const child = entry[1] as Schema
				const buildedChild = this.createSchema(child)
				this.createConstraints(buildedChild, schema, child)
				builded.$defs[name] = buildedChild
			}
		}
	}

	private createSchema (schema: Schema):BuildedSchema {
		return { $id: schema.$id, type: schema.type, $ref: schema.$ref, $defs: schema.$defs, properties: {}, constraints: [] }
	}

	private createRule (rule: Rule):BuildedSchema {
		return { type: rule.type, $ref: rule.$ref, properties: {}, constraints: [] }
	}

	private createConstraints (builded:BuildedSchema, schema: Schema, rule: Rule):void {
		const constraints = this.buildConstraints(rule)
		if (constraints.length > 0) {
			builded.constraints.push(...constraints)
		}

		if (rule.type === PropertyType.object) {
			// iterate through the child properties
			if (rule.properties) {
				for (const name in rule.properties) {
					const child = rule.properties[name] as Rule
					const buildedChild = this.createRule(child)
					this.createConstraints(buildedChild, schema, child)
					builded.properties[name] = buildedChild
				}
			}
		} else if (rule.type === PropertyType.array) {
			// iterate through the items properties
			if (rule.items) {
				const buildedItems = this.createRule(rule.items)
				this.createConstraints(buildedItems, schema, rule.items)
				builded.items = buildedItems
			}
		}
	}
}
