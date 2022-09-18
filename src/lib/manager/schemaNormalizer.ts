import { ISchemaNormalizer, Schema } from '../model/schema'
import { Helper } from './helper'

export class SchemaNormalizer implements ISchemaNormalizer {
	public normalize (source: Schema): Schema {
		if (source === undefined || source === null) {
			throw new Error('source is empty')
		}
		if (typeof source !== 'object') {
			return source
		}
		const schema = Helper.clone(source)
		this.extend(schema)
		this.removeProperties(schema)
		return schema
	}

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

	private removeProperties (data:any) {
		if (Array.isArray(data)) {
			for (const item of data) {
				this.removeProperties(item)
			}
		} else if (data && typeof data === 'object') {
			delete data.description
			delete data.$schema
			delete data.$extends
			for (const value of Object.values(data)) {
				this.removeProperties(value)
			}
		}
	}
}
