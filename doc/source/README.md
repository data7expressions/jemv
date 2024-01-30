jemv

# jemv

## Table of contents

### Enumerations

- [PropertyType](enums/PropertyType.md)

### Classes

- [CoreConstraintBuilder](classes/CoreConstraintBuilder.md)
- [FormatCollection](classes/FormatCollection.md)
- [FunctionConstraintValidator](classes/FunctionConstraintValidator.md)
- [Jemv](classes/Jemv.md)
- [SchemaBuilder](classes/SchemaBuilder.md)
- [SchemaCollection](classes/SchemaCollection.md)
- [SchemaCompleter](classes/SchemaCompleter.md)
- [SchemaValidator](classes/SchemaValidator.md)

### Interfaces

- [BuildedSchema](interfaces/BuildedSchema.md)
- [Constraint](interfaces/Constraint.md)
- [ConstraintBuilder](interfaces/ConstraintBuilder.md)
- [ConstraintValidator](interfaces/ConstraintValidator.md)
- [Contains](interfaces/Contains.md)
- [ContentSchema](interfaces/ContentSchema.md)
- [FunctionConstraint](interfaces/FunctionConstraint.md)
- [PropertyNames](interfaces/PropertyNames.md)
- [Schema](interfaces/Schema.md)
- [ValidateError](interfaces/ValidateError.md)
- [ValidateResult](interfaces/ValidateResult.md)

### Variables

- [jemv](README.md#jemv)

### Functions

- [add](README.md#add)
- [addConstraintBuilder](README.md#addconstraintbuilder)
- [addConstraintValidator](README.md#addconstraintvalidator)
- [addFormat](README.md#addformat)
- [build](README.md#build)
- [complete](README.md#complete)
- [get](README.md#get)
- [validate](README.md#validate)

## Variables

### jemv

• `Const` **jemv**: [`Jemv`](classes/Jemv.md) = `Jemv.instance`

#### Defined in

[index.ts:7](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L7)

## Functions

### add

▸ **add**(`schema`): [`BuildedSchema`](interfaces/BuildedSchema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](interfaces/Schema.md) |

#### Returns

[`BuildedSchema`](interfaces/BuildedSchema.md)

#### Defined in

[index.ts:21](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L21)

___

### addConstraintBuilder

▸ **addConstraintBuilder**(`constraintBuilder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintBuilder` | [`ConstraintBuilder`](interfaces/ConstraintBuilder.md) |

#### Returns

`void`

#### Defined in

[index.ts:13](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L13)

___

### addConstraintValidator

▸ **addConstraintValidator**(`constraintValidator`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintValidator` | [`ConstraintValidator`](interfaces/ConstraintValidator.md) |

#### Returns

`void`

#### Defined in

[index.ts:17](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L17)

___

### addFormat

▸ **addFormat**(`key`, `pattern`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `pattern` | `string` |

#### Returns

`void`

#### Defined in

[index.ts:9](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L9)

___

### build

▸ **build**(`schema`): [`BuildedSchema`](interfaces/BuildedSchema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](interfaces/Schema.md) |

#### Returns

[`BuildedSchema`](interfaces/BuildedSchema.md)

#### Defined in

[index.ts:33](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L33)

___

### complete

▸ **complete**(`schema`): [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](interfaces/Schema.md) |

#### Returns

[`Schema`](interfaces/Schema.md)

#### Defined in

[index.ts:29](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L29)

___

### get

▸ **get**(`uri`): `Promise`<[`BuildedSchema`](interfaces/BuildedSchema.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uri` | `string` |

#### Returns

`Promise`<[`BuildedSchema`](interfaces/BuildedSchema.md)\>

#### Defined in

[index.ts:25](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L25)

___

### validate

▸ **validate**(`schema`, `data`): `Promise`<[`ValidateResult`](interfaces/ValidateResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](interfaces/Schema.md) |
| `data` | `any` |

#### Returns

`Promise`<[`ValidateResult`](interfaces/ValidateResult.md)\>

#### Defined in

[index.ts:37](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/index.ts#L37)
