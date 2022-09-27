/* eslint-disable no-unexpected-multiline */
import { jemv, Helper, ValidationResult } from '../../lib'
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

interface TestInvalid {
	test:Test
	result: ValidationResult
}

interface TestCaseInvalid {
	case:string
	schema: any
	tests:TestInvalid[]
}

interface TestSuiteInvalid {
	file:string
	cases:TestCaseInvalid[]
}

const validate = (suite:TestSuite):TestCaseInvalid[] => {
	const invalids:TestCaseInvalid[] = []
	for (const _case of suite.cases) {
		const invalidTest:TestInvalid[] = []
		for (const test of _case.tests) {
			try {
				const result = jemv.validate(_case.schema, test.data)
				if (result.valid !== test.valid) {
					invalidTest.push({ test: test, result: result })
				}
			} catch (error:any) {
				console.error(`file: ${suite.file}, case : ${_case.description} , test: ${test.description}`)
				console.log(error.stack)
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
		const suites:TestSuite[] = []
		for (const file of files) {
			// const file = './data/maximum.json'
			const contents = await Helper.fs.readFile(file)
			if (contents === null) {
				throw new Error(`${file} not found`)
			}
			const cases = Helper.utils.tryParse(contents) as TestCase[]
			if (cases === undefined) {
				throw new Error(`invalid test suite ${file}`)
			}
			suites.push({ cases: cases, file: file })
		}
		// load
		for (const suite of suites) {
			for (const _case of suite.cases) {
				await jemv.load(_case.schema)
			}
		}
		// validate
		const suitesInvalids:TestSuiteInvalid[] = []
		for (const suite of suites) {
			const invalids = validate(suite)
			if (invalids.length > 0) {
				suitesInvalids.push({ file: suite.file, cases: invalids })
			}
		}
		const totalInvalids = suitesInvalids.reduce((accumulator, p) => accumulator + p.cases.length, 0)
		console.log(`invalids: ${totalInvalids}`)
		await Helper.fs.writeFile('./data/results.json', JSON.stringify(suitesInvalids, null, 2))
	} catch (error:any) {
		console.error(error)
		console.log(error.stack)
	}
})()
