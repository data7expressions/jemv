import { ValidationResult, Schema, IConstraintBuilder } from './model/schema'
import { Jemv } from './manager/jemv'
export * from './model/schema'
export * from './manager'

export const jemv = Jemv.instance

export const addFormat = (key:string, pattern:string) => {
	jemv.addFormat(key, pattern)
}

export const addConstraintBuilder = (constraintBuilder:IConstraintBuilder) => {
	jemv.addConstraintBuilder(constraintBuilder)
}

export const add = (schema:Schema):Schema => {
	return jemv.add(schema) as Schema
}

export const get = (key:string):Schema => {
	return jemv.get(key) as Schema
}

export const load = async (value:string|Schema): Promise<Schema[]> => {
	return jemv.load(value) as Promise<Schema[]>
}

export const normalize = (schema:Schema):Schema => {
	return jemv.normalize(schema) as Schema
}

export const validate = async (schema: string|Schema, data:any) : Promise<ValidationResult> => {
	return jemv.validate(schema, data)
}
