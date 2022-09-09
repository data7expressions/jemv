import { ValidateResult, Schema, BuildedSchema, ConstraintBuilder, ConstraintValidator } from './model/schema'
import { Jemv } from './manager/jemv'
export * from './model/schema'
export * from './manager/schema'

export const jemv = Jemv.instance

export const addFormat = (key:string, pattern:string) => {
	jemv.addFormat(key, pattern)
}

export const addConstraintBuilder = (constraintBuilder:ConstraintBuilder) => {
	jemv.addConstraintBuilder(constraintBuilder)
}

export const addConstraintValidator = (constraintValidator:ConstraintValidator) => {
	jemv.addConstraintValidator(constraintValidator)
}

export const add = (schema: Schema) : BuildedSchema => {
	return jemv.add(schema)
}

export const get = async (uri: string) : Promise<BuildedSchema> => {
	return jemv.get(uri)
}

export const complete = (schema: Schema): Schema => {
	return jemv.complete(schema)
}

export const build = (schema: Schema): BuildedSchema => {
	return jemv.build(schema)
}

export const validate = async (schema: string|Schema, data:any) : Promise<ValidateResult> => {
	return jemv.validate(schema, data)
}
