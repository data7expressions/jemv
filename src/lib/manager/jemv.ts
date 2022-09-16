import { EvalError, ValidationResult, Schema, IConstraintBuilder, ISchemaCompleter, ISchemaBuilder, ISchemaCollection, ISchemaValidator, IConstraintFactory } from '../model/schema'
import { FormatCollection } from './formatCollection'
import {
	TypeConstraintBuilder, MultipleOfConstraintBuilder, MinMaxPropertiesConstraintBuilder, MinMaxItemsConstraintBuilder,
	UniqueItemsConstraintBuilder, MinMaxLengthConstraintBuilder, MinMaxConstraintBuilder, PrefixItemsConstraintBuilder,
	RequiredConstraintBuilder, EnumConstraintBuilder, FormatConstraintBuilder, PatternConstraintBuilder, PatternPropertyConstraintBuilder,
	ContainsConstraintBuilder, ConstConstraintBuilder, BooleanSchemaConstraintBuilder, IfConstraintBuilder
} from './constraintBuilders'
import { SchemaCompleter, SchemaBuilder, SchemaCollection, ConstraintFactory } from './'

export class Jemv {
	private formats: FormatCollection
	private completer: ISchemaCompleter
	private builder: ISchemaBuilder
	private constraintFactory: IConstraintFactory
	private schemas: ISchemaCollection
	constructor () {
		this.formats = new FormatCollection()
		this.completer = new SchemaCompleter()
		this.constraintFactory = new ConstraintFactory()
		this.builder = new SchemaBuilder(this.constraintFactory)
		this.schemas = new SchemaCollection(this.completer, this.builder)
		this._addFormats()
		this._addConstraintsBuilder()
	}

	private _addConstraintsBuilder () {
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
		this.constraintFactory.addBuilder(new IfConstraintBuilder(this.constraintFactory))
	}

	private _addFormats () {
		this.formats.add('email', '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
		this.formats.add('idn-email', '')
		this.formats.add('integer', '^\\d+$')
		this.formats.add('decimal', '^\\d+\\.\\d+$')
		this.formats.add('string', '^[a-zA-Z0-9_.]+$')
		// https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
		this.formats.add('date', '^\\d{4}-\\d{2}-\\d{2}$')
		this.formats.add('date-time', '\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)')
		this.formats.add('datetime', '\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)')
		this.formats.add('time', '\\[0-2]\\d:[0-5]\\d:[0-5]\\d')
		this.formats.add('duration', '/^P(?!$)((\\d+Y)?(\\d+M)?(\\d+D)?(T(?=\\d)(\\d+H)?(\\d+M)?(\\d+S)?)?|(\\d+W)?)$/')
		this.formats.add('regex', '')
		this.formats.add('ipv4', '/^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$/')
		this.formats.add('ipv6', '/^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))$/i')
		this.formats.add('idn-hostname', '')
		this.formats.add('hostname', '/^(?=.{1,253}\\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\\.?$/i')
		this.formats.add('uuid', '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
		this.formats.add('uri', '/^(?:[a-z][a-z0-9+\\-.]*:)?(?:\\/?\\/(?:(?:[a-z0-9\\-._~!$&\'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\\.[a-z0-9\\-._~!$&\'()*+,;=:]+)\\]|(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)|(?:[a-z0-9\\-._~!$&\'"()*+,;=]|%[0-9a-f]{2})*)(?::\\d*)?(?:\\/(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})*)*|\\/(?:(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})+(?:\\/(?:[a-z0-9\\-._~!$&\'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\\?(?:[a-z0-9\\-._~!$&\'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\\-._~!$&\'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i')
		this.formats.add('uri-template', '/^(?:(?:[^\\x00-\\x20"\'<>%\\\\^`{|}]|%[0-9a-f]{2})|\\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\\*)?)*\\})*$/i')
		this.formats.add('uri-reference', '/(https?:\\/\\/[^\\s]+)/g')
		this.formats.add('iri', '')
		this.formats.add('iri-reference', '')
		this.formats.add('json-pointer', '/^(?:\\/(?:[^~/]|~0|~1)*)*$/')
		this.formats.add('relative-json-pointer', '/^(?:0|[1-9][0-9]*)(?:#|(?:\\/(?:[^~/]|~0|~1)*)*)$/')
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

	public async validate (schema: string|Schema, data:any) : Promise<ValidationResult> {
		const builded = await this.schemas.get(schema)
		const errors:EvalError[] = []
		if (data === undefined) {
			errors.push({ path: '.', message: 'data is empty' })
		} else if (builded.constraint) {
			const childErrors = builded.constraint.eval(data, '.')
			if (childErrors.length > 0) {
				errors.push(...childErrors)
			}
		}
		return { valid: errors.length === 0, errors: errors }
	}
}
