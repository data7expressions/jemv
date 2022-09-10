[jemv](../README.md) / FunctionConstraintValidator

# Class: FunctionConstraintValidator

## Implements

- [`ConstraintValidator`](../interfaces/ConstraintValidator.md)

## Table of contents

### Constructors

- [constructor](FunctionConstraintValidator.md#constructor)

### Methods

- [apply](FunctionConstraintValidator.md#apply)
- [validate](FunctionConstraintValidator.md#validate)

## Constructors

### constructor

• **new FunctionConstraintValidator**()

## Methods

### apply

▸ **apply**(`constraint`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraint` | [`Constraint`](../interfaces/Constraint.md) |

#### Returns

`boolean`

#### Implementation of

[ConstraintValidator](../interfaces/ConstraintValidator.md).[apply](../interfaces/ConstraintValidator.md#apply)

#### Defined in

[manager/schema.ts:573](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L573)

___

### validate

▸ **validate**(`constraint`, `data`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraint` | [`Constraint`](../interfaces/Constraint.md) |
| `data` | `any` |

#### Returns

`boolean`

#### Implementation of

[ConstraintValidator](../interfaces/ConstraintValidator.md).[validate](../interfaces/ConstraintValidator.md#validate)

#### Defined in

[manager/schema.ts:577](https://github.com/FlavioLionelRita/jemv/blob/b3abfe7/src/lib/manager/schema.ts#L577)
