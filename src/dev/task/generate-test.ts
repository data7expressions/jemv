/* eslint-disable no-unexpected-multiline */
import { jemv, Helper } from '../../lib'
import glob from 'glob'

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

interface TestCaseInvalid {
	case:string
	schema: any
	tests:Test[]
}

interface TestSuiteInvalid {
	file:string
	cases:TestCaseInvalid[]
}

const validate = async (suite:TestSuite):Promise<TestCaseInvalid[]> => {
	const invalids:TestCaseInvalid[] = []
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

const getFiles = async (pattern: string): Promise<string[]> => {
	return new Promise<string[]>((resolve, reject) => {
		glob(pattern, (err: Error | null, matches: string[]) => {
			if (err) {
				reject(err)
			} else {
				resolve(matches)
			}
		})
	})
}

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const files = await getFiles('./data/tests/**/*.json')
		const suitesInvalids:TestSuiteInvalid[] = []
		for (const file of files) {
			// const file = './data/maximum.json'
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
				suitesInvalids.push({ file: file, cases: invalids })
			}
		}
		const totalInvalids = suitesInvalids.reduce((accumulator, p) => accumulator + p.cases.length, 0)
		console.log(`invalids: ${totalInvalids}`)
		if (totalInvalids > 0) {
			await Helper.writeFile('./data/results.json', JSON.stringify(suitesInvalids, null, 2))
		}
	} catch (error:any) {
		console.error(error)
	}
})()
