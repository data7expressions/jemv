[jemv](../README.md) / ConstraintValidator

# Interface: ConstraintValidator

## Implemented by

- [`FunctionConstraintValidator`](../classes/FunctionConstraintValidator.md)

## Table of contents

### Methods

- [apply](ConstraintValidator.md#apply)
- [validate](ConstraintValidator.md#validate)

## Methods

### apply

▸ **apply**(`constraint`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraint` | [`Constraint`](Constraint.md) |

#### Returns

`boolean`

#### Defined in

[model/schema.ts:101](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/model/schema.ts#L101)

___

### validate

▸ **validate**(`constraint`, `data`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraint` | [`Constraint`](Constraint.md) |
| `data` | `any` |

#### Returns

`boolean`

#### Defined in

[model/schema.ts:102](https://github.com/data7expressions/jemv/blob/b3abfe7/src/lib/model/schema.ts#L102)
