import { IConstraint, EvalResult } from '../model/schema'

export class FunctionConstraint implements IConstraint {
	private func: (value:any) => EvalResult
	constructor (func: (value:any) => EvalResult) {
		this.func = func
	}

	public eval (value:any) : EvalResult {
		return this.func(value)
	}
}

export class AndConstraint implements IConstraint {
	private constraints: IConstraint[]
	constructor (constraints: IConstraint[]) {
		this.constraints = constraints
	}

	public eval (value:any): EvalResult {
		for (const constraint of this.constraints) {
			const result = constraint.eval(value)
			if (!result.valid) {
				return result
			}
		}
		return { valid: true }
	}
}
