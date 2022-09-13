import { ValidateResult, Schema, IConstraintBuilder, ISchemaCompleter, ISchemaBuilder, ISchemaCollection, ISchemaValidator, IConstraintFactory } from '../model/schema'
import { FormatCollection } from './formatCollection'
import {
	TypeConstraintBuilder, MultipleOfConstraintBuilder, MinMaxPropertiesConstraintBuilder, MinMaxItemsConstraintBuilder,
	UniqueItemsConstraintBuilder, MinMaxLengthConstraintBuilder, MinMaxConstraintBuilder, PrefixItemsConstraintBuilder,
	RequiredConstraintBuilder, EnumConstraintBuilder, FormatConstraintBuilder, PatternConstraintBuilder, PatternPropertyConstraintBuilder,
	ContainsConstraintBuilder, ConstConstraintBuilder
} from './constraintBuilders'
import { SchemaCompleter, SchemaBuilder, SchemaCollection, SchemaValidator } from './'

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
		const schemaBuilder = new SchemaBuilder()
		this.builder = schemaBuilder
		this.constraintFactory = schemaBuilder
		this.constraintFactory.addConstraintBuilder(new TypeConstraintBuilder(this.formats))
		this.constraintFactory.addConstraintBuilder(new MultipleOfConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new MinMaxPropertiesConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new MinMaxItemsConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new UniqueItemsConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new MinMaxLengthConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new MinMaxConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new PrefixItemsConstraintBuilder(this.constraintFactory))
		this.constraintFactory.addConstraintBuilder(new RequiredConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new EnumConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new PatternConstraintBuilder())
		this.constraintFactory.addConstraintBuilder(new PatternPropertyConstraintBuilder(this.constraintFactory))
		this.constraintFactory.addConstraintBuilder(new ContainsConstraintBuilder(this.constraintFactory))
		this.constraintFactory.addConstraintBuilder(new FormatConstraintBuilder(this.formats))
		this.constraintFactory.addConstraintBuilder(new ConstConstraintBuilder())
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
		this.constraintFactory.addConstraintBuilder(constraintBuilder)
	}

	public async validate (schema: string|Schema, data:any) : Promise<ValidateResult> {
		const builded = await this.schemas.get(schema)
		return this.validator.validate(builded, data)
	}
}
