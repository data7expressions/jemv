/* eslint-disable @typescript-eslint/ban-types */
import { IConstraint } from './../model/schema'

export class FunctionConstraint implements IConstraint {
	public message: string
	private func: Function
	constructor (message: string, func: Function) {
		this.message = message
		this.func = func
	}

	public eval (data: any): boolean {
		return this.func(data)
	}
}
