[jemv](../README.md) / Jemv

# Class: Jemv

## Table of contents

### Constructors

- [constructor](Jemv.md#constructor)

### Accessors

- [instance](Jemv.md#instance)

### Methods

- [add](Jemv.md#add)
- [addConstraintBuilder](Jemv.md#addconstraintbuilder)
- [addFormat](Jemv.md#addformat)
- [get](Jemv.md#get)
- [load](Jemv.md#load)
- [normalize](Jemv.md#normalize)
- [validate](Jemv.md#validate)

## Constructors

### constructor

• **new Jemv**(`formats`, `constraints`, `schemas`): [`Jemv`](Jemv.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `formats` | `FormatCollection` |
| `constraints` | [`IConstraintManager`](../interfaces/IConstraintManager.md) |
| `schemas` | `ISchemaManager` |

#### Returns

[`Jemv`](Jemv.md)

#### Defined in

[src/lib/manager/jemv.ts:79](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L79)

## Accessors

### instance

• `get` **instance**(): [`Jemv`](Jemv.md)

#### Returns

[`Jemv`](Jemv.md)

#### Defined in

[src/lib/manager/jemv.ts:86](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L86)

## Methods

### add

▸ **add**(`schema`): [`Schema`](../interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](../interfaces/Schema.md) |

#### Returns

[`Schema`](../interfaces/Schema.md)

#### Defined in

[src/lib/manager/jemv.ts:101](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L101)

___

### addConstraintBuilder

▸ **addConstraintBuilder**(`constraintBuilder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintBuilder` | [`IConstraintBuilder`](../interfaces/IConstraintBuilder.md) |

#### Returns

`void`

#### Defined in

[src/lib/manager/jemv.ts:97](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L97)

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

[src/lib/manager/jemv.ts:93](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L93)

___

### get

▸ **get**(`key`): [`Schema`](../interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

[`Schema`](../interfaces/Schema.md)

#### Defined in

[src/lib/manager/jemv.ts:105](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L105)

___

### load

▸ **load**(`value`): `Promise`\<[`Schema`](../interfaces/Schema.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| [`Schema`](../interfaces/Schema.md) |

#### Returns

`Promise`\<[`Schema`](../interfaces/Schema.md)[]\>

#### Defined in

[src/lib/manager/jemv.ts:109](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L109)

___

### normalize

▸ **normalize**(`schema`): [`Schema`](../interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](../interfaces/Schema.md) |

#### Returns

[`Schema`](../interfaces/Schema.md)

#### Defined in

[src/lib/manager/jemv.ts:113](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L113)

___

### validate

▸ **validate**(`value`, `data`): [`ValidationResult`](../interfaces/ValidationResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| [`Schema`](../interfaces/Schema.md) |
| `data` | `any` |

#### Returns

[`ValidationResult`](../interfaces/ValidationResult.md)

#### Defined in

[src/lib/manager/jemv.ts:117](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/jemv.ts#L117)
