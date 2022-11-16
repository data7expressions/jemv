const Ajv = require('ajv')
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const schema = {
	$schema: 'https://json-schema.org/draft/2020-12/schema',
	$ref: 'https://json-schema.org/draft/2020-12/schema'
}
const validate = ajv.compile(schema)

const data = {
	description: 'remote ref valid',
	data: { minLength: 1 },
	valid: true
}

const valid = validate(data)
if (!valid) console.log(validate.errors)
