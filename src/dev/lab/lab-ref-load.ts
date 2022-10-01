/* eslint-disable no-unexpected-multiline */
import { jemv, Helper } from '../../lib'

(async () => {
	try {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
		const file = './data/tests/ref.json'
		const content = await Helper.fs.read(file)
		if (content === null) {
			throw new Error(`file ${file} not found`)
		}
		const target:any[] = []
		const source = Helper.utils.tryParse(content)
		for (const _case of source) {
			const loaded = await jemv.load(_case.schema)
			target.push(loaded)
		}
		await Helper.fs.write('./src/dev/lab/load.json', JSON.stringify(target, null, 2))
	} catch (error:any) {
		console.error(error)
	}
})()
