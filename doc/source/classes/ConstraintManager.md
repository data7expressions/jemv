[jemv](../README.md) / ConstraintManager

# Class: ConstraintManager

## Implements

- [`IConstraintManager`](../interfaces/IConstraintManager.md)

## Table of contents

### Constructors

- [constructor](ConstraintManager.md#constructor)

### Methods

- [addBuilder](ConstraintManager.md#addbuilder)
- [build](ConstraintManager.md#build)

## Constructors

### constructor

• **new ConstraintManager**(): [`ConstraintManager`](ConstraintManager.md)

#### Returns

[`ConstraintManager`](ConstraintManager.md)

## Methods

### addBuilder

▸ **addBuilder**(`constraintBuilder`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraintBuilder` | [`IConstraintBuilder`](../interfaces/IConstraintBuilder.md) |

#### Returns

`void`

#### Implementation of

[IConstraintManager](../interfaces/IConstraintManager.md).[addBuilder](../interfaces/IConstraintManager.md#addbuilder)

#### Defined in

[src/lib/manager/constraintManager.ts:7](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/constraintManager.ts#L7)

___

### build

▸ **build**(`root`, `rule`): `undefined` \| [`IConstraint`](../interfaces/IConstraint.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | [`Schema`](../interfaces/Schema.md) |
| `rule` | [`Schema`](../interfaces/Schema.md) |

#### Returns

`undefined` \| [`IConstraint`](../interfaces/IConstraint.md)

#### Implementation of

[IConstraintManager](../interfaces/IConstraintManager.md).[build](../interfaces/IConstraintManager.md#build)

#### Defined in

[src/lib/manager/constraintManager.ts:11](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/constraintManager.ts#L11)
