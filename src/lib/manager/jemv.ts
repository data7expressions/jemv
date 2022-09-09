import { ValidateResult, Schema, BuildedSchema, ConstraintBuilder, ConstraintValidator } from '../model/schema'
import { FormatCollection, SchemaCompleter, SchemaBuilder, SchemaCollection, SchemaValidator, CoreConstraintBuilder, FunctionConstraintValidator } from './schema'

export class Jemv {
	private formats: FormatCollection
	private completer: SchemaCompleter
	private builder: SchemaBuilder
	private schemas: SchemaCollection
	private validator: SchemaValidator
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
		this.builder = new SchemaBuilder()
		this.builder.add(new CoreConstraintBuilder(this.formats))
		this.schemas = new SchemaCollection(this.completer, this.builder)
		this.validator = new SchemaValidator(this.schemas)
		this.validator.add(new FunctionConstraintValidator())
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

	public addConstraintBuilder (constraintBuilder:ConstraintBuilder) {
		this.builder.add(constraintBuilder)
	}

	public addConstraintValidator (constraintValidator:ConstraintValidator) {
		this.validator.add(constraintValidator)
	}

	public add (schema: Schema) : BuildedSchema {
		return this.schemas.add(schema)
	}

	public async get (uri: string) : Promise<BuildedSchema> {
		return this.schemas.get(uri)
	}

	public complete (schema: Schema): Schema {
		return this.completer.complete(schema)
	}

	public build (schema: Schema): BuildedSchema {
		return this.add(schema)
	}

	public async validate (schema: string|Schema, data:any) : Promise<ValidateResult> {
		const builded = await this.schemas.solve(schema)
		return this.validator.validate(builded, data)
	}
}
