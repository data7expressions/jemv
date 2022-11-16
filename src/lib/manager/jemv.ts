/* eslint-disable no-use-before-define */
import { ValidationResult, Schema, IConstraintBuilder, IConstraintManager, IConstraint, BuildedSchema } from '../model/schema'
import { FormatCollection } from './formatCollection'
import { schemas, ISchemaManager } from 'schema-manager'
import {
	TypeConstraintBuilder, MultipleOfConstraintBuilder, MinMaxPropertiesConstraintBuilder, MinMaxItemsConstraintBuilder,
	UniqueItemsConstraintBuilder, MinMaxLengthConstraintBuilder, MinMaxConstraintBuilder, PrefixItemsConstraintBuilder,
	RequiredConstraintBuilder, EnumConstraintBuilder, FormatConstraintBuilder, PatternConstraintBuilder,
	ContainsConstraintBuilder, ConstConstraintBuilder, BooleanSchemaConstraintBuilder, IfConstraintBuilder, PropertiesConstraintBuilder,
	ItemsConstraintBuilder, RefConstraintBuilder
} from './constraintBuilders'
import { ConstraintManager, Helper } from './'

export class JemvBuilder {
	public build () :Jemv {
		const formats = new FormatCollection()
		const constraints = new ConstraintManager()
		this.addCoreFormats(formats)
		this.addCoreConstraintsBuilder(constraints, formats, schemas)
		return new Jemv(formats, constraints, schemas)
	}

	private addCoreConstraintsBuilder (constraints: IConstraintManager, formats: FormatCollection, schemas:ISchemaManager) {
		constraints.addBuilder(new ItemsConstraintBuilder(constraints))
		constraints.addBuilder(new PropertiesConstraintBuilder(constraints))
		constraints.addBuilder(new RequiredConstraintBuilder())
		constraints.addBuilder(new TypeConstraintBuilder(formats))
		constraints.addBuilder(new EnumConstraintBuilder())
		constraints.addBuilder(new FormatConstraintBuilder(formats))
		constraints.addBuilder(new UniqueItemsConstraintBuilder())
		constraints.addBuilder(new RefConstraintBuilder(schemas, constraints))
		constraints.addBuilder(new MinMaxPropertiesConstraintBuilder())
		constraints.addBuilder(new MinMaxItemsConstraintBuilder())
		constraints.addBuilder(new MinMaxLengthConstraintBuilder())
		constraints.addBuilder(new MinMaxConstraintBuilder())
		constraints.addBuilder(new MultipleOfConstraintBuilder())
		constraints.addBuilder(new PrefixItemsConstraintBuilder(constraints))
		constraints.addBuilder(new PatternConstraintBuilder())
		// constraints.addBuilder(new PatternPropertyConstraintBuilder(constraints))
		constraints.addBuilder(new ContainsConstraintBuilder(constraints))
		constraints.addBuilder(new ConstConstraintBuilder())
		constraints.addBuilder(new BooleanSchemaConstraintBuilder())
		constraints.addBuilder(new IfConstraintBuilder(constraints))
	}

	private addCoreFormats (formats: FormatCollection) {
		formats.add('email', '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
		formats.add('idn-email', '')
		formats.add('integer', '^\\d+$')
		formats.add('decimal', '^\\d+\\.\\d+$')
		formats.add('string', '^[a-zA-Z0-9_.]+$')
		// https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
		formats.add('date', '^\\d{4}-\\d{2}-\\d{2}$')
		formats.add('date-time', '\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)')
		formats.add('datetime', '\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)')
		formats.add('time', '\\[0-2]\\d:[0-5]\\d:[0-5]\\d')
		formats.add('duration', '/^P(?!$)((\\d+Y)?(\\d+M)?(\\d+D)?(T(?=\\d)(\\d+H)?(\\d+M)?(\\d+S)?)?|(\\d+W)?)$/')
		formats.add('regex', '')
		formats.add('ipv4', '/^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$/')
		formats.add('ipv6', '/^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))$/i')
		formats.add('idn-hostname', '')
		formats.add('hostname', '/^(?=.{1,253}\\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\\.?$/i')
		formats.add('uuid', '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
		formats.add('uri', '/^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&\'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\\.[a-z0-9\\-._~!$&\'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)|(?:[a-z0-9\\-._~!$&\'"()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})*)*|\\/(?:(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\\?(?:[a-z0-9\\-._~!$&\'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&\'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i')
		formats.add('uri-template', '/^(?:(?:[^\\x00-\\x20"\'<>%\\\\^`{|}]|%[0-9a-f]{2})|\\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\\*)?)*\\})*$/i')
		formats.add('uri-reference', '/(https?:\\/\\/[^\\s]+)/g')
		formats.add('iri', '')
		formats.add('iri-reference', '')
		formats.add('json-pointer', '/^(?:\\/(?:[^~/]|~0|~1)*)*$/')
		formats.add('relative-json-pointer', '/^(?:0|[1-9][0-9]*)(?:#|(?:\\/(?:[^~/]|~0|~1)*)*)$/')
	}
}

export class Jemv {
	private built:any = {}
	private formats: FormatCollection
	private constraints: IConstraintManager
	private schemas: ISchemaManager
	constructor (formats: FormatCollection, constraints: IConstraintManager, schemas: ISchemaManager) {
		this.formats = formats
		this.constraints = constraints
		this.schemas = schemas
	}

	private static _instance: Jemv
	public static get instance (): Jemv {
		if (!this._instance) {
			this._instance = new JemvBuilder().build()
		}
		return this._instance
	}

	public addFormat (key:string, pattern:string) {
		this.formats.add(key, pattern)
	}

	public addConstraintBuilder (constraintBuilder:IConstraintBuilder) {
		this.constraints.addBuilder(constraintBuilder)
	}

	public add (schema:Schema):Schema {
		return this.schemas.add(schema) as Schema
	}

	public get (key:string):Schema {
		return this.schemas.get(key) as Schema
	}

	public async load (value:string|Schema): Promise<Schema[]> {
		return this.schemas.load(value) as Promise<Schema[]>
	}

	public normalize (schema:Schema):Schema {
		return this.schemas.normalize(schema) as Schema
	}

	public validate (value: string|Schema, data:any) : ValidationResult {
		if (data === undefined) {
			return { valid: false, errors: [{ path: '.', message: 'data is empty' }] }
		}
		const schema = this.schemas.solve(value) as Schema
		const constraint = this.buildConstraint(schema)
		const errors = constraint ? constraint.eval(data, '.') : []
		return { valid: errors.length === 0, errors }
	}

	private buildConstraint (schema: Schema): IConstraint | undefined {
		if (schema === undefined || schema === null) {
			throw new Error('schema is empty')
		}
		// get a key that uniquely identifies a schema
		const key = schema.$id ? schema.$id : Helper.obj.createKey(schema)
		// look for the schema in the cache list
		let builded = this.built[key] as BuildedSchema | undefined
		if (builded === undefined) {
			// if it doesn't exist in cache, add it
			if (typeof schema === 'object') {
				builded = { $id: schema.$id }
				// this.addDef(builded, schema)
			} else if (typeof schema === 'boolean') {
				builded = { }
			} else {
				throw new Error(`Schema ${schema}  is invalid`)
			}
			builded.constraint = this.constraints.build(schema, schema)
			this.built[key] = builded
		}
		return builded.constraint
	}
}
