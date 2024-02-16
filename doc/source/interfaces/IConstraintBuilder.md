[jemv](../README.md) / IConstraintBuilder

# Interface: IConstraintBuilder

## Table of contents

### Methods

- [apply](IConstraintBuilder.md#apply)
- [build](IConstraintBuilder.md#build)

## Methods

### apply

▸ **apply**(`rule`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rule` | [`Schema`](Schema.md) |

#### Returns

`boolean`

#### Defined in

[src/lib/model/schema.ts:107](https://github.com/data7expressions/jemv/blob/d9a8263/src/lib/model/schema.ts#L107)

___

### build

▸ **build**(`root`, `rule`): [`IConstraint`](IConstraint.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | [`Schema`](Schema.md) |
| `rule` | [`Schema`](Schema.md) |

#### Returns

[`IConstraint`](IConstraint.md)

#### Defined in

[src/lib/model/schema.ts:108](https://github.com/data7expressions/jemv/blob/d9a8263/src/lib/model/schema.ts#L108)
