import { H3lp } from 'h3lp'

export class JemvHelper extends H3lp {
	// actualizar en H3lp
	public override urlJoin (source:string, path:string) : string {
		const isUri = /(https?:\/\/[^\s]+)/g
		if (isUri.test(source)) {
			return new URL(path, source).href
		}
		const pathParts = path.split('/').filter(p => p !== '')
		const sourceParts = source.split('/').filter(p => p !== '')
		const newParts = sourceParts.splice(0, sourceParts.length - pathParts.length)
		return newParts.join('/') + '/' + pathParts.join('/')
	}

	// TODO: pasar a H3lp
	public jsonPath (obj: any, path:string): any {
		const parts = path.split('/')
		let _current = obj as any
		for (let i = 0; i < parts.length; i++) {
			let part = parts[i]
			part = this.decodeUrl(part)
			const child = _current[part]
			if (child === undefined) {
				return undefined
			}
			_current = child
		}
		return _current
	}

	// TODO: pasar a H3lp
	public createKey (data:any) {
		if (data === null) {
			return 'null'
		} else if (Array.isArray(data)) {
			const items:any[] = []
			for (const item of data) {
				items.push(this.createKey(item))
			}
			return `[${items.join(',')}]`
		} else if (typeof data === 'object') {
			const values:any[] = []
			for (const entry of Object.entries(data)) {
				values.push(`${entry[0]}:${this.createKey(entry[1])}`)
			}
			return `{${values.join(',')}}`
		} else {
			return data
		}
	}

	// source.$id === id || source.$id2 === id
	// TODO: pasar a H3lp
	public findInObject (obj: any, predicate: (value:any)=>boolean): any {
		if (Array.isArray(obj)) {
			for (const item of obj) {
				const found = this.findInObject(item, predicate)
				if (found) {
					return found
				}
			}
		} else if (typeof obj === 'object') {
			if (predicate(obj)) {
				return obj
			}
			for (const property of Object.values(obj)) {
				const found = this.findInObject(property, predicate)
				if (found) {
					return found
				}
			}
		}
		return undefined
	}

	// TODO: pasar a H3lp
	public findAllInObject (obj: any, predicate: (value:any)=>boolean): any[] {
		const results:any[] = []
		if (Array.isArray(obj)) {
			for (const item of obj) {
				const found = this.findAllInObject(item, predicate)
				if (found.length > 0) {
					results.push(...found)
				}
			}
		} else if (typeof obj === 'object') {
			if (predicate(obj)) {
				results.push(obj)
			}
			for (const property of Object.values(obj)) {
				const found = this.findAllInObject(property, predicate)
				if (found.length > 0) {
					results.push(...found)
				}
			}
		}
		return results
	}
}
