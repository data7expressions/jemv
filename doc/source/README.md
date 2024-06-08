jemv

# jemv

## Table of contents

### Enumerations

- [PropertyType](enums/PropertyType.md)

### Classes

- [AndConstraint](classes/AndConstraint.md)
- [ConstraintManager](classes/ConstraintManager.md)
- [FunctionConstraint](classes/FunctionConstraint.md)
- [Jemv](classes/Jemv.md)
- [JemvBuilder](classes/JemvBuilder.md)

### Interfaces

- [BuildedSchema](interfaces/BuildedSchema.md)
- [ContentSchema](interfaces/ContentSchema.md)
- [EvalError](interfaces/EvalError.md)
- [IConstraint](interfaces/IConstraint.md)
- [IConstraintBuilder](interfaces/IConstraintBuilder.md)
- [IConstraintManager](interfaces/IConstraintManager.md)
- [InternalId](interfaces/InternalId.md)
- [PropertyNames](interfaces/PropertyNames.md)
- [Schema](interfaces/Schema.md)
- [ValidationResult](interfaces/ValidationResult.md)

### Variables

- [Helper](README.md#helper)
- [jemv](README.md#jemv)

### Functions

- [add](README.md#add)
- [addConstraintBuilder](README.md#addconstraintbuilder)
- [addFormat](README.md#addformat)
- [get](README.md#get)
- [load](README.md#load)
- [normalize](README.md#normalize)
- [validate](README.md#validate)

## Variables

### Helper

• `Const` **Helper**: `H3lp` = `h3lp`

#### Defined in

[src/lib/manager/index.ts:5](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/index.ts#L5)

___

### jemv

• `Const` **jemv**: [`Jemv`](classes/Jemv.md) = `Jemv.instance`

#### Defined in

[src/lib/index.ts:6](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L6)

## Functions

### add

▸ **add**(`schema`): [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](interfaces/Schema.md) |

#### Returns

[`Schema`](interfaces/Schema.md)

#### Defined in

[src/lib/index.ts:16](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L16)

___

### addConstraintBuilder

▸ **addConstraintBuilder**(`constraintBuilder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintBuilder` | [`IConstraintBuilder`](interfaces/IConstraintBuilder.md) |

#### Returns

`void`

#### Defined in

[src/lib/index.ts:12](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L12)

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

[src/lib/index.ts:8](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L8)

___

### get

▸ **get**(`key`): [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

[`Schema`](interfaces/Schema.md)

#### Defined in

[src/lib/index.ts:20](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L20)

___

### load

▸ **load**(`value`): `Promise`\<[`Schema`](interfaces/Schema.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| [`Schema`](interfaces/Schema.md) |

#### Returns

`Promise`\<[`Schema`](interfaces/Schema.md)[]\>

#### Defined in

[src/lib/index.ts:24](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L24)

___

### normalize

▸ **normalize**(`schema`): [`Schema`](interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](interfaces/Schema.md) |

#### Returns

[`Schema`](interfaces/Schema.md)

#### Defined in

[src/lib/index.ts:28](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L28)

___

### validate

▸ **validate**(`schema`, `data`): `Promise`\<[`ValidationResult`](interfaces/ValidationResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](interfaces/Schema.md) |
| `data` | `any` |

#### Returns

`Promise`\<[`ValidationResult`](interfaces/ValidationResult.md)\>

#### Defined in

[src/lib/index.ts:32](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/index.ts#L32)
