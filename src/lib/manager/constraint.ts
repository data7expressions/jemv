import { IConstraint, EvalError } from '../model/schema'

export class FunctionConstraint implements IConstraint {
	private func: (value:any, path:string) => Promise<EvalError[]>
	constructor (func: (value:any, path:string) => Promise<EvalError[]>) {
		this.func = func
	}

	public async eval (value:any, path:string) : Promise<EvalError[]> {
		return this.func(value, path)
	}
}

export class AndConstraint implements IConstraint {
	private constraints: IConstraint[]
	constructor (constraints: IConstraint[]) {
		this.constraints = constraints
	}

	public async eval (value:any, path:string): Promise<EvalError[]> {
		const errors:EvalError[] = []
		for (const constraint of this.constraints) {
			const childErrors = await constraint.eval(value, path)
			if (childErrors.length > 0) {
				errors.push(...childErrors)
			}
		}
		return errors
	}
}
