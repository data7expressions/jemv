[jemv](../README.md) / SchemaCollection

# Class: SchemaCollection

## Table of contents

### Constructors

- [constructor](SchemaCollection.md#constructor)

### Methods

- [add](SchemaCollection.md#add)
- [get](SchemaCollection.md#get)
- [getByRef](SchemaCollection.md#getbyref)
- [solve](SchemaCollection.md#solve)

## Constructors

### constructor

• **new SchemaCollection**(`completer`, `builder`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `completer` | [`SchemaCompleter`](SchemaCompleter.md) |
| `builder` | [`SchemaBuilder`](SchemaBuilder.md) |

#### Defined in

[manager/schema.ts:464](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L464)

## Methods

### add

▸ **add**(`source`): [`BuildedSchema`](../interfaces/BuildedSchema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Schema`](../interfaces/Schema.md) |

#### Returns

[`BuildedSchema`](../interfaces/BuildedSchema.md)

#### Defined in

[manager/schema.ts:470](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L470)

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

[manager/schema.ts:480](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L480)

___

### getByRef

▸ **getByRef**(`root`, `parent`, `ref`): `Promise`<[`BuildedSchema`](../interfaces/BuildedSchema.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | [`BuildedSchema`](../interfaces/BuildedSchema.md) |
| `parent` | [`BuildedSchema`](../interfaces/BuildedSchema.md) |
| `ref` | `string` |

#### Returns

`Promise`<[`BuildedSchema`](../interfaces/BuildedSchema.md)\>

#### Defined in

[manager/schema.ts:518](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L518)

___

### solve

▸ **solve**(`schema`): `Promise`<[`BuildedSchema`](../interfaces/BuildedSchema.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `string` \| [`Schema`](../interfaces/Schema.md) |

#### Returns

`Promise`<[`BuildedSchema`](../interfaces/BuildedSchema.md)\>

#### Defined in

[manager/schema.ts:495](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L495)
