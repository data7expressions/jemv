[jemv](../README.md) / FunctionConstraint

# Class: FunctionConstraint

## Implements

- [`IConstraint`](../interfaces/IConstraint.md)

## Table of contents

### Constructors

- [constructor](FunctionConstraint.md#constructor)

### Methods

- [eval](FunctionConstraint.md#eval)

## Constructors

### constructor

• **new FunctionConstraint**(`func`): [`FunctionConstraint`](FunctionConstraint.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | (`value`: `any`, `path`: `string`) => [`EvalError`](../interfaces/EvalError.md)[] |

#### Returns

[`FunctionConstraint`](FunctionConstraint.md)

#### Defined in

[src/lib/manager/constraint.ts:5](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/constraint.ts#L5)

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

[src/lib/manager/constraint.ts:9](https://github.com/data7expressions/jemv/blob/8fc7e43bbe8003ed3c89190ec9032f686bac5421/src/lib/manager/constraint.ts#L9)
