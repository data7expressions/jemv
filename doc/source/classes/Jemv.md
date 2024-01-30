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
- [addConstraintValidator](Jemv.md#addconstraintvalidator)
- [addFormat](Jemv.md#addformat)
- [build](Jemv.md#build)
- [complete](Jemv.md#complete)
- [get](Jemv.md#get)
- [validate](Jemv.md#validate)

## Constructors

### constructor

• **new Jemv**()

#### Defined in

[manager/jemv.ts:10](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L10)

## Accessors

### instance

• `Static` `get` **instance**(): [`Jemv`](Jemv.md)

#### Returns

[`Jemv`](Jemv.md)

#### Defined in

[manager/jemv.ts:29](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L29)

## Methods

### add

▸ **add**(`schema`): [`BuildedSchema`](../interfaces/BuildedSchema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](../interfaces/Schema.md) |

#### Returns

[`BuildedSchema`](../interfaces/BuildedSchema.md)

#### Defined in

[manager/jemv.ts:48](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L48)

___

### addConstraintBuilder

▸ **addConstraintBuilder**(`constraintBuilder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintBuilder` | [`ConstraintBuilder`](../interfaces/ConstraintBuilder.md) |

#### Returns

`void`

#### Defined in

[manager/jemv.ts:40](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L40)

___

### addConstraintValidator

▸ **addConstraintValidator**(`constraintValidator`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintValidator` | [`ConstraintValidator`](../interfaces/ConstraintValidator.md) |

#### Returns

`void`

#### Defined in

[manager/jemv.ts:44](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L44)

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

[manager/jemv.ts:36](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L36)

___

### build

▸ **build**(`schema`): [`BuildedSchema`](../interfaces/BuildedSchema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](../interfaces/Schema.md) |

#### Returns

[`BuildedSchema`](../interfaces/BuildedSchema.md)

#### Defined in

[manager/jemv.ts:60](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L60)

___

### complete

▸ **complete**(`schema`): [`Schema`](../interfaces/Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](../interfaces/Schema.md) |

#### Returns

[`Schema`](../interfaces/Schema.md)

#### Defined in

[manager/jemv.ts:56](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L56)

___

### get

▸ **get**(`uri`): `Promise`<[`BuildedSchema`](../interfaces/BuildedSchema.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uri` | `string` |

#### Returns

`Promise`<[`BuildedSchema`](../interfaces/BuildedSchema.md)\>

#### Defined in

[manager/jemv.ts:52](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L52)

___

### validate

▸ **validate**(`schema`, `data`): `Promise`<[`ValidateResult`](../interfaces/ValidateResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](../interfaces/Schema.md) |
| `data` | `any` |

#### Returns

`Promise`<[`ValidateResult`](../interfaces/ValidateResult.md)\>

#### Defined in

[manager/jemv.ts:64](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/jemv.ts#L64)
