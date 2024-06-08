[jemv](../README.md) / IConstraintManager

# Interface: IConstraintManager

## Implemented by

- [`ConstraintManager`](../classes/ConstraintManager.md)

## Table of contents

### Methods

- [addBuilder](IConstraintManager.md#addbuilder)
- [build](IConstraintManager.md#build)

## Methods

### addBuilder

▸ **addBuilder**(`constraintBuilder`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintBuilder` | [`IConstraintBuilder`](IConstraintBuilder.md) |

#### Returns

`any`

#### Defined in

[src/lib/model/schema.ts:111](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L111)

___

### build

▸ **build**(`root`, `rule`): `undefined` \| [`IConstraint`](IConstraint.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | [`Schema`](Schema.md) |
| `rule` | [`Schema`](Schema.md) |

#### Returns

`undefined` \| [`IConstraint`](IConstraint.md)

#### Defined in

[src/lib/model/schema.ts:112](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/model/schema.ts#L112)
