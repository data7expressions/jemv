import { Rule, IConstraint, IConstraintBuilder, IConstraintFactory } from './../model/schema'
import { AndConstraint } from './constraint'

export class ConstraintFactory implements IConstraintFactory {
	private builders:IConstraintBuilder[] = []

	public addBuilder (constraintBuilder: IConstraintBuilder) {
		this.builders.push(constraintBuilder)
	}

	public build (rule: Rule): IConstraint | undefined {
		const constraints:IConstraint[] = []
		for (const constraintBuilder of this.builders) {
			if (constraintBuilder.apply(rule)) {
				constraints.push(constraintBuilder.build(rule))
			}
		}
		if (constraints.length === 0) {
			return undefined
		}
		return new AndConstraint(constraints)
	}
}