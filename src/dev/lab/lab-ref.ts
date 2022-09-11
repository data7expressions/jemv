/* eslint-disable no-unexpected-multiline */
import { jemv, Helper } from '../../lib'

(async () => {
	try {
		// const dataUri = 'https://raw.githubusercontent.com/FlavioLionelRita/test-data/main/json-schema/arrays.json'
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		// const content = await Helper.get(dataUri)
		// const data = Helper.tryParse(content)

		const data = {
			fruits: ['apple', 'orange', 'pear', 1],
			vegetables: [
				{
					veggieName2: 'potato',
					veggieLike: true
				},
				{
					veggieName: 'broccoli',
					veggieLike: 1
				}
			]
		}
		const schemaUri = 'https://raw.githubusercontent.com/FlavioLionelRita/test-data/main/json-schema/arrays.schema.json'
		const validateInputResult = await jemv.validate(schemaUri, data)
		if (!validateInputResult.valid) {
			await Helper.writeFile('./src/dev/lab/validate-input-errors.json', JSON.stringify(validateInputResult.errors, null, 2))
		}
		console.log(`error: ${validateInputResult.errors.length}`)
	} catch (error:any) {
		console.error(error)
	}
})()
