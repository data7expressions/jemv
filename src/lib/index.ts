import { ValidateResult, Schema, IConstraintBuilder } from './model/schema'
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

export const validate = async (schema: string|Schema, data:any) : Promise<ValidateResult> => {
	return jemv.validate(schema, data)
}
