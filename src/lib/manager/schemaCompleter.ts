import { ISchemaCompleter, Schema } from './../model/schema'
import { Helper } from './helper'

export class SchemaCompleter implements ISchemaCompleter {
	public complete (source: Schema): Schema {
		if (source === undefined || source === null) {
			throw new Error('source is empty')
		}
		if (typeof source !== 'object') {
			return source
		}
		const schema = Helper.clone(source)
		// this.solveUndefined(schema)
		this.extend(schema)
		// this._complete(schema)
		return schema
	}

	// private solveUndefined (schema: Schema) {
	// if (!schema.$defs) {
	// schema.$defs = {}
	// }
	// // this.solvePropertyUndefined(schema)
	// }

	// private solvePropertyUndefined (property:Schema) {
	// if (!property.properties) {
	// property.properties = {}
	// } else {
	// for (const p in property.properties) {
	// const child = property.properties[p] as Schema
	// this.solvePropertyUndefined(child)
	// }
	// }
	// }

	private extend (schema: Schema):void {
		if (schema.$defs === undefined || schema.$defs === null) {
			return
		}
		for (const def of Object.values(schema.$defs)) {
			this.extendDef(def as Schema, schema.$defs)
		}
	}

	private extendDef (def: Schema, defs:any): void {
		if (def.$extends) {
			const base = defs[def.$extends] as Schema
			if (base === undefined) {
				throw new Error(`${def.$extends} not found`)
			}
			if (base.$extends) {
				this.extendDef(base, defs)
			}
			// extend
			Helper.extendObject(def, base)
		}
		// remove since it was already extended
		if (def.$extends) {
			delete def.$extends
		}
	}
}
