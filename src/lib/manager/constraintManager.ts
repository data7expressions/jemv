import { Schema, IConstraint, IConstraintBuilder, IConstraintManager } from '../model/schema'
import { AndConstraint } from './constraint'

export class ConstraintManager implements IConstraintManager {
	private builders:IConstraintBuilder[] = []

	public addBuilder (constraintBuilder: IConstraintBuilder) {
		this.builders.push(constraintBuilder)
	}

	public build (root:Schema, rule: Schema): IConstraint | undefined {
		const constraints:IConstraint[] = []
		for (const constraintBuilder of this.builders) {
			if (constraintBuilder.apply(rule)) {
				constraints.push(constraintBuilder.build(root, rule))
			}
		}
		if (constraints.length === 0) {
			return undefined
		}
		return new AndConstraint(constraints)
	}
}
