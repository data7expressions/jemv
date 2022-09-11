/* eslint-disable no-unexpected-multiline */
import { jemv, Helper } from '../../lib'
import path from 'path'

interface Test {
	description:string
	data:any
	valid:boolean
}

interface Test {
	description:string
	data:any
	valid:boolean
}

interface TestCase {
	description:string
	schema:any
	tests:Test[]
}

interface TestSuite {
	file:string
	cases:TestCase[]
}

interface TestInvalid {
	case:string
	schema: any
	tests:Test[]
}

const validate = async (suite:TestSuite):Promise<TestInvalid[]> => {
	const invalids:TestInvalid[] = []
	for (const _case of suite.cases) {
		const invalidTest:Test[] = []
		for (const test of _case.tests) {
			const result = await jemv.validate(_case.schema, test.data)
			if (result.valid !== test.valid) {
				invalidTest.push(test)
			}
		}
		if (invalidTest.length > 0) {
			invalids.push({ case: _case.description, schema: _case.schema, tests: invalidTest })
		}
	}
	return invalids
}

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const file = './data/maximum.json'
		const contents = await Helper.readFile(file)
		if (contents === null) {
			throw new Error(`${file} not found`)
		}
		const cases = Helper.tryParse(contents) as TestCase[]
		if (cases === undefined) {
			throw new Error(`invalid test suite ${file}`)
		}
		const suite = { cases: cases, file: file }
		const invalids = await validate(suite)
		if (invalids.length > 0) {
			await Helper.writeFile(path.join('./data/results/', suite.file), JSON.stringify(invalids, null, 2))
		}
	} catch (error:any) {
		console.error(error)
	}
})()
