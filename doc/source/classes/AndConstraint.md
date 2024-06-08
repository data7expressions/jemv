[jemv](../README.md) / AndConstraint

# Class: AndConstraint

## Implements

- [`IConstraint`](../interfaces/IConstraint.md)

## Table of contents

### Constructors

- [constructor](AndConstraint.md#constructor)

### Methods

- [eval](AndConstraint.md#eval)

## Constructors

### constructor

• **new AndConstraint**(`constraints`): [`AndConstraint`](AndConstraint.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `constraints` | [`IConstraint`](../interfaces/IConstraint.md)[] |

#### Returns

[`AndConstraint`](AndConstraint.md)

#### Defined in

[src/lib/manager/constraint.ts:16](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/constraint.ts#L16)

## Methods

### eval

▸ **eval**(`value`, `path`): [`EvalError`](../interfaces/EvalError.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `path` | `string` |

#### Returns

[`EvalError`](../interfaces/EvalError.md)[]

#### Implementation of

[IConstraint](../interfaces/IConstraint.md).[eval](../interfaces/IConstraint.md#eval)

#### Defined in

[src/lib/manager/constraint.ts:20](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/constraint.ts#L20)
