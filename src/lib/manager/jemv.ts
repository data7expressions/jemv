import { EvalResult, Schema, IConstraintBuilder, ISchemaCompleter, ISchemaBuilder, ISchemaCollection, ISchemaValidator, IConstraintFactory } from '../model/schema'
import { FormatCollection } from './formatCollection'
import {
	TypeConstraintBuilder, MultipleOfConstraintBuilder, MinMaxPropertiesConstraintBuilder, MinMaxItemsConstraintBuilder,
	UniqueItemsConstraintBuilder, MinMaxLengthConstraintBuilder, MinMaxConstraintBuilder, PrefixItemsConstraintBuilder,
	RequiredConstraintBuilder, EnumConstraintBuilder, FormatConstraintBuilder, PatternConstraintBuilder, PatternPropertyConstraintBuilder,
	ContainsConstraintBuilder, ConstConstraintBuilder, BooleanSchemaConstraintBuilder
} from './constraintBuilders'
import { SchemaCompleter, SchemaBuilder, SchemaCollection, SchemaValidator, ConstraintFactory } from './'

export class Jemv {
	private formats: FormatCollection
	private completer: ISchemaCompleter
	private builder: ISchemaBuilder
	private constraintFactory: IConstraintFactory
	private schemas: ISchemaCollection
	private validator: ISchemaValidator
	constructor () {
		this.formats = new FormatCollection()
		this.formats.add('email', '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
		this.formats.add('integer', '^\\d+$')
		this.formats.add('decimal', '^\\d+\\.\\d+$')
		this.formats.add('string', '^[a-zA-Z0-9_.]+$')
		// https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
		this.formats.add('date', '^\\d{4}-\\d{2}-\\d{2}$')
		this.formats.add('datetime', '\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)')
		this.formats.add('time', '\\[0-2]\\d:[0-5]\\d:[0-5]\\d')
		this.completer = new SchemaCompleter()
		this.constraintFactory = new ConstraintFactory()
		this.builder = new SchemaBuilder(this.constraintFactory)
		this.constraintFactory.addBuilder(new TypeConstraintBuilder(this.formats))
		this.constraintFactory.addBuilder(new MultipleOfConstraintBuilder())
		this.constraintFactory.addBuilder(new MinMaxPropertiesConstraintBuilder())
		this.constraintFactory.addBuilder(new MinMaxItemsConstraintBuilder())
		this.constraintFactory.addBuilder(new UniqueItemsConstraintBuilder())
		this.constraintFactory.addBuilder(new MinMaxLengthConstraintBuilder())
		this.constraintFactory.addBuilder(new MinMaxConstraintBuilder())
		this.constraintFactory.addBuilder(new PrefixItemsConstraintBuilder(this.constraintFactory))
		this.constraintFactory.addBuilder(new RequiredConstraintBuilder())
		this.constraintFactory.addBuilder(new EnumConstraintBuilder())
		this.constraintFactory.addBuilder(new PatternConstraintBuilder())
		this.constraintFactory.addBuilder(new PatternPropertyConstraintBuilder(this.constraintFactory))
		this.constraintFactory.addBuilder(new ContainsConstraintBuilder(this.constraintFactory))
		this.constraintFactory.addBuilder(new FormatConstraintBuilder(this.formats))
		this.constraintFactory.addBuilder(new ConstConstraintBuilder())
		this.constraintFactory.addBuilder(new BooleanSchemaConstraintBuilder())
		this.schemas = new SchemaCollection(this.completer, this.builder)
		this.validator = new SchemaValidator(this.schemas)
	}

	private static _instance: Jemv
	public static get instance (): Jemv {
		if (!this._instance) {
			this._instance = new Jemv()
		}
		return this._instance
	}

	public addFormat (key:string, pattern:string) {
		this.formats.add(key, pattern)
	}

	public addConstraintBuilder (constraintBuilder:IConstraintBuilder) {
		this.constraintFactory.addBuilder(constraintBuilder)
	}

	public async validate (schema: string|Schema, data:any) : Promise<EvalResult> {
		const builded = await this.schemas.get(schema)
		return this.validator.validate(builded, data)
	}
}
