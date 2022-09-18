import { ValidationResult, Schema, ISchemaManager, IConstraintBuilder, ISchemaNormalizer, ISchemaBuilder, ISchemaProvider, IConstraintManager } from '../model/schema'
import { FormatCollection } from './formatCollection'
import {
	TypeConstraintBuilder, MultipleOfConstraintBuilder, MinMaxPropertiesConstraintBuilder, MinMaxItemsConstraintBuilder,
	UniqueItemsConstraintBuilder, MinMaxLengthConstraintBuilder, MinMaxConstraintBuilder, PrefixItemsConstraintBuilder,
	RequiredConstraintBuilder, EnumConstraintBuilder, FormatConstraintBuilder, PatternConstraintBuilder, PatternPropertyConstraintBuilder,
	ContainsConstraintBuilder, ConstConstraintBuilder, BooleanSchemaConstraintBuilder, IfConstraintBuilder, PropertiesConstraintBuilder,
	ItemsConstraintBuilder, RefConstraintBuilder
} from './constraintBuilders'
import { SchemaNormalizer, SchemaBuilder, SchemaProvider, SchemaManager, ConstraintManager } from './'

export class Jemv {
	private formats: FormatCollection
	private normalizer: ISchemaNormalizer
	private builder: ISchemaBuilder
	private provider: ISchemaProvider
	private constraints: IConstraintManager
	private manager: ISchemaManager
	constructor () {
		this.formats = new FormatCollection()
		this.normalizer = new SchemaNormalizer()
		this.constraints = new ConstraintManager()
		this.builder = new SchemaBuilder(this.constraints)
		this.provider = new SchemaProvider(this.normalizer)
		this.manager = new SchemaManager(this.provider, this.builder)
		this._addFormats()
		this._addConstraintsBuilder()
	}

	private _addConstraintsBuilder () {
		this.constraints.addBuilder(new ItemsConstraintBuilder(this.constraints))
		this.constraints.addBuilder(new PropertiesConstraintBuilder(this.constraints))
		this.constraints.addBuilder(new RequiredConstraintBuilder())
		this.constraints.addBuilder(new TypeConstraintBuilder(this.formats))
		this.constraints.addBuilder(new EnumConstraintBuilder())
		this.constraints.addBuilder(new FormatConstraintBuilder(this.formats))
		this.constraints.addBuilder(new UniqueItemsConstraintBuilder())
		this.constraints.addBuilder(new RefConstraintBuilder(this.provider, this.constraints))
		this.constraints.addBuilder(new MinMaxPropertiesConstraintBuilder())
		this.constraints.addBuilder(new MinMaxItemsConstraintBuilder())
		this.constraints.addBuilder(new MinMaxLengthConstraintBuilder())
		this.constraints.addBuilder(new MinMaxConstraintBuilder())
		this.constraints.addBuilder(new MultipleOfConstraintBuilder())
		this.constraints.addBuilder(new PrefixItemsConstraintBuilder(this.constraints))
		this.constraints.addBuilder(new PatternConstraintBuilder())
		this.constraints.addBuilder(new PatternPropertyConstraintBuilder(this.constraints))
		this.constraints.addBuilder(new ContainsConstraintBuilder(this.constraints))
		this.constraints.addBuilder(new ConstConstraintBuilder())
		this.constraints.addBuilder(new BooleanSchemaConstraintBuilder())
		this.constraints.addBuilder(new IfConstraintBuilder(this.constraints))
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
		this.constraints.addBuilder(constraintBuilder)
	}

	public async validate (schema: string|Schema, data:any) : Promise<ValidationResult> {
		return this.manager.validate(schema, data)
	}
}
