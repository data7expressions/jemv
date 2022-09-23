import { Schema, IConstraint, IConstraintBuilder, IConstraintManager } from '../model/schema'
import { AndConstraint } from './constraint'

export class ConstraintManager implements IConstraintManager {
	private builders:IConstraintBuilder[] = []

	public addBuilder (constraintBuilder: IConstraintBuilder) {
		this.builders.push(constraintBuilder)
	}

	public async build (root:Schema, rule: Schema): Promise<IConstraint | undefined> {
		const constraints:IConstraint[] = []
		for (const constraintBuilder of this.builders) {
			if (constraintBuilder.apply(rule)) {
				constraints.push(await constraintBuilder.build(root, rule))
			}
		}
		if (constraints.length === 0) {
			return undefined
		}
		return new AndConstraint(constraints)
	}
}
