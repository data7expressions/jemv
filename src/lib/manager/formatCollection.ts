/* eslint-disable @typescript-eslint/ban-types */
export class FormatCollection {
	public formats: any
	constructor () {
		this.formats = {}
	}

	public add (key:string, pattern:string):void {
		this.formats[key] = new RegExp(pattern)
	}

	public get (name:string): RegExp {
		return this.formats[name]
	}

	public test (name:string, value:any): boolean {
		const format = this.formats[name] as RegExp
		if (format) {
			return format.test(value)
		}
		throw new Error(`Format ${name} not found`)
	}
}
