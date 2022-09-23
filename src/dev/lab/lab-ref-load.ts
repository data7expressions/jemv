/* eslint-disable no-unexpected-multiline */
import { jemv, Helper } from '../../lib'

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const file = './data/tests/ref.json'
		const content = await Helper.readFile(file)
		if (content === null) {
			throw new Error(`file ${file} not found`)
		}
		const target:any[] = []
		const source = Helper.tryParse(content)
		for (const _case of source) {
			const download = await jemv.load(_case.schema)
			target.push(download)
		}
		await Helper.writeFile('./src/dev/lab/normalized.json', JSON.stringify(target, null, 2))
	} catch (error:any) {
		console.error(error)
	}
})()
