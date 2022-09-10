[jemv](../README.md) / SchemaValidator

# Class: SchemaValidator

## Table of contents

### Constructors

- [constructor](SchemaValidator.md#constructor)

### Methods

- [add](SchemaValidator.md#add)
- [validate](SchemaValidator.md#validate)

## Constructors

### constructor

• **new SchemaValidator**(`schemas`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schemas` | [`SchemaCollection`](SchemaCollection.md) |

#### Defined in

[manager/schema.ts:590](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L590)

## Methods

### add

▸ **add**(`constraintValidator`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintValidator` | [`ConstraintValidator`](../interfaces/ConstraintValidator.md) |

#### Returns

`void`

#### Defined in

[manager/schema.ts:594](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L594)

___

### validate

▸ **validate**(`schema`, `data`): `Promise`<[`ValidateResult`](../interfaces/ValidateResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`BuildedSchema`](../interfaces/BuildedSchema.md) |
| `data` | `any` |

#### Returns

`Promise`<[`ValidateResult`](../interfaces/ValidateResult.md)\>

#### Defined in

[manager/schema.ts:598](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L598)
