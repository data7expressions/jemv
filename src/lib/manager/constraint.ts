import { IConstraint, EvalError } from '../model/schema'

export class FunctionConstraint implements IConstraint {
	private func: (value:any, path:string) => EvalError[]
	constructor (func: (value:any, path:string) => EvalError[]) {
		this.func = func
	}

	public eval (value:any, path:string) : EvalError[] {
		return this.func(value, path)
	}
}

export class AndConstraint implements IConstraint {
	private constraints: IConstraint[]
	constructor (constraints: IConstraint[]) {
		this.constraints = constraints
	}

	public eval (value:any, path:string): EvalError[] {
		const errors:EvalError[] = []
		for (const constraint of this.constraints) {
			const childErrors = constraint.eval(value, path)
			if (childErrors.length > 0) {
				errors.push(...childErrors)
			}
		}
		return errors
	}
}
