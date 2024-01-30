[jemv](../README.md) / FormatCollection

# Class: FormatCollection

## Table of contents

### Constructors

- [constructor](FormatCollection.md#constructor)

### Properties

- [formats](FormatCollection.md#formats)

### Methods

- [add](FormatCollection.md#add)
- [get](FormatCollection.md#get)
- [test](FormatCollection.md#test)

## Constructors

### constructor

• **new FormatCollection**()

#### Defined in

[manager/schema.ts:81](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L81)

## Properties

### formats

• **formats**: `any`

#### Defined in

[manager/schema.ts:80](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L80)

## Methods

### add

▸ **add**(`key`, `pattern`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `pattern` | `string` |

#### Returns

`void`

#### Defined in

[manager/schema.ts:85](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L85)

___

### get

▸ **get**(`name`): `RegExp`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`RegExp`

#### Defined in

[manager/schema.ts:89](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L89)

___

### test

▸ **test**(`name`, `value`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`boolean`

#### Defined in

[manager/schema.ts:93](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L93)
